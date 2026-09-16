/**
 * Test unitario para RF-02 (REQ-1789501323521)
 * Simulador de fixture y resultados de la temporada
 */

const { generarEquiposYPlanteles } = require("../js/data.js");
const { generarFixture, simularTemporada } = require("../js/simulator.js");

function runTests() {
  console.log("Iniciando pruebas para RF-02: Simulador de fixture y resultados...");

  const equipos = generarEquiposYPlanteles();
  if (equipos.length !== 10) throw new Error("Deben existir 10 equipos para el test");

  // 1. Validar generación de fixture
  const fixture = generarFixture(equipos);
  if (!Array.isArray(fixture) || fixture.length !== 18) {
    throw new Error(`Se esperaban 18 jornadas de fixture, se obtuvieron ${fixture?.length}`);
  }

  let totalPartidos = 0;
  const localiasPorEquipo = {};
  equipos.forEach(eq => {
    localiasPorEquipo[eq.id] = { local: 0, visitante: 0, rivales: [] };
  });

  fixture.forEach(j => {
    if (!Array.isArray(j.partidos) || j.partidos.length !== 5) {
      throw new Error(`La jornada ${j.jornada} debe tener 5 partidos (tiene ${j.partidos?.length})`);
    }
    j.partidos.forEach(p => {
      totalPartidos++;
      localiasPorEquipo[p.localId].local++;
      localiasPorEquipo[p.localId].rivales.push(p.visitanteId);
      localiasPorEquipo[p.visitanteId].visitante++;
      localiasPorEquipo[p.visitanteId].rivales.push(p.localId);
    });
  });

  if (totalPartidos !== 90) {
    throw new Error(`Se esperaban 90 partidos en total, se encontraron ${totalPartidos}`);
  }

  equipos.forEach(eq => {
    const stat = localiasPorEquipo[eq.id];
    if (stat.local !== 9 || stat.visitante !== 9) {
      throw new Error(`Equipo ${eq.nombre} no tiene balance de 9 locales y 9 visitantes (L:${stat.local}, V:${stat.visitante})`);
    }
    if (stat.rivales.length !== 18) {
      throw new Error(`Equipo ${eq.nombre} debe disputar 18 partidos en total`);
    }
  });

  console.log("✅ Fixture de 18 jornadas y 90 partidos balanceado correctamente.");

  // 2. Validar simulación de temporada completa
  const resultado = simularTemporada(equipos);
  const { partidos } = resultado;

  if (partidos.length !== 90) {
    throw new Error(`Se esperaban 90 partidos simulados, se obtuvieron ${partidos.length}`);
  }

  let totalGolesPartidos = 0;
  let totalEventosGoles = 0;
  let totalEventosSustituciones = 0;
  let totalAsistenciasEventos = 0;

  partidos.forEach(p => {
    if (!p.jugado) throw new Error(`El partido ${p.id} no fue marcado como jugado`);
    if (typeof p.golesLocal !== "number" || typeof p.golesVisitante !== "number") {
      throw new Error(`El partido ${p.id} tiene goles inválidos`);
    }
    if (p.golesLocal < 0 || p.golesVisitante < 0) {
      throw new Error(`Marcador negativo detectado en partido ${p.id}`);
    }

    totalGolesPartidos += (p.golesLocal + p.golesVisitante);

    // Verificar eventos
    let minutoAnterior = 0;
    p.eventos.forEach(ev => {
      if (ev.minuto < minutoAnterior) {
        throw new Error(`Eventos fuera de orden cronológico en partido ${p.id}`);
      }
      minutoAnterior = ev.minuto;

      if (ev.tipo === "gol") {
        totalEventosGoles++;
        if (!ev.autor || !ev.autor.nombre || !ev.autor.dorsal) {
          throw new Error(`Evento de gol sin autor válido en partido ${p.id}`);
        }
        if (ev.asistidor) {
          totalAsistenciasEventos++;
        }
      } else if (ev.tipo === "sustitucion") {
        totalEventosSustituciones++;
        if (!ev.sale || !ev.entra || ev.sale.id === ev.entra.id) {
          throw new Error(`Evento de sustitución inválido en partido ${p.id}`);
        }
      } else {
        throw new Error(`Tipo de evento desconocido: ${ev.tipo}`);
      }
    });

    const golesEnEstePartido = p.eventos.filter(e => e.tipo === "gol").length;
    if (golesEnEstePartido !== (p.golesLocal + p.golesVisitante)) {
      throw new Error(`Discrepancia de goles en partido ${p.id}: marcador=${p.golesLocal}-${p.golesVisitante}, eventos=${golesEnEstePartido}`);
    }
  });

  if (totalGolesPartidos !== totalEventosGoles) {
    throw new Error(`Total goles partidos (${totalGolesPartidos}) != eventos goles (${totalEventosGoles})`);
  }

  if (totalEventosSustituciones === 0) {
    throw new Error("No se registraron eventos de sustitución en la temporada");
  }

  // 3. Validar estadísticas acumuladas en jugadores
  let totalGolesJugadores = 0;
  let totalAsistenciasJugadores = 0;
  let jugadoresConPartidos = 0;

  equipos.forEach(eq => {
    eq.jugadores.forEach(j => {
      totalGolesJugadores += (j.goles || 0);
      totalAsistenciasJugadores += (j.asistencias || 0);
      if (j.partidosJugados > 0) jugadoresConPartidos++;
    });
  });

  if (totalGolesJugadores !== totalGolesPartidos) {
    throw new Error(`Goles de jugadores (${totalGolesJugadores}) != Goles de partidos (${totalGolesPartidos})`);
  }

  if (totalAsistenciasJugadores !== totalAsistenciasEventos) {
    throw new Error(`Asistencias de jugadores (${totalAsistenciasJugadores}) != Asistencias de eventos (${totalAsistenciasEventos})`);
  }

  if (jugadoresConPartidos < 100) {
    throw new Error(`Muy pocos jugadores tuvieron minutos: ${jugadoresConPartidos}`);
  }

  console.log(`✅ Temporada simulada con éxito:`);
  console.log(`   - Partidos jugados: ${partidos.length}`);
  console.log(`   - Goles totales: ${totalGolesPartidos}`);
  console.log(`   - Asistencias registradas: ${totalAsistenciasJugadores}`);
  console.log(`   - Sustituciones simuladas: ${totalEventosSustituciones}`);
  console.log(`   - Jugadores que disputaron minutos: ${jugadoresConPartidos}/160`);
}

try {
  runTests();
  console.log("✅ RF-02: Todas las verificaciones pasaron exitosamente.");
} catch (err) {
  console.error("❌ Falló la prueba de RF-02:", err.message);
  process.exit(1);
}
