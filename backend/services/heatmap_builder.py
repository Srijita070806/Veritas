from services.rag_engine import RAGEngine

def build_heatmap(paper_text: str, essay_sentences: list) -> dict:
    engine = RAGEngine()
    engine.build_index(paper_text)
    
    results = []
    verified_count = 0
    weak_count = 0
    hallucinated_count = 0
    
    for sentence in essay_sentences:
        if len(sentence.strip()) < 10:
            continue
            
        matches = engine.query(sentence, k=1)
        
        if not matches:
            status = "hallucinated"
            confidence = 0.0
            source_quote = "No source found in uploaded paper"
            source_page = None
        else:
            best_chunk, score = matches[0]
            confidence = score
            source_quote = best_chunk[:200] + "..."
            source_page = 1
            
            if score >= 0.80:
                status = "verified"
                verified_count += 1
            elif score >= 0.60:
                status = "weak"
                weak_count += 1
            else:
                status = "hallucinated"
                hallucinated_count += 1
        
        results.append({
            "sentence": sentence,
            "status": status,
            "confidence": round(confidence, 3),
            "source_quote": source_quote,
            "source_page": source_page
        })
    
    total = len(results)
    if total == 0:
        integrity_score = {"verified": 0, "weak": 0, "hallucinated": 0}
    else:
        integrity_score = {
            "verified": round((verified_count / total) * 100),
            "weak": round((weak_count / total) * 100),
            "hallucinated": round((hallucinated_count / total) * 100)
        }
    
    return {
        "results": results,
        "integrity_score": integrity_score
    }