/**
 * Controlador Principal de la Aplicación Web de Fútbol
 */

document.addEventListener("DOMContentLoaded", () => {
  const tablaWrapper = document.getElementById("tabla-wrapper");
  const btnNuevaTemporada = document.getElementById("btn-nueva-temporada");
  const infoPartidos = document.getElementById("info-partidos");

  let estadoLiga = {
    equipos: [],
    fixture: [],
    partidos: [],
    tabla: []
  };

  function inicializarTemporada() {
    // 1. Generar 10 clubes y planteles (RF-01)
    const equipos = generarEquiposYPlanteles();

    // 2. Simular fixture y partidos de la temporada (RF-02)
    const { fixture, partidos } = simularTemporada(equipos);

    // 3. Calcular tabla de clasificación con semáforo (HU-02 / RF-01)
    const tabla = calcularTablaPosiciones(equipos, partidos);

    estadoLiga = { equipos, fixture, partidos, tabla };

    // 4. Renderizar la tabla de posiciones en la vista
    if (tablaWrapper) {
      tablaWrapper.innerHTML = renderTablaPosicionesHTML(tabla);
    }

    if (infoPartidos) {
      const golesTotales = partidos.reduce((acc, p) => acc + p.golesLocal + p.golesVisitante, 0);
      infoPartidos.innerText = `${fixture.length} jornadas disputadas • ${partidos.length} partidos • ${golesTotales} goles convertidos`;
    }
  }

  // Listener para simular nueva liga / temporada
  if (btnNuevaTemporada) {
    btnNuevaTemporada.addEventListener("click", () => {
      btnNuevaTemporada.disabled = true;
      btnNuevaTemporada.innerText = "Simulando...";
      setTimeout(() => {
        inicializarTemporada();
        btnNuevaTemporada.disabled = false;
        btnNuevaTemporada.innerHTML = "<span>🔄</span> Simular Nueva Temporada";
      }, 250);
    });
  }

  // Carga inicial automática
  inicializarTemporada();
});
