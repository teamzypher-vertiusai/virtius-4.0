from fastapi import APIRouter, HTTPException
from prisma import Prisma

router = APIRouter()
prisma = Prisma()

@router.get("/content/{email}")
async def get_user_content(email: str):
    await prisma.connect()
    try:
        user = await prisma.user.find_unique(
            where={"email": email},
            include={"contents": True}
        )
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
            
        return user.contents
    finally:
        await prisma.disconnect()
