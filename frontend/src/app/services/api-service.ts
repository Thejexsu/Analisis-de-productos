import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SentimentOutput, PieChartData, WordCloudData } from '../sentiment-model';

// Importamos el environment para usar la variable apiUrl
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  // Se inyecta el cliente HTTP
  private http = inject(HttpClient);

  // La url donde se está ejecutando el backend de docker // USAR VARIABLE DE ENTORNO
  private apiUrl = environment.apiUrl;

  //Endpoint para el analizador 
  public predictSentiment(text:string): Observable<SentimentOutput>{
    const body = { text: text};
    return this.http.post<SentimentOutput>(`${this.apiUrl}/predict`, body).pipe(
      catchError(this.handleError)
    );
  }

  //Endpoint para el gráfico de pastel del Dashboard
  public getProportionData(): Observable<PieChartData[]> {
    return this.http.get<PieChartData[]>(`${this.apiUrl}/dashboard/proporcion`).pipe(catchError(this.handleError));
  }

  //Endpoint para la nube de palabras del Dashboard
  public getKeywordsData(): Observable<WordCloudData[]> {
    return this.http.get<WordCloudData[]>(`${this.apiUrl}/dashboard/palabras-clave`).pipe(catchError(this.handleError))
  }

  /**
   * Manejador de errores simple para la consola.
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error desconocido.';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del backend
      errorMessage = `Error de la API [${error.status}]: ${error.message}. ¿Está el contenedor de Docker ejecutándose?`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
  
}
