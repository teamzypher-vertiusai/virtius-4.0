from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, protect, verify, users
from prisma import Prisma

app = FastAPI(title="Virtius 4.0 API")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
