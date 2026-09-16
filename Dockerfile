# Imagen base ligera para servir archivos estáticos
FROM nginx:alpine

# Configuración personalizada de Nginx para escuchar en puerto 8000
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar archivos estáticos de la aplicación de resultados de fútbol
COPY index.html /usr/share/nginx/html/index.html
COPY css/ /usr/share/nginx/html/css/
COPY js/ /usr/share/nginx/html/js/

# Exponer el puerto interno del contenedor especificado en el requerimiento
EXPOSE 8000

# Ejecutar Nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]
