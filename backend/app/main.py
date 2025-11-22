from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.api import auth, protect, verify, users
from prisma import Prisma
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Virtius 4.0 API")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create directories if they don't exist
os.makedirs("uploads", exist_ok=True)
os.makedirs("protected", exist_ok=True)

# Mount static files for serving protected images
app.mount("/static/protected", StaticFiles(directory="protected"), name="protected")
app.mount("/static/uploads", StaticFiles(directory="uploads"), name="uploads")

# Database Connection
prisma = Prisma()

@app.on_event("startup")
async def startup():
    await prisma.connect()

@app.on_event("shutdown")
async def shutdown():
    await prisma.disconnect()

# Include Routers
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(protect.router, prefix="/protect", tags=["Protection"])
app.include_router(verify.router, prefix="/verify", tags=["Verification"])
app.include_router(users.router, prefix="/user", tags=["User"])

@app.get("/")
async def root():
    return {"message": "Virtius 4.0 API is running"}
