import { Component, inject, OnInit, signal } from '@angular/core';
import { ApiService } from '../../services/api-service';
import { PieChartData, WordCloudData } from '../../sentiment-model';

import { NgxChartsModule, Color, ScaleType, LegendPosition } from '@swimlane/ngx-charts'; 


@Component({
  selector: 'app-dashboard',
  imports: [NgxChartsModule ],
  templateUrl: './dashboard.html',

})
export class DashboardComponent implements OnInit {
  private apiService = inject(ApiService);

  // Signals para los datos
  public proportionData = signal<PieChartData[]>([]);
  public keywordsData = signal<any[]>([]); // El gráfico de barras es flexible

  // Signals para los estados de carga
  public isLoadingProportion = signal(true);
  public isLoadingKeywords = signal(true);
  
  // --- Opciones de Gráfico de Pastel (CORREGIDO) ---
  public pieColorScheme: Color = {
    name: 'Sentiment',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#10B981', '#EF4444'] // Verde (Positivo), Rojo (Negativo)
  };
  
  // Usaremos 'below' como un enum
  public legendPositionBelow = LegendPosition.Below;

  // --- Opciones de Gráfico de Barras ---
  public barColorScheme: Color = {
    name: 'Keywords',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#3B82F6', '#14B8A6', '#F59E0B', '#E11D48', '#ffffff']
  };

  ngOnInit(): void {
    this.loadProportionData();
    this.loadKeywordsData();
  }

  loadProportionData(): void {
    this.isLoadingProportion.set(true);
    this.apiService.getProportionData().subscribe({
      next: (data) => {
        this.proportionData.set(data);
        this.isLoadingProportion.set(false);
      },
      error: (err) => {
        console.error("Error cargando datos de proporción", err);
        this.isLoadingProportion.set(false);
      }
    });
  }

  loadKeywordsData(): void {
    this.isLoadingKeywords.set(true);
    this.apiService.getKeywordsData().subscribe({
      next: (data) => {
        // Renombramos 'word' a 'name' y 'count' a 'value'
        const formattedData = data.map(item => ({
          name: item.word,
          value: item.count
        }));
        this.keywordsData.set(formattedData);
        this.isLoadingKeywords.set(false);
      },
      error: (err) => {
        console.error("Error cargando palabras clave", err);
        this.isLoadingKeywords.set(false);
      }
    });
  }


}
