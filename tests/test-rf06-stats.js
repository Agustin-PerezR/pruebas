/**
 * Test unitario para RF-01 de HU-05 (REQ-1789501414613)
 * Sección de estadísticas de máximos goleadores y asistidores
 */

const { generarEquiposYPlanteles } = require("../js/data.js");
const { simularTemporada } = require("../js/simulator.js");
const { obtenerMaximosGoleadores, obtenerMaximosAsistidores, renderEstadisticasHTML } = require("../js/stats.js");

function runTests() {
  console.log("Iniciando pruebas para REQ-1789501414613: Rankings de goleadores y asistidores...");

  const equipos = generarEquiposYPlanteles();
  const { partidos } = simularTemporada(equipos);

  // 1. Validar ranking de goleadores
  const topGoleadores = obtenerMaximosGoleadores(equipos, 10);
  if (!Array.isArray(topGoleadores) || topGoleadores.length === 0) {
    throw new Error("El ranking de goleadores no debe estar vacío tras simular la temporada");
  }

  for (let i = 0; i < topGoleadores.length; i++) {
    const jug = topGoleadores[i];
    if (jug.goles <= 0) throw new Error(`Jugador ${jug.nombre} en ranking con 0 goles`);
    if (jug.posicion !== (i + 1)) throw new Error(`Posición inválida en ranking: ${jug.posicion}`);

    if (i > 0) {
      const jugAnt = topGoleadores[i - 1];
      if (jug.goles > jugAnt.goles) {
        throw new Error(`Error de ordenamiento: ${jug.nombre} (${jug.goles}) > ${jugAnt.nombre} (${jugAnt.goles})`);
      }
    }
  }

  console.log(`✅ Ranking de Goleadores validado: Top ${topGoleadores.length}`);
  console.log(`   - Pichichi / Goleador: ${topGoleadores[0].nombre} (${topGoleadores[0].equipoNombre}) con ${topGoleadores[0].goles} goles en ${topGoleadores[0].partidosJugados} PJ`);

  // 2. Validar ranking de asistidores
  const topAsistidores = obtenerMaximosAsistidores(equipos, 10);
  if (!Array.isArray(topAsistidores) || topAsistidores.length === 0) {
    throw new Error("El ranking de asistidores no debe estar vacío tras simular la temporada");
  }

  for (let i = 0; i < topAsistidores.length; i++) {
    const jug = topAsistidores[i];
    if (jug.asistencias <= 0) throw new Error(`Jugador ${jug.nombre} en ranking con 0 asistencias`);
    if (jug.posicion !== (i + 1)) throw new Error(`Posición inválida en ranking: ${jug.posicion}`);

    if (i > 0) {
      const jugAnt = topAsistidores[i - 1];
      if (jug.asistencias > jugAnt.asistencias) {
        throw new Error(`Error de ordenamiento: ${jug.nombre} (${jug.asistencias}) > ${jugAnt.nombre} (${jugAnt.asistencias})`);
      }
    }
  }

  console.log(`✅ Ranking de Asistidores validado: Top ${topAsistidores.length}`);
  console.log(`   - Líder de Asistencias: ${topAsistidores[0].nombre} (${topAsistidores[0].equipoNombre}) con ${topAsistidores[0].asistencias} asistencias`);

  // 3. Validar renderizado HTML
  const html = renderEstadisticasHTML(topGoleadores, topAsistidores);
  if (!html.includes("Tabla de Goleadores") || !html.includes("Líderes de Asistencias")) {
    throw new Error("El HTML renderizado no incluye los encabezados requeridos");
  }

  if (!html.includes(topGoleadores[0].nombre) || !html.includes(topAsistidores[0].nombre)) {
    throw new Error("El HTML renderizado no incluye a los líderes de las tablas");
  }

  console.log("✅ Renderizado de estadísticas en dos tablas ordenadas descendente verificado.");
  console.log("✅ REQ-1789501414613: Todas las pruebas pasaron satisfactoriamente.");
}

try {
  runTests();
} catch (err) {
  console.error("❌ Falló la prueba de estadísticas:", err.message);
  process.exit(1);
}
