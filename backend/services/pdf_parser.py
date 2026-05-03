import fitz

def parse_pdf(file_path: str) -> dict:
    document = fitz.open(file_path)
    
    pages = []
    full_text = ""
    
    for page_number in range(len(document)):
        page = document[page_number]
        page_text = page.get_text()
        pages.append(page_text)
        full_text += page_text + "\n"
    
    document.close()
    
    return {
        "full_text": full_text,
        "pages": pages,
        "page_count": len(pages)
    }