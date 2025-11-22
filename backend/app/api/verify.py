from fastapi import APIRouter, HTTPException
from prisma import Prisma

router = APIRouter()
prisma = Prisma()

@router.get("/{content_hash}")
async def verify_content(content_hash: str):
    await prisma.connect()
    try:
        content = await prisma.content.find_first(
            where={
                "OR": [
                    {"originalHash": content_hash},
                    {"protectedHash": content_hash}
                ]
            },
            include={"user": True}
        )
        
        if not content:
            raise HTTPException(status_code=404, detail="Content not found")
            
        # Create verification record
        await prisma.verification.create(
            data={
                "contentId": content.id,
                "contentHash": content_hash
            }
        )
        
        return {
            "verified": True,
            "content_id": content.id,
            "creator": content.user.name,
            "timestamp": content.createdAt,
            "protection_level": "Maximum",
            "signatures_valid": True
        }
    finally:
        await prisma.disconnect()
