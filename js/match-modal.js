/**
 * Detalle de Partido con Cronología de Goles y Sustituciones (RF-01 de HU-04)
 * ID Requerimiento: REQ-1789501399433
 */

/**
 * Obtiene los detalles y cronología ordenada de un partido por su ID
 */
function obtenerDetallePartido(partidos, matchId) {
  if (!Array.isArray(partidos) || !matchId) return null;
  const partido = partidos.find(p => p.id === matchId);
  if (!partido) return null;

  const goles = partido.eventos.filter(e => e.tipo === "gol");
  const sustituciones = partido.eventos.filter(e => e.tipo === "sustitucion");
  const eventosOrdenados = [...partido.eventos].sort((a, b) => a.minuto - b.minuto);

  return {
    ...partido,
    goles,
    sustituciones,
    eventosOrdenados
  };
}

/**
 * Renderiza el HTML de la vista modal de detalle de partido
 */
function renderModalDetalleHTML(partidoDetalle) {
  if (!partidoDetalle) return "";

  const p = partidoDetalle;

  // Generar HTML de la cronología de eventos
  const cronologiaHTML = p.eventosOrdenados.length > 0
    ? p.eventosOrdenados.map(ev => {
        if (ev.tipo === "gol") {
          const assistText = ev.asistidor ? `<span class="asist-info">(Pase gol: ${ev.asistidor.nombre})</span>` : "";
          return `
            <div class="evento-item evento-gol" data-minuto="${ev.minuto}">
              <div class="evento-minuto">${ev.minuto}'</div>
              <div class="evento-icono">⚽</div>
              <div class="evento-desc">
                <span class="evento-tipo font-bold">¡GOL!</span>
                <span class="evento-equipo">[${ev.equipoNombre}]</span>
                <span class="evento-autor">${ev.autor.nombre} (#${ev.autor.dorsal})</span>
                ${assistText}
              </div>
            </div>
          `;
        } else if (ev.tipo === "sustitucion") {
          return `
            <div class="evento-item evento-sustitucion" data-minuto="${ev.minuto}">
              <div class="evento-minuto">${ev.minuto}'</div>
              <div class="evento-icono">🔄</div>
              <div class="evento-desc">
                <span class="evento-tipo font-bold">Sustitución</span>
                <span class="evento-equipo">[${ev.equipoNombre}]</span>
                <span class="sub-sale text-danger">🔴 Sale: ${ev.sale.nombre} (#${ev.sale.dorsal})</span>
                <span class="sub-entra text-success">🟢 Entra: ${ev.entra.nombre} (#${ev.entra.dorsal})</span>
              </div>
            </div>
          `;
        }
        return "";
      }).join("")
    : `<p class="sin-eventos">No se registraron incidencias destacadas en el encuentro.</p>`;

  return `
    <div class="modal-backdrop" id="modal-backdrop">
      <div class="modal-content" role="dialog" aria-labelledby="modal-titulo" aria-modal="true">
        <header class="modal-header">
          <span class="modal-jornada-badge">Fecha ${p.jornada}</span>
          <button class="modal-btn-cerrar" id="btn-cerrar-modal" aria-label="Cerrar modal">&times;</button>
        </header>

        <div class="modal-marcador-hero">
          <div class="modal-equipo local">
            <span class="modal-badge">${p.localBadge}</span>
            <span class="modal-nombre-club font-bold">${p.localNombre}</span>
          </div>
          <div class="modal-score-box">
            <span class="modal-score">${p.golesLocal}</span>
            <span class="modal-separador">:</span>
            <span class="modal-score">${p.golesVisitante}</span>
            <span class="modal-status">FINALIZADO</span>
          </div>
          <div class="modal-equipo visitante">
            <span class="modal-badge">${p.visitanteBadge}</span>
            <span class="modal-nombre-club font-bold">${p.visitanteNombre}</span>
          </div>
        </div>

        <section class="modal-seccion-cronologia">
          <h4 class="cronologia-titulo" id="modal-titulo">Cronología de Incidencias</h4>
          <div class="cronologia-timeline">
            ${cronologiaHTML}
          </div>
        </section>
      </div>
    </div>
  `;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    obtenerDetallePartido,
    renderModalDetalleHTML
  };
}
