from fastapi import APIRouter, UploadFile, File, HTTPException
from services.pdf_parser import parse_pdf
import shutil
import os

router = APIRouter()

@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are accepted"
        )
    
    file_path = f"temp/{file.filename}"
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    try:
        result = parse_pdf(file_path)
        return {
            "success": True,
            "filename": file.filename,
            "page_count": result["page_count"],
            "text": result["full_text"],
            "message": f"Successfully parsed {result['page_count']} pages"
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to parse PDF: {str(e)}"
        )