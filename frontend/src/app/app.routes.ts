// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { AnalyzerComponent } from './components/analyzer/analyzerComponent';
import { DashboardComponent } from './components/dashboard/dashboardComponent';


export const routes: Routes = [
    // Aquí van tus rutas standalone
    // Ejemplo: { path: '', component: TuPrimerComponente }
    //RUTA PARA EL DASHBOARD 
    { 
        path: 'dashboard',
        component: DashboardComponent
    },
    //RUTA PARA EL ANALIZADOR 
    {
        path: 'analyzer',
        component: AnalyzerComponent
    },
    // Si alguien entra a la raíz, redirige a 'analyzer'
    { 
        path: '', 
        redirectTo: 'analyzer', 
        pathMatch: 'full' 
    },
    // Ruta comodín (si no encuentra la página)
    { 
        path: '**', 
        redirectTo: 'analyzer' 
    }
]; 