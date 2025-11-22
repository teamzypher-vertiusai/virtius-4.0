from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from prisma import Prisma
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
from typing import Optional

router = APIRouter()
prisma = Prisma()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY = "your-secret-key-generate-with-openssl-rand-base64-32"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

class UserRegister(BaseModel):
    email: str
    password: str
    name: str

class UserLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@router.post("/register", response_model=Token)
async def register(user: UserRegister):
    await prisma.connect()
    try:
        # Check if user exists
        existing_user = await prisma.user.find_unique(where={"email": user.email})
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")

        # Hash password
        hashed_password = pwd_context.hash(user.password)

        # Create user
        new_user = await prisma.user.create(
            data={
                "email": user.email,
                "password": hashed_password,
                "name": user.name
            }
        )

        # Generate token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": new_user.email}, expires_delta=access_token_expires
        )
        return {"access_token": access_token, "token_type": "bearer"}
    finally:
        await prisma.disconnect()

@router.post("/login", response_model=Token)
async def login(user: UserLogin):
    await prisma.connect()
    try:
        # Find user
        db_user = await prisma.user.find_unique(where={"email": user.email})
        if not db_user or not pwd_context.verify(user.password, db_user.password):
            raise HTTPException(status_code=401, detail="Invalid credentials")

        # Generate token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": db_user.email}, expires_delta=access_token_expires
        )
        return {"access_token": access_token, "token_type": "bearer"}
    finally:
        await prisma.disconnect()
