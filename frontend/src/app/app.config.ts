import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection, LOCALE_ID } from '@angular/core';
import { provideHttpClient } from '@angular/common/http'; 
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es'; // Importamos el locale español
import { provideRouter } from '@angular/router'; // <-- 1. Importar el router
import { routes } from './app.routes';           // <-- 2. Importar nuestras rutas
import { provideAnimations } from '@angular/platform-browser/animations'; // <-- 3. Importar animaciones (para gráficos)

/**
 * Registramos el idioma español (o 'en' para inglés si prefieres)
 * Esto es necesario para que funcionen los pipes como DecimalPipe, DatePipe, etc.
 */
registerLocaleData(localeEs, 'es');

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(), //HABILITA HTTPCLIENT EN TODA LA APP
    provideZoneChangeDetection({ eventCoalescing: true }),
    { provide: LOCALE_ID, useValue: 'es' },
    
  ]
};
