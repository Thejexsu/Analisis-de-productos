"""
main.py
Versión 2.1 (Estable):
- Endpoint /predict con traducción Español -> Inglés.
- Endpoints /dashboard/... para visualización de datos.
- NLTK ha sido eliminado para evitar errores de Docker.
"""

from fastapi import FastAPI
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from googletrans import Translator

# --- 1. Definición de Modelos de Datos (Pydantic) ---

class ReviewInput(BaseModel):
    text: str

# Modelo de respuesta SIMPLIFICADO
class SentimentOutput(BaseModel):
    label: str  # "Positivo" o "Negativo"
    score: float # La confianza
    translated_text: str | None = None # El texto traducido

class PieChartData(BaseModel): name: str; value: int
class WordCloudData(BaseModel): word: str; count: float


# --- 2. Carga de Modelos y Herramientas ---

print("Iniciando API...")

# --- Carga de modelos ---
print("Cargando modelo y tokenizador de IA...")
MODEL_PATH = "./modelo"
tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
model = AutoModelForSequenceClassification.from_pretrained(MODEL_PATH)
model.to("cpu")
model.eval()
labels_map = ["Negativo", "Positivo"]
print("¡Modelo de IA cargado!")

print("Cargando traductor...")
translator = Translator()
print("¡Traductor listo!")

print("Cargando dataset para el dashboard...")
try:
    df_dashboard = pd.read_csv("amazon_test_sample.csv")
    df_dashboard = df_dashboard.dropna(subset=['text'])
    print(f"Dataset de {len(df_dashboard)} filas cargado.")
except FileNotFoundError:
    print("ERROR: No se encontró 'amazon_test_sample.csv'. El dashboard no funcionará.")
    df_dashboard = None

# --- Creación de App y CORS ---
app = FastAPI(title="API de Análisis de Sentimientos", description="API con traducción y dashboard.")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])


# --- 3. Endpoint de Predicción (Revertido a la v2) ---

@app.post("/predict", response_model=SentimentOutput)
def predict_sentiment(review: ReviewInput):
    
    # 1. TRADUCIR
    try:
        translated = translator.translate(review.text, dest='en')
        english_text = translated.text
    except Exception as e:
        print(f"Error de traducción: {e}")
        english_text = review.text # Fallback
    
    # 2. ANALIZAR
    inputs = tokenizer(english_text, return_tensors="pt", truncation=True, max_length=256, padding=True)
    with torch.no_grad():
        logits = model(**inputs).logits
    
    predicted_class_id = torch.argmax(logits, dim=1).item()
    probabilities = torch.softmax(logits, dim=1)
    score = probabilities[0][predicted_class_id].item()
    label = labels_map[predicted_class_id]
    
    # 3. DEVOLVER
    return SentimentOutput(
        label=label, 
        score=score, 
        translated_text=english_text if english_text != review.text else None
    )

# --- 4. Endpoints del DASHBOARD (Sin cambios) ---
@app.get("/dashboard/proporcion", response_model=list[PieChartData])
def get_dashboard_proportion():
    if df_dashboard is None: return [{"name": "Error", "value": 0}]
    counts = df_dashboard['label'].value_counts()
    return [{"name": "Positivo", "value": counts.get(1, 0)}, {"name": "Negativo", "value": counts.get(0, 0)}]

@app.get("/dashboard/palabras-clave", response_model=list[WordCloudData])
def get_dashboard_keywords():
    if df_dashboard is None: return [{"word": "Error", "count": 0}]
    tfidf = TfidfVectorizer(max_features=20, stop_words='english')
    tfidf_matrix = tfidf.fit_transform(df_dashboard['text'])
    feature_names = tfidf.get_feature_names_out()
    sum_tfidf = tfidf_matrix.sum(axis=0)
    data = []
    for i, name in enumerate(feature_names): data.append({"word": name, "count": sum_tfidf[0, i]})
    return sorted(data, key=lambda x: x['count'], reverse=True)

@app.get("/")
def read_root():
    return {"message": "Bienvenido a la API. Visita /docs para probar."}