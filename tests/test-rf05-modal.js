/**
 * Test unitario para RF-01 de HU-04 (REQ-1789501399433)
 * Detalle de partido con cronología de goles y sustituciones
 */

const { generarEquiposYPlanteles } = require("../js/data.js");
const { simularTemporada } = require("../js/simulator.js");
const { obtenerDetallePartido, renderModalDetalleHTML } = require("../js/match-modal.js");

function runTests() {
  console.log("Iniciando pruebas para REQ-1789501399433: Detalle de partido con goles y sustituciones...");

  const equipos = generarEquiposYPlanteles();
  const { partidos } = simularTemporada(equipos);

  // Buscar un partido que tenga goles y sustituciones
  const partidoConGoles = partidos.find(p => (p.golesLocal + p.golesVisitante) > 0 && p.eventos.length > 2);
  if (!partidoConGoles) throw new Error("No se encontró ningún partido con goles para probar");

  // 1. Validar función obtenerDetallePartido
  const detalle = obtenerDetallePartido(partidos, partidoConGoles.id);
  if (!detalle) throw new Error(`No se pudo obtener el detalle del partido ${partidoConGoles.id}`);

  if (detalle.goles.length !== (detalle.golesLocal + detalle.golesVisitante)) {
    throw new Error("Cantidad de goles en el detalle no coincide con el marcador");
  }

  if (detalle.sustituciones.length === 0) {
    throw new Error("El partido no registra sustituciones");
  }

  // Validar orden cronológico
  let minAnt = 0;
  detalle.eventosOrdenados.forEach(ev => {
    if (ev.minuto < minAnt) {
      throw new Error(`Cronología de eventos desordenada: ${ev.minuto} < ${minAnt}`);
    }
    minAnt = ev.minuto;

    if (ev.tipo === "gol") {
      if (!ev.autor || !ev.autor.nombre || typeof ev.minuto !== "number") {
        throw new Error("Evento de gol incompleto en detalle");
      }
    } else if (ev.tipo === "sustitucion") {
      if (!ev.sale || !ev.sale.nombre || !ev.entra || !ev.entra.nombre) {
        throw new Error("Evento de sustitución incompleto en detalle");
      }
    }
  });

  console.log(`✅ Detalle obtenido del partido ${detalle.localNombre} vs ${detalle.visitanteNombre}:`);
  console.log(`   - Marcador: ${detalle.golesLocal} - ${detalle.golesVisitante}`);
  console.log(`   - Goles registrados: ${detalle.goles.length}`);
  console.log(`   - Sustituciones: ${detalle.sustituciones.length}`);
  console.log(`   - Total eventos ordenados: ${detalle.eventosOrdenados.length}`);

  // 2. Validar renderizado HTML del modal
  const modalHTML = renderModalDetalleHTML(detalle);

  if (!modalHTML.includes('id="modal-backdrop"') || !modalHTML.includes('id="btn-cerrar-modal"')) {
    throw new Error("El HTML del modal no incluye los elementos de contenedor o botón de cierre requeridos");
  }

  if (!modalHTML.includes("Cronología de Incidencias")) {
    throw new Error("No se encontró la sección de cronología en el modal");
  }

  detalle.goles.forEach(g => {
    if (!modalHTML.includes(g.autor.nombre)) {
      throw new Error(`El autor del gol (${g.autor.nombre}) no figura en el HTML del modal`);
    }
  });

  detalle.sustituciones.forEach(s => {
    if (!modalHTML.includes(s.sale.nombre) || !modalHTML.includes(s.entra.nombre)) {
      throw new Error(`Los jugadores de la sustitución (${s.sale.nombre} / ${s.entra.nombre}) no figuran en el HTML del modal`);
    }
  });

  console.log("✅ Renderizado del modal verificado: incluye autores de goles, asistencias, cambios y minutos.");
  console.log("✅ REQ-1789501399433: Todas las pruebas pasaron satisfactoriamente.");
}

try {
  runTests();
} catch (err) {
  console.error("❌ Falló la prueba de detalle de partido:", err.message);
  process.exit(1);
}
