from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import upload, analyze
import os

app = FastAPI(
    title="Veritas API",
    description="Research Integrity Platform Backend",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router, prefix="/api")
app.include_router(analyze.router, prefix="/api/analyze")

os.makedirs("temp", exist_ok=True)

@app.get("/")
async def root():
    return {
        "message": "Veritas API is running!",
        "status": "online"
    }

@app.get("/health")
async def health():
    return {"status": "healthy"}