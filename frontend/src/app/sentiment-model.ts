/**
 * Modelo para la respuesta de predicción (SIMPLIFICADO)
 */
export interface SentimentOutput {
  label: string;  // "Positivo" o "Negativo"
  score: number; // Nivel de confianza
  translated_text?: string;
}

// --- Modelos del Dashboard (sin cambios) ---
export interface PieChartData {
  name: string;
  value: number;
}

export interface WordCloudData {
  word: string;
  count: number;
}