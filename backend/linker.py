import pandas as pd
import numpy as np
import faiss
from sentence_transformers import SentenceTransformer

class ScheduleLinker:
    def __init__(self, csv_path: str = "piping_civil_l5_l6_schedule.csv"):
        self.df = pd.read_csv(csv_path)
        self.encoder = SentenceTransformer("all-MiniLM-L6-v2")
        self.activity_texts = (self.df["Discipline"] + ": " + self.df["Name"]).tolist()
        
        # Generate and normalize embeddings for Cosine Similarity
        embeddings = self.encoder.encode(self.activity_texts, convert_to_numpy=True).astype("float32")
        faiss.normalize_L2(embeddings)
        
        # Build FAISS Index
        self.index = faiss.IndexFlatIP(embeddings.shape[1])
        self.index.add(embeddings)

    def match(self, query: str, top_k: int = 1):
        q_emb = self.encoder.encode([query], convert_to_numpy=True).astype("float32")
        faiss.normalize_L2(q_emb)
        scores, indices = self.index.search(q_emb, top_k)
        
        results = []
        for score, idx in zip(scores[0], indices[0]):
            row = self.df.iloc[idx].to_dict()
            results.append({
                "activity_id": row["Activity ID"],
                "activity_name": row["Name"],
                "discipline": row.get("Discipline", "General"),
                "planned_start": row.get("Planned Start", ""),
                "planned_finish": row.get("Planned Finish", ""),
                "similarity_score": round(float(score) * 100, 2)
            })
        return results[0] if top_k == 1 else results

if __name__ == "__main__":
    linker = ScheduleLinker()
    print("Match Result:", linker.match("Finished pouring structural concrete on the pedestal foundation"))
