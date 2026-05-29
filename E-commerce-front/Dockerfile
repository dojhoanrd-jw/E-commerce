# --- Etapa 1: build de Angular ---
FROM node:20-alpine AS build
WORKDIR /app

# Instala dependencias usando el lockfile para builds reproducibles
COPY package*.json ./
RUN npm ci

# Copia el resto del código y compila en modo producción
COPY . .
RUN npm run build -- --configuration production

# --- Etapa 2: servir los estáticos con nginx ---
FROM nginx:alpine AS final

# Config de nginx con fallback de SPA (rutas de Angular)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia el build de Angular (builder "application" => carpeta /browser)
COPY --from=build /app/dist/e-commerce/browser /usr/share/nginx/html

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
