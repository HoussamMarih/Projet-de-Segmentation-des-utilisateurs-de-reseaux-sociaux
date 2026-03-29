from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
from sklearn.cluster import KMeans, AgglomerativeClustering
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import silhouette_score
import os

app = FastAPI(title="Social Network Segmentation API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_PATH = os.path.join(os.path.dirname(__file__), "Social_Network_Ads.csv")
def load_dataset():
    if not os.path.exists(DATA_PATH):
        raise HTTPException(status_code=404, detail=f"Dataset not found at {DATA_PATH}")
    try:
        return pd.read_csv(DATA_PATH)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading dataset: {str(e)}")


def clean_data(df):
    if 'User ID' in df.columns:
        df = df.drop('User ID', axis=1)
    
    df = df.dropna()
    X = df[['Age', 'EstimatedSalary']].values
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    return X_scaled, df

def train_kmeans(X, n_clusters):
    kmeans = KMeans(n_clusters=n_clusters, init='k-means++', random_state=42, n_init=10)
    labels = kmeans.fit_predict(X)
    return labels

def train_hierarchical(X, n_clusters):
    hc = AgglomerativeClustering(n_clusters=n_clusters, metric='euclidean', linkage='ward')
    labels = hc.fit_predict(X)
    return labels

def evaluate_model(X, labels):
    if len(set(labels)) < 2:
        return 0.0
    return silhouette_score(X, labels)

@app.get("/api/data")
async def get_raw_data():
    df = load_dataset()
    return df.to_dict(orient="records")

@app.get("/api/clustering/kmeans")
async def run_kmeans_endpoint(n_clusters: int = 4):
    df = load_dataset()
    X_scaled, df_clean = clean_data(df)
    
    labels = train_kmeans(X_scaled, n_clusters)
    score = evaluate_model(X_scaled, labels)
    
    result = []
    for i in range(len(df_clean)):
        result.append({
            "age": int(df_clean.iloc[i]['Age']),
            "salary": int(df_clean.iloc[i]['EstimatedSalary']),
            "cluster": int(labels[i])
        })
        
    return {
        "score": float(score),
        "clusters": result,
        "n_clusters": n_clusters
    }

@app.get("/api/clustering/hierarchical")
async def run_hierarchical_endpoint(n_clusters: int = 4):
    df = load_dataset()
    X_scaled, df_clean = clean_data(df)
    
    labels = train_hierarchical(X_scaled, n_clusters)
    score = evaluate_model(X_scaled, labels)
    
    result = []
    for i in range(len(df_clean)):
        result.append({
            "age": int(df_clean.iloc[i]['Age']),
            "salary": int(df_clean.iloc[i]['EstimatedSalary']),
            "cluster": int(labels[i])
        })
        
    return {
        "score": float(score),
        "clusters": result,
        "n_clusters": n_clusters
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
