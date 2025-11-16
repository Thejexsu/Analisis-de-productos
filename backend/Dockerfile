# --- 1. Imagen Base ---
FROM python:3.10-slim

# --- 2. Variables de Entorno ---
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# --- 3. Directorio de Trabajo ---
WORKDIR /app

# --- 4. Instalar Dependencias ---

# PASO 4.A: Instalar PyTorch (CPU) PRIMERO
RUN pip install --no-cache-dir torch --index-url https://download.pytorch.org/whl/cpu

# PASO 4.B: Copiar e instalar el RESTO de dependencias
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# --- 5. Copiar el Código de la Aplicación ---
# (Asegúrate de tener 'amazon_test_sample.csv' en esta carpeta)
COPY . .

# --- 6. Exponer el Puerto ---
EXPOSE 8000

# --- 7. Comando de Ejecución ---
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]