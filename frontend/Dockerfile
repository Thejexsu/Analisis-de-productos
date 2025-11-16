# --- ETAPA 1: Construcción (El "Constructor") ---
# Usamos una imagen de Node 20 (LTS) en lugar de 18
FROM node:20-alpine AS build

# Establecemos el directorio de trabajo
WORKDIR /app

# Copiamos los archivos de definición del proyecto
COPY package.json package-lock.json ./

# Instalamos todas las dependencias de Angular
RUN npm install

# Copiamos TODO el código fuente de nuestra app (src, etc.)
COPY . .

# ¡Construimos la app para producción!
# Esto crea la carpeta /app/dist/mi-proyecto-angular
RUN npm run build -- --configuration production

# --- ETAPA 2: Servidor (La "App Final") ---
# Usamos la imagen oficial y ligera de NGINX
FROM nginx:1.25-alpine

# Copiamos los archivos estáticos (HTML/CSS/JS) desde la Etapa 1
# (Asegúrate de que 'mi-proyecto-angular' es el nombre de tu proyecto en angular.json !!! importante debe ser el mismo nombre dentro de angular.json)
COPY --from=build /app/dist/angular-proyecto-sentimientos/browser /usr/share/nginx/html

# Le decimos a NGINX que escuche en el puerto 80 (el puerto web estándar)
EXPOSE 80