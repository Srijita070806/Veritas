from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.heatmap_builder import build_heatmap
from services.dna_builder import build_dna
from services.graph_builder import build_graph
from typing import List
from dotenv import load_dotenv
from openai import OpenAI
import os
import json

load_dotenv()

router = APIRouter()

def get_gemini_client():
    from groq import Groq
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise ValueError("GROQ_API_KEY not found!")
    return Groq(api_key=api_key)

class HeatmapRequest(BaseModel):
    paper_text: str
    essay_sentences: List[str]

class DNARequest(BaseModel):
    paper_text: str
    essay_text: str

class GraphRequest(BaseModel):
    paper_text: str
    essay_text: str

class SummaryRequest(BaseModel):
    paper_text: str

class CitationRequest(BaseModel):
    essay_text: str

class PlagiarismRequest(BaseModel):
    paper_text: str
    essay_text: str

@router.post("/heatmap")
async def analyze_heatmap(request: HeatmapRequest):
    try:
        result = build_heatmap(
            request.paper_text,
            request.essay_sentences
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/dna")
async def analyze_dna(request: DNARequest):
    try:
        result = build_dna(
            request.paper_text,
            request.essay_text
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/graph")
async def analyze_graph(request: GraphRequest):
    try:
        result = build_graph(
            request.paper_text,
            request.essay_text
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/summary")
async def analyze_summary(request: SummaryRequest):
    try:
        client = get_gemini_client()
        prompt = f"""Summarize this research paper in 4 sections.
Return ONLY this JSON, no explanation, no markdown backticks:
{{
  "overview": "2-3 sentence overview of the paper",
  "methodology": "how the research was conducted",
  "findings": "key results and discoveries",
  "conclusion": "main conclusions and implications"
}}

PAPER:
{request.paper_text[:4000]}"""

        response = client.chat.completions.create(
            model="llama3-8b-8192",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=1000,
            temperature=0.3
        )
        text = response.choices[0].message.content.strip()
        if "```" in text:
            text = text.split("```")[1]
            if text.startswith("json"):
                text = text[4:]
        text = text.strip()
        return json.loads(text)
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=500, detail=f"JSON parse error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/citations")
async def analyze_citations(request: CitationRequest):
    try:
        client = get_gemini_client()
        prompt = f"""Find all citations and references in this essay.
For each citation check if it looks real or AI-hallucinated.
Return ONLY this JSON, no explanation, no markdown backticks:
{{
  "citations": [
    {{
      "text": "the citation text found in essay",
      "status": "real",
      "reason": "brief reason why real or fake"
    }}
  ],
  "real": ["citation1"],
  "suspicious": ["citation2"],
  "fake": ["citation3"]
}}

If no citations found, return empty lists.

ESSAY:
{request.essay_text[:3000]}"""

        response = client.chat.completions.create(
            model="gemini-2.0-flash",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=1000,
            temperature=0.3
        )
        text = response.choices[0].message.content.strip()
        if "```" in text:
            text = text.split("```")[1]
            if text.startswith("json"):
                text = text[4:]
        text = text.strip()
        return json.loads(text)
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=500, detail=f"JSON parse error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/plagiarism")
async def analyze_plagiarism(request: PlagiarismRequest):
    try:
        from services.rag_engine import RAGEngine
        engine = RAGEngine()
        engine.build_index(request.paper_text)
        sentences = [s.strip() for s in request.essay_text.split('. ')
                    if len(s.strip()) > 10]
        breakdown = []
        total_score = 0
        for sentence in sentences[:20]:
            matches = engine.query(sentence, k=1)
            score = round(matches[0][1] * 100) if matches else 0
            total_score += score
            breakdown.append({
                "sentence": sentence[:100] + "..." if len(sentence) > 100 else sentence,
                "score": score
            })
        similarity = round(total_score / len(breakdown)) if breakdown else 0
        return {
            "similarity": similarity,
            "breakdown": breakdown
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))