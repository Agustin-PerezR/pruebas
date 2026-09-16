/**
 * Test unitario para RNF-01 (REQ-1789501354292)
 * Diseño UI responsive y estilos de la clasificación
 */

const fs = require("fs");
const path = require("path");

function runTests() {
  console.log("Iniciando pruebas para RNF-01: Diseño UI responsive y estilos de clasificación...");

  const cssPath = path.join(__dirname, "../css/styles.css");
  const htmlPath = path.join(__dirname, "../index.html");

  if (!fs.existsSync(cssPath)) throw new Error("No se encontró css/styles.css");
  if (!fs.existsSync(htmlPath)) throw new Error("No se encontró index.html");

  const cssContent = fs.readFileSync(cssPath, "utf-8");
  const htmlContent = fs.readFileSync(htmlPath, "utf-8");

  // 1. Validar viewport responsive en index.html
  if (!htmlContent.includes('<meta name="viewport"') || !htmlContent.includes("width=device-width")) {
    throw new Error("index.html no contiene la metaetiqueta viewport responsive requerida");
  }

  // 2. Validar semáforo de colores en el CSS
  const tokensSemaforo = [
    "--color-campeon",
    "--color-copas",
    "--color-descenso",
    ".zona-campeon",
    ".zona-copas",
    ".zona-descenso"
  ];

  tokensSemaforo.forEach(tok => {
    if (!cssContent.includes(tok)) {
      throw new Error(`css/styles.css no define el token/estilo del semáforo: ${tok}`);
    }
  });

  // 3. Validar media queries para adaptabilidad a móviles y tablets
  if (!cssContent.includes("@media") || !cssContent.includes("max-width")) {
    throw new Error("css/styles.css no contiene media queries para diseño responsive");
  }

  // 4. Validar contenedor con overflow-x para scroll horizontal de tablas en móviles
  if (!cssContent.includes("overflow-x: auto") && !cssContent.includes("overflow-x:auto")) {
    throw new Error("css/styles.css no implementa scroll horizontal para tablas en pantallas estrechas");
  }

  console.log("✅ RNF-01: Verificaciones de diseño responsive y estilos aprobadas exitosamente.");
  console.log("   - Metaetiqueta viewport responsive verificada en HTML.");
  console.log("   - Paleta de semáforo (Verde, Naranja, Rojo) presente en CSS.");
  console.log("   - Media queries y scroll horizontal para dispositivos móviles validados.");
}

try {
  runTests();
} catch (err) {
  console.error("❌ Falló la prueba de RNF-01:", err.message);
  process.exit(1);
}
