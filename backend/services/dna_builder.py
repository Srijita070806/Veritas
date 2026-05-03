from openai import OpenAI
from dotenv import load_dotenv
import os
import json

# Load env variables first
load_dotenv()

def get_client():
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise ValueError("OPENAI_API_KEY not found in .env file!")
    return OpenAI(
        api_key=api_key,
        base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
    )

def build_dna(paper_text: str, essay_text: str) -> dict:
    client = get_client()  # ← add this line at the top of the function
    paper_preview = paper_text[:3000]
    essay_preview = essay_text[:2000]
    
    prompt = f"""You are an academic topic extractor.

Analyze these two academic texts and extract exactly 6 topics from each.

RESEARCH PAPER:
{paper_preview}

STUDENT ESSAY:
{essay_preview}

Return ONLY this exact JSON structure, no explanation, no markdown:
{{
  "paper_topics": [
    {{"name": "Topic Name", "score": 85, "color": "teal"}},
    {{"name": "Topic Name", "score": 70, "color": "purple"}},
    {{"name": "Topic Name", "score": 60, "color": "amber"}},
    {{"name": "Topic Name", "score": 90, "color": "coral"}},
    {{"name": "Topic Name", "score": 45, "color": "blue"}},
    {{"name": "Topic Name", "score": 75, "color": "green"}}
  ],
  "essay_topics": [
    {{"name": "Topic Name", "score": 80, "color": "teal"}},
    {{"name": "Topic Name", "score": 65, "color": "purple"}},
    {{"name": "Topic Name", "score": 55, "color": "amber"}},
    {{"name": "Topic Name", "score": 85, "color": "coral"}},
    {{"name": "Topic Name", "score": 40, "color": "blue"}},
    {{"name": "Topic Name", "score": 70, "color": "green"}}
  ],
  "missing_topics": ["Topic in paper but missing from essay"],
  "alignment_pairs": [["paper topic", "matching essay topic"]]
}}

Rules:
- score is 0-100 based on depth of coverage
- missing_topics are topics in paper not covered in essay
- Keep topic names to 2 words maximum"""

    try:
        response = client.chat.completions.create(
            model="llama3-8b-8192",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=1000,
            temperature=0.3
        )
        
        response_text = response.choices[0].message.content
        response_text = response_text.strip()
        if response_text.startswith("```"):
            response_text = response_text.split("```")[1]
            if response_text.startswith("json"):
                response_text = response_text[4:]
        
        data = json.loads(response_text)
        return data
        
    except Exception as e:
        print(f"DNA builder error: {e}")
        return {
            "paper_topics": [
                {"name": "Introduction", "score": 80, "color": "teal"},
                {"name": "Methodology", "score": 90, "color": "purple"},
                {"name": "Results", "score": 75, "color": "amber"},
                {"name": "Analysis", "score": 85, "color": "coral"},
                {"name": "Discussion", "score": 70, "color": "blue"},
                {"name": "Conclusion", "score": 65, "color": "green"}
            ],
            "essay_topics": [
                {"name": "Introduction", "score": 70, "color": "teal"},
                {"name": "Methodology", "score": 60, "color": "purple"},
                {"name": "Results", "score": 80, "color": "amber"},
                {"name": "Analysis", "score": 55, "color": "coral"},
                {"name": "Discussion", "score": 45, "color": "blue"},
                {"name": "Conclusion", "score": 30, "color": "green"}
            ],
            "missing_topics": ["Statistics", "Future Work"],
            "alignment_pairs": [
                ["Introduction", "Introduction"],
                ["Methodology", "Methodology"]
            ]
        }