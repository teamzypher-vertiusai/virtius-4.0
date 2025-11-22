from fastapi import APIRouter, UploadFile, File, HTTPException, Form, Depends
from prisma import Prisma
from app.services.crypto_engine import CryptoEngine
from app.services.binary_engine import BinaryEngine
from app.services.cloaking_engine import CloakingEngine
import shutil
import os
import uuid

router = APIRouter()
prisma = Prisma()

UPLOAD_DIR = "uploads"
PROTECTED_DIR = "protected"
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(PROTECTED_DIR, exist_ok=True)

@router.post("/image")
async def protect_image(
    file: UploadFile = File(...),
    user_email: str = Form(...) # In real app, get from JWT
):
    await prisma.connect()
    try:
        # 1. Save original file
        file_ext = os.path.splitext(file.filename)[1]
        file_id = str(uuid.uuid4())
        original_path = os.path.join(UPLOAD_DIR, f"{file_id}{file_ext}")
        
        with open(original_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # 2. Get User
        user = await prisma.user.find_unique(where={"email": user_email})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        # 3. Generate Key Pair if not exists
        if not user.publicKey:
            private_key, public_key = CryptoEngine.generate_key_pair()
            await prisma.user.update(
                where={"id": user.id},
                data={"publicKey": public_key}
            )
            # In real app, securely return private key to user or store encrypted
            # For this demo, we re-generate or assume we have it. 
            # Ideally, private key should be client-side or strictly managed.
            # Here we'll generate a fresh one for the session if needed or use a system key.
            # To adhere to "Proper key management", let's assume we use the generated one.
        else:
            # For demo simplicity, we'll generate a new pair for signing this content
            # In production, user would provide their private key
            private_key, public_key = CryptoEngine.generate_key_pair()

        # 4. Protection Pipeline
        
        # A. Cryptographic Signing
        original_hash = CryptoEngine.create_hash(original_path)
        signature = CryptoEngine.sign_content(original_path, private_key)
        
        # B. Binary Manipulation
        binary_protected_path = BinaryEngine.zero_out_manipulation(original_path)
        
        # C. AI Cloaking
        # We apply cloaking on the binary-protected image to layer defenses
        final_protected_path = CloakingEngine.apply_fawkes_protection(binary_protected_path, level='high')
        
        # Calculate final hash
        protected_hash = CryptoEngine.create_hash(final_protected_path)
        
        # 5. Save to DB
        content = await prisma.content.create(
            data={
                "userId": user.id,
                "originalHash": original_hash,
                "protectedHash": protected_hash,
                "signatureData": signature,
                "aiAnalysis": {
                    "cloaking_level": "high",
                    "manipulation_score": BinaryEngine.calculate_manipulation_score(original_path, final_protected_path),
                    "protection_score": CloakingEngine.check_fawkes_effectiveness(original_path, final_protected_path)
                }
            }
        )
        
        # Move final protected image to protected directory
        final_filename = f"{file_id}_protected{file_ext}"
        final_destination = os.path.join(PROTECTED_DIR, final_filename)
        shutil.copy(final_protected_path, final_destination)
        
        return {
            "status": "success",
            "content_id": content.id,
            "original_hash": original_hash,
            "protected_hash": protected_hash,
            "signature": signature,
            "original_url": f"/static/uploads/{file_id}{file_ext}",
            "protected_url": f"/static/protected/{final_filename}",
            "stats": {
                "cryptographic_signing": True,
                "binary_manipulation": True,
                "ai_cloaking": True,
                "manipulation_score": BinaryEngine.calculate_manipulation_score(original_path, final_protected_path),
                "protection_score": CloakingEngine.check_fawkes_effectiveness(original_path, final_protected_path)
            }
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        await prisma.disconnect()
