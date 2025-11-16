import { Component, inject, signal } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common'; // Importamos el Pipe
import { finalize } from 'rxjs/operators';
import { ApiService } from '../../services/api-service';
import { SentimentOutput } from '../../sentiment-model';

@Component({
  selector: 'app-analyzer',
  imports: [CommonModule, DecimalPipe],
  templateUrl: './analyzer.html',

})
export class AnalyzerComponent {
  private apiService = inject(ApiService);
  public reviewText = signal("");
  public result = signal<SentimentOutput | null>(null);
  public isLoading = signal(false);
  public error = signal<string | null>(null);

  public onTextChange(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    this.reviewText.set(target.value);
  }

  public analyzeSentiment(): void {
    const text = this.reviewText();
    if (!text.trim()) {
      this.error.set("Por favor, ingresa una reseña antes de analizar.");
      return;
    }
    this.isLoading.set(true);
    this.error.set(null);
    this.result.set(null);

    this.apiService.predictSentiment(text).pipe(
      finalize(() => this.isLoading.set(false))
    ).subscribe({
      next: (response) => {
        this.result.set(response);
      },
      error: (err) => {
        this.error.set(err.message);
      }
    });
  }
}
