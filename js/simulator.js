/**
 * Simulador de Fixture y Resultados de la Temporada (RF-02)
 * ID Requerimiento: REQ-1789501323521
 */

if (typeof require !== "undefined") {
  var { generarEquiposYPlanteles } = require("./data.js");
}

/**
 * Genera el fixture de todos contra todos (ida y vuelta) para los 10 equipos.
 * Con 10 equipos son 9 fechas de ida (45 partidos) y 9 de vuelta (45 partidos) = 18 jornadas / 90 partidos.
 */
function generarFixture(equipos) {
  if (!equipos || equipos.length !== 10) {
    throw new Error("Se requieren exactamente 10 equipos para generar el fixture");
  }

  const n = equipos.length;
  const totalFechasIda = n - 1; // 9 fechas
  const partidosPorFecha = n / 2; // 5 partidos

  // Copia de los IDs de los equipos
  const teamList = [...equipos];
  const fixture = [];

  // Algoritmo de Round Robin (método del polígono rotativo)
  const rotating = teamList.slice(1); // 9 equipos que rotan
  const fixed = teamList[0]; // 1 equipo fijo

  for (let round = 0; round < totalFechasIda; round++) {
    const partidosRonda = [];
    const currentRoundTeams = [fixed, ...rotating];

    for (let i = 0; i < partidosPorFecha; i++) {
      const t1 = currentRoundTeams[i];
      const t2 = currentRoundTeams[n - 1 - i];

      // Alternar localía para balancear
      const local = (round % 2 === 0) ? (i % 2 === 0 ? t1 : t2) : (i % 2 === 0 ? t2 : t1);
      const visitante = (local.id === t1.id) ? t2 : t1;

      partidosRonda.push({
        id: `PART-${(round + 1).toString().padStart(2, "0")}-${(i + 1).toString().padStart(2, "0")}`,
        jornada: round + 1,
        localId: local.id,
        localNombre: local.nombre,
        localBadge: local.badge,
        visitanteId: visitante.id,
        visitanteNombre: visitante.nombre,
        visitanteBadge: visitante.badge,
        golesLocal: null,
        golesVisitante: null,
        jugado: false,
        eventos: []
      });
    }

    fixture.push({
      jornada: round + 1,
      partidos: partidosRonda
    });

    // Rotar los equipos móviles
    rotating.unshift(rotating.pop());
  }

  // Segunda rueda (fechas 10 a 18): mismas parejas con localía invertida
  for (let round = 0; round < totalFechasIda; round++) {
    const jornadaVuelta = round + 1 + totalFechasIda;
    const partidosVuelta = fixture[round].partidos.map((p, idx) => ({
      id: `PART-${jornadaVuelta.toString().padStart(2, "0")}-${(idx + 1).toString().padStart(2, "0")}`,
      jornada: jornadaVuelta,
      localId: p.visitanteId,
      localNombre: p.visitanteNombre,
      localBadge: p.visitanteBadge,
      visitanteId: p.localId,
      visitanteNombre: p.localNombre,
      visitanteBadge: p.localBadge,
      golesLocal: null,
      golesVisitante: null,
      jugado: false,
      eventos: []
    }));

    fixture.push({
      jornada: jornadaVuelta,
      partidos: partidosVuelta
    });
  }

  return fixture;
}

/**
 * Selecciona un jugador de una lista según ponderación de posición
 */
function seleccionarJugadorPonderado(jugadores, pesos) {
  const pool = [];
  jugadores.forEach(j => {
    const peso = pesos[j.posicion] || 1;
    for (let w = 0; w < peso; w++) {
      pool.push(j);
    }
  });
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Simula un partido individual entre dos equipos
 */
function simularPartido(partido, equipoLocal, equipoVisitante) {
  // Configurar alineaciones iniciales (11 titulares y 5 suplentes)
  const titularesLocal = [...equipoLocal.jugadores.slice(0, 11)];
  const suplentesLocal = [...equipoLocal.jugadores.slice(11)];

  const titularesVisitante = [...equipoVisitante.jugadores.slice(0, 11)];
  const suplentesVisitante = [...equipoVisitante.jugadores.slice(11)];

  // Registrar partidos jugados a los titulares
  titularesLocal.forEach(j => { j.partidosJugados = (j.partidosJugados || 0) + 1; });
  titularesVisitante.forEach(j => { j.partidosJugados = (j.partidosJugados || 0) + 1; });

  // Distribución de goles razonable (0 a 4 goles, sesgo a marcadores bajos)
  const pesosGoles = [35, 30, 20, 10, 5];
  function generarGoles() {
    const rnd = Math.random() * 100;
    let acumulado = 0;
    for (let g = 0; g < pesosGoles.length; g++) {
      acumulado += pesosGoles[g];
      if (rnd <= acumulado) return g;
    }
    return 1;
  }

  const golesL = generarGoles();
  const golesV = generarGoles();

  const eventos = [];
  const enCanchaLocal = [...titularesLocal];
  const enCanchaVisitante = [...titularesVisitante];

  // Sustituciones (entre 1 y 3 cambios por equipo en minutos 46-85)
  const numCambiosLocal = Math.floor(Math.random() * 3) + 1;
  const numCambiosVisitante = Math.floor(Math.random() * 3) + 1;

  function realizarCambio(equipo, enCancha, suplentesDisponibles) {
    if (suplentesDisponibles.length === 0) return;
    // No cambiar al arquero normalmente
    const candidatosSalida = enCancha.filter(j => j.posicion !== "ARQ");
    if (candidatosSalida.length === 0) return;

    const sale = candidatosSalida[Math.floor(Math.random() * candidatosSalida.length)];
    const entraIdx = Math.floor(Math.random() * suplentesDisponibles.length);
    const entra = suplentesDisponibles.splice(entraIdx, 1)[0];

    // Reemplazar en cancha
    const idxSalida = enCancha.findIndex(j => j.id === sale.id);
    if (idxSalida !== -1) {
      enCancha[idxSalida] = entra;
    }
    entra.partidosJugados = (entra.partidosJugados || 0) + 1;

    const minuto = Math.floor(Math.random() * 40) + 46; // min 46 a 85
    eventos.push({
      tipo: "sustitucion",
      minuto: minuto,
      equipoId: equipo.id,
      equipoNombre: equipo.nombre,
      sale: {
        id: sale.id,
        nombre: sale.nombre,
        dorsal: sale.dorsal,
        posicion: sale.posicion
      },
      entra: {
        id: entra.id,
        nombre: entra.nombre,
        dorsal: entra.dorsal,
        posicion: entra.posicion
      }
    });
  }

  for (let c = 0; c < numCambiosLocal; c++) {
    realizarCambio(equipoLocal, enCanchaLocal, suplentesLocal);
  }
  for (let c = 0; c < numCambiosVisitante; c++) {
    realizarCambio(equipoVisitante, enCanchaVisitante, suplentesVisitante);
  }

  // Generar eventos de goles del Local
  for (let g = 0; g < golesL; g++) {
    const minuto = Math.floor(Math.random() * 90) + 1;
    // Delanteros y mediocampistas tienen más probabilidad de gol
    const autor = seleccionarJugadorPonderado(enCanchaLocal, { DEL: 6, MED: 4, DEF: 1, ARQ: 0 });
    autor.goles = (autor.goles || 0) + 1;

    // Asistencia (70% de probabilidad con compañero distinto)
    let asistidor = null;
    if (Math.random() < 0.70) {
      const posiblesAsistidores = enCanchaLocal.filter(j => j.id !== autor.id);
      if (posiblesAsistidores.length > 0) {
        asistidor = seleccionarJugadorPonderado(posiblesAsistidores, { MED: 6, DEL: 3, DEF: 2, ARQ: 0 });
        asistidor.asistencias = (asistidor.asistencias || 0) + 1;
      }
    }

    eventos.push({
      tipo: "gol",
      minuto: minuto,
      equipoId: equipoLocal.id,
      equipoNombre: equipoLocal.nombre,
      autor: {
        id: autor.id,
        nombre: autor.nombre,
        dorsal: autor.dorsal,
        posicion: autor.posicion
      },
      asistidor: asistidor ? {
        id: asistidor.id,
        nombre: asistidor.nombre,
        dorsal: asistidor.dorsal,
        posicion: asistidor.posicion
      } : null
    });
  }

  // Generar eventos de goles del Visitante
  for (let g = 0; g < golesV; g++) {
    const minuto = Math.floor(Math.random() * 90) + 1;
    const autor = seleccionarJugadorPonderado(enCanchaVisitante, { DEL: 6, MED: 4, DEF: 1, ARQ: 0 });
    autor.goles = (autor.goles || 0) + 1;

    let asistidor = null;
    if (Math.random() < 0.70) {
      const posiblesAsistidores = enCanchaVisitante.filter(j => j.id !== autor.id);
      if (posiblesAsistidores.length > 0) {
        asistidor = seleccionarJugadorPonderado(posiblesAsistidores, { MED: 6, DEL: 3, DEF: 2, ARQ: 0 });
        asistidor.asistencias = (asistidor.asistencias || 0) + 1;
      }
    }

    eventos.push({
      tipo: "gol",
      minuto: minuto,
      equipoId: equipoVisitante.id,
      equipoNombre: equipoVisitante.nombre,
      autor: {
        id: autor.id,
        nombre: autor.nombre,
        dorsal: autor.dorsal,
        posicion: autor.posicion
      },
      asistidor: asistidor ? {
        id: asistidor.id,
        nombre: asistidor.nombre,
        dorsal: asistidor.dorsal,
        posicion: asistidor.posicion
      } : null
    });
  }

  // Ordenar cronológicamente por minuto
  eventos.sort((a, b) => a.minuto - b.minuto);

  partido.golesLocal = golesL;
  partido.golesVisitante = golesV;
  partido.jugado = true;
  partido.eventos = eventos;

  return partido;
}

/**
 * Simula la temporada completa (18 jornadas, 90 partidos) actualizando estadísticas de jugadores
 */
function simularTemporada(equipos) {
  const fixture = generarFixture(equipos);
  const mapEquipos = new Map(equipos.map(e => [e.id, e]));
  const todosLosPartidos = [];

  fixture.forEach(jornadaObj => {
    jornadaObj.partidos.forEach(p => {
      const eqLoc = mapEquipos.get(p.localId);
      const eqVis = mapEquipos.get(p.visitanteId);
      simularPartido(p, eqLoc, eqVis);
      todosLosPartidos.push(p);
    });
  });

  return {
    equipos,
    fixture,
    partidos: todosLosPartidos
  };
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    generarFixture,
    simularPartido,
    simularTemporada
  };
}
