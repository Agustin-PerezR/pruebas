/**
 * Cálculo y Vista de Tabla de Posiciones con Semáforo de Colores (RF-01 de HU-02)
 * ID Requerimiento: REQ-1789501339015
 */

/**
 * Calcula la tabla de posiciones a partir de la lista de equipos y los partidos disputados.
 * Aplica reglas oficiales: 3 pts por victoria, 1 pt por empate, 0 por derrota.
 * Criterios de desempate: Puntos > Diferencia de Gol > Goles a Favor > Menos Goles en Contra.
 * Asigna zonas semáforo:
 * - 1º: Campeón / Copa de Oro (Verde)
 * - 2º a 4º: Copas Internacionales (Naranja)
 * - 5º a 8º: Mitad de tabla (Neutral)
 * - 9º y 10º: Descenso (Rojo)
 */
function calcularTablaPosiciones(equipos, partidos) {
  if (!Array.isArray(equipos) || equipos.length === 0) {
    throw new Error("Se requiere una lista válida de equipos");
  }

  // Inicializar acumuladores por equipo
  const statsPorEquipo = {};
  equipos.forEach(eq => {
    statsPorEquipo[eq.id] = {
      equipoId: eq.id,
      nombre: eq.nombre,
      badge: eq.badge || "⚽",
      colorPrimario: eq.colorPrimario || "#3b82f6",
      colorSecundario: eq.colorSecundario || "#93c5fd",
      pj: 0,
      pg: 0,
      pe: 0,
      pp: 0,
      gf: 0,
      gc: 0,
      dg: 0,
      pts: 0,
      ultimosResultados: [] // 'G', 'E', 'P'
    };
  });

  // Procesar partidos disputados
  if (Array.isArray(partidos)) {
    partidos.forEach(p => {
      if (!p.jugado || typeof p.golesLocal !== "number" || typeof p.golesVisitante !== "number") {
        return;
      }

      const stLoc = statsPorEquipo[p.localId];
      const stVis = statsPorEquipo[p.visitanteId];

      if (!stLoc || !stVis) return;

      stLoc.pj++;
      stVis.pj++;

      stLoc.gf += p.golesLocal;
      stLoc.gc += p.golesVisitante;

      stVis.gf += p.golesVisitante;
      stVis.gc += p.golesLocal;

      if (p.golesLocal > p.golesVisitante) {
        // Victoria Local
        stLoc.pg++;
        stLoc.pts += 3;
        stLoc.ultimosResultados.push("G");

        stVis.pp++;
        stVis.ultimosResultados.push("P");
      } else if (p.golesLocal < p.golesVisitante) {
        // Victoria Visitante
        stVis.pg++;
        stVis.pts += 3;
        stVis.ultimosResultados.push("G");

        stLoc.pp++;
        stLoc.ultimosResultados.push("P");
      } else {
        // Empate
        stLoc.pe++;
        stLoc.pts += 1;
        stLoc.ultimosResultados.push("E");

        stVis.pe++;
        stVis.pts += 1;
        stVis.ultimosResultados.push("E");
      }
    });
  }

  // Calcular diferencia de gol y convertir a lista
  const tabla = Object.values(statsPorEquipo).map(st => {
    st.dg = st.gf - st.gc;
    // Mantener sólo los últimos 5 resultados para la forma reciente
    st.forma = st.ultimosResultados.slice(-5);
    return st;
  });

  // Ordenamiento con criterios de desempate
  tabla.sort((a, b) => {
    if (b.pts !== a.pts) return b.pts - a.pts; // 1. Puntos
    if (b.dg !== a.dg) return b.dg - a.dg;     // 2. Diferencia de gol
    if (b.gf !== a.gf) return b.gf - a.gf;     // 3. Goles a favor
    if (a.gc !== b.gc) return a.gc - b.gc;     // 4. Menos goles en contra
    return a.nombre.localeCompare(b.nombre);   // 5. Alfabético
  });

  // Asignar posición y semáforo de colores
  tabla.forEach((fila, index) => {
    const pos = index + 1;
    fila.posicion = pos;

    if (pos === 1) {
      fila.zona = "campeon";
      fila.zonaColor = "#16a34a"; // Verde
      fila.zonaTexto = "Campeón / Clasificación Directa";
    } else if (pos >= 2 && pos <= 4) {
      fila.zona = "copas";
      fila.zonaColor = "#ea580c"; // Naranja
      fila.zonaTexto = "Copas Internacionales";
    } else if (pos >= 9) {
      fila.zona = "descenso";
      fila.zonaColor = "#dc2626"; // Rojo
      fila.zonaTexto = "Zona de Descenso";
    } else {
      fila.zona = "normal";
      fila.zonaColor = "transparent";
      fila.zonaTexto = "Permanencia";
    }
  });

  return tabla;
}

/**
 * Renderiza el HTML de la tabla de posiciones con semáforo y diseño responsive
 */
function renderTablaPosicionesHTML(tabla) {
  if (!Array.isArray(tabla)) return "";

  const filasHTML = tabla.map(f => {
    const indicadorColor = f.zonaColor !== "transparent" 
      ? `style="border-left: 5px solid ${f.zonaColor};"`
      : `style="border-left: 5px solid transparent;"`;

    const badgeClase = `zona-${f.zona}`;

    return `
      <tr class="${badgeClase}" ${indicadorColor}>
        <td class="col-pos font-bold">
          <span class="pos-badge ${badgeClase}">${f.posicion}</span>
        </td>
        <td class="col-equipo">
          <span class="equipo-badge">${f.badge}</span>
          <span class="equipo-nombre">${f.nombre}</span>
        </td>
        <td class="col-stat font-medium">${f.pj}</td>
        <td class="col-stat text-success">${f.pg}</td>
        <td class="col-stat text-warning">${f.pe}</td>
        <td class="col-stat text-danger">${f.pp}</td>
        <td class="col-stat">${f.gf}</td>
        <td class="col-stat">${f.gc}</td>
        <td class="col-stat font-semibold">${f.dg > 0 ? `+${f.dg}` : f.dg}</td>
        <td class="col-stat col-pts font-bold">${f.pts}</td>
      </tr>
    `;
  }).join("");

  return `
    <div class="tabla-container">
      <table class="tabla-posiciones">
        <thead>
          <tr>
            <th class="col-pos">#</th>
            <th class="col-equipo">Equipo</th>
            <th class="col-stat" title="Partidos Jugados">PJ</th>
            <th class="col-stat" title="Partidos Ganados">PG</th>
            <th class="col-stat" title="Partidos Empatados">PE</th>
            <th class="col-stat" title="Partidos Perdidos">PP</th>
            <th class="col-stat" title="Goles a Favor">GF</th>
            <th class="col-stat" title="Goles en Contra">GC</th>
            <th class="col-stat" title="Diferencia de Gol">DG</th>
            <th class="col-stat col-pts" title="Puntos">PTS</th>
          </tr>
        </thead>
        <tbody>
          ${filasHTML}
        </tbody>
      </table>
      <div class="tabla-leyenda">
        <div class="leyenda-item"><span class="leyenda-box verde"></span> 1° Campeón / Fase de Grupos</div>
        <div class="leyenda-item"><span class="leyenda-box naranja"></span> 2° - 4° Clasificación a Copas</div>
        <div class="leyenda-item"><span class="leyenda-box rojo"></span> 9° - 10° Descenso directo</div>
      </div>
    </div>
  `;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    calcularTablaPosiciones,
    renderTablaPosicionesHTML
  };
}
