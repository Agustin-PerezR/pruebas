/**
 * Test unitario para RF-01 de HU-03 (REQ-1789501384835)
 * Listado de fixture y filtrado de resultados por equipo
 */

const { generarEquiposYPlanteles } = require("../js/data.js");
const { simularTemporada } = require("../js/simulator.js");
const { filtrarPartidosPorEquipo, filtrarPartidosPorJornada, renderFixtureHTML } = require("../js/fixture-view.js");

function runTests() {
  console.log("Iniciando pruebas para REQ-1789501384835: Listado y filtrado de fixture por equipo...");

  const equipos = generarEquiposYPlanteles();
  const { partidos } = simularTemporada(equipos);

  if (partidos.length !== 90) throw new Error("Se esperaban 90 partidos de liga");

  // 1. Validar filtro sin selección ("todos")
  const todos = filtrarPartidosPorEquipo(partidos, "todos");
  if (todos.length !== 90) throw new Error("El filtro 'todos' debe retornar los 90 partidos");

  // 2. Validar filtro por cada uno de los 10 equipos
  equipos.forEach(eq => {
    const partidosEquipo = filtrarPartidosPorEquipo(partidos, eq.id);
    if (partidosEquipo.length !== 18) {
      throw new Error(`El equipo ${eq.nombre} (${eq.id}) debe tener exactamente 18 partidos, se obtuvieron ${partidosEquipo.length}`);
    }

    partidosEquipo.forEach(p => {
      if (p.localId !== eq.id && p.visitanteId !== eq.id) {
        throw new Error(`El partido ${p.id} no involucra al equipo filtrado ${eq.nombre}`);
      }
    });

    const comoLocal = partidosEquipo.filter(p => p.localId === eq.id).length;
    const comoVisitante = partidosEquipo.filter(p => p.visitanteId === eq.id).length;
    if (comoLocal !== 9 || comoVisitante !== 9) {
      throw new Error(`El equipo ${eq.nombre} no tiene balance de 9 locales y 9 visitantes: L=${comoLocal}, V=${comoVisitante}`);
    }
  });

  console.log("✅ Filtrado por equipo validado: los 10 clubes registran exactamente 18 partidos con 9 locales y 9 visitantes.");

  // 3. Validar filtro por jornada
  for (let j = 1; j <= 18; j++) {
    const partidosJornada = filtrarPartidosPorJornada(partidos, j);
    if (partidosJornada.length !== 5) {
      throw new Error(`La jornada ${j} debe tener 5 partidos, se obtuvieron ${partidosJornada.length}`);
    }
  }

  console.log("✅ Filtrado por jornada validado: las 18 fechas contienen 5 partidos cada una.");

  // 4. Validar combinación de filtros (Equipo + Jornada)
  const equipoPrueba = equipos[0];
  for (let j = 1; j <= 18; j++) {
    const unPartido = filtrarPartidosPorJornada(filtrarPartidosPorEquipo(partidos, equipoPrueba.id), j);
    if (unPartido.length !== 1) {
      throw new Error(`El equipo ${equipoPrueba.nombre} debe jugar exactamente 1 partido en la fecha ${j}`);
    }
  }

  // 5. Validar renderizado HTML
  const html = renderFixtureHTML(partidos, equipos, equipoPrueba.id, 1);
  if (!html.includes('id="select-filtro-equipo"') || !html.includes('class="partido-card"')) {
    throw new Error("El HTML renderizado no incluye la estructura requerida para el fixture interactivo");
  }

  console.log("✅ REQ-1789501384835: Todas las pruebas de listado y filtrado de fixture pasaron satisfactoriamente.");
}

try {
  runTests();
} catch (err) {
  console.error("❌ Falló la prueba de fixture:", err.message);
  process.exit(1);
}
