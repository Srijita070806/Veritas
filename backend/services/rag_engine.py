from sentence_transformers import SentenceTransformer
import faiss
import numpy as np

class RAGEngine:
    def __init__(self):
        print("Loading embedding model...")
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        self.index = None
        self.chunks = []
        print("Model loaded!")

    def build_index(self, text: str):
        self.chunks = []
        chunk_size = 500
        overlap = 50
        
        start = 0
        while start < len(text):
            end = start + chunk_size
            chunk = text[start:end]
            if chunk.strip():
                self.chunks.append(chunk)
            start = end - overlap
        
        if not self.chunks:
            print("Warning: No chunks created from text")
            return
            
        print(f"Embedding {len(self.chunks)} chunks...")
        embeddings = self.model.encode(
            self.chunks,
            show_progress_bar=False,
            convert_to_numpy=True
        )
        
        dimension = embeddings.shape[1]
        self.index = faiss.IndexFlatIP(dimension)
        faiss.normalize_L2(embeddings)
        self.index.add(embeddings.astype('float32'))
        print("Index built successfully!")

    def query(self, text: str, k: int = 3) -> list:
        if self.index is None or not self.chunks:
            return []
        
        query_embedding = self.model.encode(
            [text],
            convert_to_numpy=True
        )
        faiss.normalize_L2(query_embedding)
        
        k = min(k, len(self.chunks))
        D, I = self.index.search(
            query_embedding.astype('float32'), k
        )
        
        results = []
        for score, idx in zip(D[0], I[0]):
            if idx < len(self.chunks):
                results.append((self.chunks[idx], float(score)))
        
        return results