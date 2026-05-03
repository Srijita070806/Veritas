from services.rag_engine import RAGEngine

def build_graph(paper_text: str, essay_text: str) -> dict:
    engine = RAGEngine()
    engine.build_index(paper_text)
    
    nodes = []
    edges = []
    unverified_ids = []
    added_paper_chunks = {}
    
    raw_sentences = essay_text.split(". ")
    sentences = [s.strip() for s in raw_sentences if len(s.strip()) > 15]
    
    for i, sentence in enumerate(sentences):
        essay_node_id = f"e{i}"
        
        nodes.append({
            "id": essay_node_id,
            "type": "essay",
            "label": sentence[:80] + "..." if len(sentence) > 80 else sentence,
            "full_text": sentence,
            "verified": False
        })
        
        matches = engine.query(sentence, k=2)
        
        best_score = 0
        for chunk, score in matches:
            best_score = max(best_score, score)
            
            if score >= 0.75:
                chunk_id = f"p{hash(chunk[:50]) % 10000}"
                
                if chunk_id not in added_paper_chunks:
                    nodes.append({
                        "id": chunk_id,
                        "type": "paper",
                        "label": chunk[:80] + "...",
                        "full_text": chunk,
                        "verified": True
                    })
                    added_paper_chunks[chunk_id] = True
                
                edges.append({
                    "id": f"edge_{essay_node_id}_{chunk_id}",
                    "source": essay_node_id,
                    "target": chunk_id,
                    "confidence": round(score, 3),
                    "stroke_width": max(1, int(score * 5))
                })
                
                for node in nodes:
                    if node["id"] == essay_node_id:
                        node["verified"] = True
        
        if best_score < 0.75:
            unverified_ids.append(essay_node_id)
    
    return {
        "nodes": nodes,
        "edges": edges,
        "unverified_ids": unverified_ids
    }