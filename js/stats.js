/**
 * Sección de Estadísticas de Máximos Goleadores y Asistidores (RF-01 de HU-05)
 * ID Requerimiento: REQ-1789501414613
 */

/**
 * Obtiene la lista de jugadores de todos los equipos con información de su club
 */
function extraerTodosLosJugadores(equipos) {
  if (!Array.isArray(equipos)) return [];
  const lista = [];

  equipos.forEach(eq => {
    if (Array.isArray(eq.jugadores)) {
      eq.jugadores.forEach(j => {
        lista.push({
          id: j.id,
          nombre: j.nombre,
          dorsal: j.dorsal,
          posicion: j.posicion,
          rol: j.rol,
          goles: j.goles || 0,
          asistencias: j.asistencias || 0,
          partidosJugados: j.partidosJugados || 0,
          equipoId: eq.id,
          equipoNombre: eq.nombre,
          equipoBadge: eq.badge
        });
      });
    }
  });

  return lista;
}

/**
 * Obtiene el ranking de máximos goleadores ordenados descendentemente
 */
function obtenerMaximosGoleadores(equipos, limite = 10) {
  const jugadores = extraerTodosLosJugadores(equipos);

  // Filtrar y ordenar por goles desc, luego menos partidos jugados, luego alfabético
  const goleadores = jugadores
    .filter(j => j.goles > 0)
    .sort((a, b) => {
      if (b.goles !== a.goles) return b.goles - a.goles;
      if (a.partidosJugados !== b.partidosJugados) return a.partidosJugados - b.partidosJugados;
      return a.nombre.localeCompare(b.nombre);
    })
    .slice(0, limite);

  return goleadores.map((j, idx) => ({
    ...j,
    posicion: idx + 1,
    promedio: j.partidosJugados > 0 ? (j.goles / j.partidosJugados).toFixed(2) : "0.00"
  }));
}

/**
 * Obtiene el ranking de máximos asistidores ordenados descendentemente
 */
function obtenerMaximosAsistidores(equipos, limite = 10) {
  const jugadores = extraerTodosLosJugadores(equipos);

  const asistidores = jugadores
    .filter(j => j.asistencias > 0)
    .sort((a, b) => {
      if (b.asistencias !== a.asistencias) return b.asistencias - a.asistencias;
      if (a.partidosJugados !== b.partidosJugados) return a.partidosJugados - b.partidosJugados;
      return a.nombre.localeCompare(b.nombre);
    })
    .slice(0, limite);

  return asistidores.map((j, idx) => ({
    ...j,
    posicion: idx + 1,
    promedio: j.partidosJugados > 0 ? (j.asistencias / j.partidosJugados).toFixed(2) : "0.00"
  }));
}

/**
 * Renderiza el HTML de las tablas de goleadores y asistidores
 */
function renderEstadisticasHTML(goleadores, asistidores) {
  function renderFilas(items, statProp, labelStat) {
    if (!items || items.length === 0) {
      return `<tr><td colspan="5" class="text-center py-4 text-muted">Aún no se registran ${labelStat.toLowerCase()} en el torneo.</td></tr>`;
    }

    return items.map(it => {
      let podioClase = "";
      if (it.posicion === 1) podioClase = "podio-oro";
      else if (it.posicion === 2) podioClase = "podio-plata";
      else if (it.posicion === 3) podioClase = "podio-bronce";

      return `
        <tr class="${podioClase}">
          <td class="col-pos font-bold">
            <span class="pos-badge ${podioClase}">${it.posicion}</span>
          </td>
          <td class="col-jugador">
            <div class="jugador-info">
              <span class="jugador-nombre font-semibold">${it.nombre}</span>
              <span class="jugador-dorsal text-muted">#${it.dorsal} • ${it.posicion}</span>
            </div>
          </td>
          <td class="col-equipo-stat">
            <span class="badge-mini">${it.equipoBadge}</span>
            <span class="nombre-club-stat">${it.equipoNombre}</span>
          </td>
          <td class="col-stat text-center font-medium">${it.partidosJugados}</td>
          <td class="col-stat col-stat-principal font-bold text-center">${it[statProp]}</td>
        </tr>
      `;
    }).join("");
  }

  const filasGoleadores = renderFilas(goleadores, "goles", "Goles");
  const filasAsistidores = renderFilas(asistidores, "asistencias", "Asistencias");

  return `
    <div class="estadisticas-container">
      <div class="stats-grid">
        <!-- Tabla Goleadores -->
        <div class="stats-card">
          <div class="stats-card-header">
            <span class="stats-header-icon">⚽</span>
            <div>
              <h3 class="stats-card-titulo">Tabla de Goleadores</h3>
              <p class="stats-card-subtitulo">Líderes de goleo individual de la temporada</p>
            </div>
          </div>
          <div class="tabla-container">
            <table class="tabla-posiciones tabla-stats">
              <thead>
                <tr>
                  <th class="col-pos">#</th>
                  <th>Jugador</th>
                  <th>Club</th>
                  <th class="col-stat text-center" title="Partidos Jugados">PJ</th>
                  <th class="col-stat col-stat-principal text-center" title="Goles anotados">Goles</th>
                </tr>
              </thead>
              <tbody>
                ${filasGoleadores}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Tabla Asistidores -->
        <div class="stats-card">
          <div class="stats-card-header">
            <span class="stats-header-icon">🎯</span>
            <div>
              <h3 class="stats-card-titulo">Líderes de Asistencias</h3>
              <p class="stats-card-subtitulo">Mejores pasadores gol del torneo</p>
            </div>
          </div>
          <div class="tabla-container">
            <table class="tabla-posiciones tabla-stats">
              <thead>
                <tr>
                  <th class="col-pos">#</th>
                  <th>Jugador</th>
                  <th>Club</th>
                  <th class="col-stat text-center" title="Partidos Jugados">PJ</th>
                  <th class="col-stat col-stat-principal text-center" title="Pases gol">Asist.</th>
                </tr>
              </thead>
              <tbody>
                ${filasAsistidores}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    extraerTodosLosJugadores,
    obtenerMaximosGoleadores,
    obtenerMaximosAsistidores,
    renderEstadisticasHTML
  };
}
