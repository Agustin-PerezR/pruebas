/**
 * Test unitario para RF-01 de RO-01 (REQ-1789501889447)
 * Dockerizar la aplicación (Dockerfile y docker-compose en 8086:8000)
 */

const fs = require("fs");
const path = require("path");

function runTests() {
  console.log("Iniciando pruebas para REQ-1789501889447: Dockerización de la aplicación...");

  const rootDir = path.resolve(__dirname, "..");
  const dockerfilePath = path.join(rootDir, "Dockerfile");
  const composePath = path.join(rootDir, "docker-compose.yml");
  const nginxConfPath = path.join(rootDir, "nginx.conf");
  const dockerignorePath = path.join(rootDir, ".dockerignore");

  // 1. Validar existencia de Dockerfile
  if (!fs.existsSync(dockerfilePath)) {
    throw new Error("El archivo Dockerfile no existe en la raíz del proyecto");
  }
  const dockerfileContent = fs.readFileSync(dockerfilePath, "utf-8");

  if (!dockerfileContent.includes("FROM nginx:alpine")) {
    throw new Error("Dockerfile debe utilizar una imagen base adecuada (FROM nginx:alpine)");
  }
  if (!dockerfileContent.includes("EXPOSE 8000")) {
    throw new Error("Dockerfile debe exponer el puerto 8000 (EXPOSE 8000)");
  }
  if (!dockerfileContent.includes("COPY index.html") || !dockerfileContent.includes("COPY css/") || !dockerfileContent.includes("COPY js/")) {
    throw new Error("Dockerfile debe copiar los archivos estáticos de la aplicación (index.html, css/, js/)");
  }
  console.log("✅ Dockerfile verificado: imagen nginx:alpine, EXPOSE 8000 y copia de assets estáticos.");

  // 2. Validar nginx.conf
  if (!fs.existsSync(nginxConfPath)) {
    throw new Error("El archivo nginx.conf no existe");
  }
  const nginxContent = fs.readFileSync(nginxConfPath, "utf-8");
  if (!nginxContent.includes("listen 8000;")) {
    throw new Error("nginx.conf debe configurar 'listen 8000;' para coincidir con la especificación");
  }
  console.log("✅ nginx.conf verificado: configurado para escuchar en el puerto 8000.");

  // 3. Validar docker-compose.yml
  if (!fs.existsSync(composePath)) {
    throw new Error("El archivo docker-compose.yml no existe en la raíz del proyecto");
  }
  const composeContent = fs.readFileSync(composePath, "utf-8");

  // Debe mapear 8086:8000
  const portRegex = /["']?8086:8000["']?/;
  if (!portRegex.test(composeContent)) {
    throw new Error("docker-compose.yml debe incluir el mapeo de puertos '8086:8000'");
  }

  if (!composeContent.includes("context:") || !composeContent.includes("dockerfile:")) {
    throw new Error("docker-compose.yml debe definir la construcción del servicio con build context y dockerfile");
  }
  console.log("✅ docker-compose.yml verificado: mapeo de puertos 8086:8000 y configuración de servicio correctos.");

  // 4. Validar .dockerignore
  if (!fs.existsSync(dockerignorePath)) {
    throw new Error("El archivo .dockerignore no existe");
  }
  console.log("✅ .dockerignore verificado.");

  console.log("✅ REQ-1789501889447: Todas las pruebas de dockerización pasaron satisfactoriamente.");
}

try {
  runTests();
} catch (err) {
  console.error("❌ Falló la prueba de dockerización:", err.message);
  process.exit(1);
}
