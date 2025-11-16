export const environment = {
    production: true,
    /**
     * Esta es la URL para producción (Docker / Render).
     * 'backend' es el nombre que le dimos al servicio de FastAPI
     * en el archivo 'docker-compose.yml'.
     */
    apiUrl: 'http://backend:8000'
};