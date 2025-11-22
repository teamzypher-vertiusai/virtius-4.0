import asyncio
from prisma import Prisma
from dotenv import load_dotenv
import os

load_dotenv()
load_dotenv("../.env")
print(f"CWD: {os.getcwd()}")
print(f"File exists: {os.path.exists('../.env')}")

async def main():
    print(f"DB URL: {os.getenv('DATABASE_URL')}")
    prisma = Prisma()
    try:
        await prisma.connect()
        print("Successfully connected!")
        await prisma.disconnect()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(main())
