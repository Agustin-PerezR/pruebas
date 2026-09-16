/**
 * Test unitario para RF-01 de HU-02 (REQ-1789501339015)
 * Cálculo y vista de tabla de posiciones con semáforo de colores
 */

const { generarEquiposYPlanteles } = require("../js/data.js");
const { simularTemporada } = require("../js/simulator.js");
const { calcularTablaPosiciones, renderTablaPosicionesHTML } = require("../js/standings.js");

function runTests() {
  console.log("Iniciando pruebas para REQ-1789501339015: Tabla de posiciones con semáforo...");

  const equipos = generarEquiposYPlanteles();
  const { partidos } = simularTemporada(equipos);

  const tabla = calcularTablaPosiciones(equipos, partidos);

  if (!Array.isArray(tabla) || tabla.length !== 10) {
    throw new Error(`Se esperaban 10 filas en la tabla de posiciones, se obtuvieron ${tabla?.length}`);
  }

  let totalPG = 0;
  let totalPE = 0;
  let totalPP = 0;
  let totalGF = 0;
  let totalGC = 0;

  for (let i = 0; i < tabla.length; i++) {
    const fila = tabla[i];
    const posEsperada = i + 1;

    if (fila.posicion !== posEsperada) {
      throw new Error(`Posición incorrecta en fila ${i}: se esperaba ${posEsperada}, tiene ${fila.posicion}`);
    }

    if (fila.pj !== 18) {
      throw new Error(`El equipo ${fila.nombre} debe tener 18 partidos jugados (tiene ${fila.pj})`);
    }

    if (fila.pj !== (fila.pg + fila.pe + fila.pp)) {
      throw new Error(`PJ != PG + PE + PP para ${fila.nombre}`);
    }

    if (fila.pts !== (fila.pg * 3 + fila.pe)) {
      throw new Error(`Cálculo de puntos erróneo para ${fila.nombre}: ${fila.pts} vs ${fila.pg * 3 + fila.pe}`);
    }

    if (fila.dg !== (fila.gf - fila.gc)) {
      throw new Error(`Cálculo de diferencia de gol erróneo para ${fila.nombre}: ${fila.dg} vs ${fila.gf - fila.gc}`);
    }

    totalPG += fila.pg;
    totalPE += fila.pe;
    totalPP += fila.pp;
    totalGF += fila.gf;
    totalGC += fila.gc;

    // Validación del semáforo de colores
    if (posEsperada === 1) {
      if (fila.zona !== "campeon" || fila.zonaColor !== "#16a34a") {
        throw new Error(`El 1° puesto debe tener zona 'campeon' y color verde (#16a34a), tiene ${fila.zona}/${fila.zonaColor}`);
      }
    } else if (posEsperada >= 2 && posEsperada <= 4) {
      if (fila.zona !== "copas" || fila.zonaColor !== "#ea580c") {
        throw new Error(`Puesto ${posEsperada} debe tener zona 'copas' y color naranja (#ea580c)`);
      }
    } else if (posEsperada >= 5 && posEsperada <= 8) {
      if (fila.zona !== "normal") {
        throw new Error(`Puesto ${posEsperada} debe tener zona 'normal'`);
      }
    } else if (posEsperada >= 9) {
      if (fila.zona !== "descenso" || fila.zonaColor !== "#dc2626") {
        throw new Error(`Puesto ${posEsperada} debe tener zona 'descenso' y color rojo (#dc2626)`);
      }
    }

    // Validación de ordenamiento relativo
    if (i > 0) {
      const filaAnterior = tabla[i - 1];
      if (fila.pts > filaAnterior.pts) {
        throw new Error(`Error de ordenamiento: ${fila.nombre} (${fila.pts} pts) está debajo de ${filaAnterior.nombre} (${filaAnterior.pts} pts)`);
      }
      if (fila.pts === filaAnterior.pts && fila.dg > filaAnterior.dg) {
        throw new Error(`Error de ordenamiento por DG en empate de puntos entre ${filaAnterior.nombre} y ${fila.nombre}`);
      }
    }
  }

  // Consistencia global
  if (totalPG !== totalPP) {
    throw new Error(`Total victorias (${totalPG}) != Total derrotas (${totalPP})`);
  }
  if (totalGF !== totalGC) {
    throw new Error(`Total goles a favor (${totalGF}) != Total goles en contra (${totalGC})`);
  }

  // Test de renderizado HTML
  const html = renderTablaPosicionesHTML(tabla);
  if (!html.includes("<table") || !html.includes("zona-campeon") || !html.includes("zona-copas") || !html.includes("zona-descenso")) {
    throw new Error("El HTML renderizado no incluye las clases esperadas de semáforo");
  }

  console.log("✅ Tabla de posiciones calculada y verificada exitosamente:");
  console.log(`   - 1° Campeón (Verde): ${tabla[0].nombre} (${tabla[0].pts} pts, DG: ${tabla[0].dg})`);
  console.log(`   - 2°-4° Copas (Naranja): ${tabla.slice(1, 4).map(t => `${t.posicion}° ${t.nombre}`).join(", ")}`);
  console.log(`   - 9°-10° Descenso (Rojo): ${tabla.slice(8).map(t => `${t.posicion}° ${t.nombre}`).join(", ")}`);
  console.log(`   - Consistencia matemática: ${totalPG} victorias = ${totalPP} derrotas | ${totalGF} GF = ${totalGC} GC`);
}

try {
  runTests();
  console.log("✅ REQ-1789501339015: Todas las pruebas pasaron satisfactoriamente.");
} catch (err) {
  console.error("❌ Falló la prueba de la tabla de posiciones:", err.message);
  process.exit(1);
}
