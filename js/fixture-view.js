/**
 * Listado de Fixture y Filtrado de Resultados por Equipo (RF-01 de HU-03)
 * ID Requerimiento: REQ-1789501384835
 */

/**
 * Filtra la lista completa de partidos según el equipo seleccionado
 */
function filtrarPartidosPorEquipo(partidos, equipoId) {
  if (!Array.isArray(partidos)) return [];
  if (!equipoId || equipoId === "todos") return partidos;
  return partidos.filter(p => p.localId === equipoId || p.visitanteId === equipoId);
}

/**
 * Filtra los partidos por número de jornada
 */
function filtrarPartidosPorJornada(partidos, jornada) {
  if (!Array.isArray(partidos)) return [];
  if (!jornada || jornada === "todas") return partidos;
  const jNum = parseInt(jornada, 10);
  return partidos.filter(p => p.jornada === jNum);
}

/**
 * Renderiza el componente HTML del fixture y buscador por equipo
 */
function renderFixtureHTML(partidos, equipos, equipoSeleccionado = "todos", jornadaSeleccionada = "todas") {
  let partidosFiltrados = filtrarPartidosPorEquipo(partidos, equipoSeleccionado);
  partidosFiltrados = filtrarPartidosPorJornada(partidosFiltrados, jornadaSeleccionada);

  // Generar opciones de equipos
  const opcionesEquipos = [
    `<option value="todos" ${equipoSeleccionado === "todos" ? "selected" : ""}>Todos los clubes</option>`,
    ...equipos.map(eq => `<option value="${eq.id}" ${equipoSeleccionado === eq.id ? "selected" : ""}>${eq.badge} ${eq.nombre}</option>`)
  ].join("");

  // Generar opciones de jornadas (1 a 18)
  const jornadasUnicas = [...new Set(partidos.map(p => p.jornada))].sort((a, b) => a - b);
  const opcionesJornadas = [
    `<option value="todas" ${jornadaSeleccionada === "todas" ? "selected" : ""}>Todas las fechas</option>`,
    ...jornadasUnicas.map(j => `<option value="${j}" ${jornadaSeleccionada == j ? "selected" : ""}>Fecha ${j}</option>`)
  ].join("");

  // Agrupar los partidos filtrados por jornada
  const agrupados = {};
  partidosFiltrados.forEach(p => {
    if (!agrupados[p.jornada]) agrupados[p.jornada] = [];
    agrupados[p.jornada].push(p);
  });

  const jornadasHTML = Object.keys(agrupados).sort((a, b) => a - b).map(j => {
    const listaPartidos = agrupados[j].map(p => {
      const ganadorLocal = p.golesLocal > p.golesVisitante;
      const ganadorVisitante = p.golesVisitante > p.golesLocal;

      return `
        <div class="partido-card" data-match-id="${p.id}">
          <div class="equipo-lado local ${ganadorLocal ? 'ganador' : ''}">
            <span class="nombre">${p.localNombre}</span>
            <span class="badge">${p.localBadge}</span>
          </div>
          <div class="marcador-box">
            <span class="score">${p.golesLocal}</span>
            <span class="vs">-</span>
            <span class="score">${p.golesVisitante}</span>
            <span class="estado-final">FINAL</span>
          </div>
          <div class="equipo-lado visitante ${ganadorVisitante ? 'ganador' : ''}">
            <span class="badge">${p.visitanteBadge}</span>
            <span class="nombre">${p.visitanteNombre}</span>
          </div>
          <button class="btn-ver-detalle" data-match-id="${p.id}" title="Ver detalle del partido">Detalle</button>
        </div>
      `;
    }).join("");

    return `
      <div class="jornada-bloque">
        <h3 class="jornada-titulo">Fecha ${j}</h3>
        <div class="partidos-grid">
          ${listaPartidos}
        </div>
      </div>
    `;
  }).join("");

  return `
    <div class="fixture-container">
      <div class="filtros-fixture-bar">
        <div class="filtro-item">
          <label for="select-filtro-equipo">Filtrar por Equipo:</label>
          <select id="select-filtro-equipo" class="filtro-select">
            ${opcionesEquipos}
          </select>
        </div>
        <div class="filtro-item">
          <label for="select-filtro-jornada">Filtrar por Jornada:</label>
          <select id="select-filtro-jornada" class="filtro-select">
            ${opcionesJornadas}
          </select>
        </div>
        <div class="resultados-contador">
          Mostrando ${partidosFiltrados.length} de ${partidos.length} partidos
        </div>
      </div>
      <div class="fixture-list">
        ${partidosFiltrados.length > 0 ? jornadasHTML : '<p class="sin-resultados">No se encontraron partidos con los filtros seleccionados.</p>'}
      </div>
    </div>
  `;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    filtrarPartidosPorEquipo,
    filtrarPartidosPorJornada,
    renderFixtureHTML
  };
}
