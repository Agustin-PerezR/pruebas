/**
 * Controlador Principal de la Aplicación Web de Fútbol
 */

document.addEventListener("DOMContentLoaded", () => {
  const tablaWrapper = document.getElementById("tabla-wrapper");
  const fixtureWrapper = document.getElementById("fixture-wrapper");
  const statsWrapper = document.getElementById("stats-wrapper");
  const btnNuevaTemporada = document.getElementById("btn-nueva-temporada");
  const infoPartidos = document.getElementById("info-partidos");
  const seccionTitulo = document.getElementById("seccion-titulo");

  const tabPosiciones = document.getElementById("tab-posiciones");
  const tabFixture = document.getElementById("tab-fixture");
  const tabStats = document.getElementById("tab-stats");

  let vistaActiva = "posiciones"; // 'posiciones' | 'fixture' | 'stats'
  let filtroEquipoActual = "todos";
  let filtroJornadaActual = "todas";

  let estadoLiga = {
    equipos: [],
    fixture: [],
    partidos: [],
    tabla: []
  };

  function actualizarVistas() {
    // 1. Renderizar tabla de clasificación
    if (tablaWrapper) {
      tablaWrapper.innerHTML = renderTablaPosicionesHTML(estadoLiga.tabla);
    }

    // 2. Renderizar fixture con filtros actuales
    if (fixtureWrapper) {
      fixtureWrapper.innerHTML = renderFixtureHTML(
        estadoLiga.partidos,
        estadoLiga.equipos,
        filtroEquipoActual,
        filtroJornadaActual
      );
      vincularEventosFixture();
    }

    // 3. Renderizar estadísticas individuales
    if (statsWrapper && typeof obtenerMaximosGoleadores === "function") {
      const topGoleadores = obtenerMaximosGoleadores(estadoLiga.equipos, 10);
      const topAsistidores = obtenerMaximosAsistidores(estadoLiga.equipos, 10);
      statsWrapper.innerHTML = renderEstadisticasHTML(topGoleadores, topAsistidores);
    }

    if (infoPartidos) {
      const golesTotales = estadoLiga.partidos.reduce((acc, p) => acc + p.golesLocal + p.golesVisitante, 0);
      infoPartidos.innerText = `${estadoLiga.fixture.length} jornadas disputadas • ${estadoLiga.partidos.length} partidos • ${golesTotales} goles convertidos`;
    }
  }

  function vincularEventosFixture() {
    const selEquipo = document.getElementById("select-filtro-equipo");
    const selJornada = document.getElementById("select-filtro-jornada");

    if (selEquipo) {
      selEquipo.addEventListener("change", (e) => {
        filtroEquipoActual = e.target.value;
        actualizarVistas();
      });
    }

    if (selJornada) {
      selJornada.addEventListener("change", (e) => {
        filtroJornadaActual = e.target.value;
        actualizarVistas();
      });
    }

    // Delegación de eventos para botones de detalle de partido
    document.querySelectorAll(".btn-ver-detalle, .partido-card").forEach(el => {
      el.addEventListener("click", (e) => {
        const matchId = el.getAttribute("data-match-id");
        if (matchId) {
          abrirModalPartido(matchId);
        }
      });
    });
  }

  function abrirModalPartido(matchId) {
    const modalContainer = document.getElementById("modal-container");
    if (!modalContainer) return;

    const detalle = obtenerDetallePartido(estadoLiga.partidos, matchId);
    if (!detalle) return;

    modalContainer.innerHTML = renderModalDetalleHTML(detalle);

    const btnCerrar = document.getElementById("btn-cerrar-modal");
    const backdrop = document.getElementById("modal-backdrop");

    if (btnCerrar) {
      btnCerrar.addEventListener("click", cerrarModal);
    }
    if (backdrop) {
      backdrop.addEventListener("click", (e) => {
        if (e.target === backdrop) cerrarModal();
      });
    }
  }

  function cerrarModal() {
    const modalContainer = document.getElementById("modal-container");
    if (modalContainer) modalContainer.innerHTML = "";
  }

  function inicializarTemporada() {
    // 1. Generar 10 clubes y planteles (RF-01)
    const equipos = generarEquiposYPlanteles();

    // 2. Simular fixture y partidos de la temporada (RF-02)
    const { fixture, partidos } = simularTemporada(equipos);

    // 3. Calcular tabla de clasificación con semáforo (HU-02 / RF-01)
    const tabla = calcularTablaPosiciones(equipos, partidos);

    estadoLiga = { equipos, fixture, partidos, tabla };
    filtroEquipoActual = "todos";
    filtroJornadaActual = "todas";

    actualizarVistas();
  }

  // Navegación por Pestañas
  function seleccionarPestaña(vista) {
    vistaActiva = vista;
    [tabPosiciones, tabFixture, tabStats].forEach(t => {
      if (t) t.classList.remove("active");
    });
    [tablaWrapper, fixtureWrapper, statsWrapper].forEach(w => {
      if (w) w.classList.add("hidden");
    });

    if (vista === "posiciones") {
      if (tabPosiciones) tabPosiciones.classList.add("active");
      if (tablaWrapper) tablaWrapper.classList.remove("hidden");
      if (seccionTitulo) seccionTitulo.innerText = "Clasificación General";
    } else if (vista === "fixture") {
      if (tabFixture) tabFixture.classList.add("active");
      if (fixtureWrapper) fixtureWrapper.classList.remove("hidden");
      if (seccionTitulo) seccionTitulo.innerText = "Fixture y Resultados de la Temporada";
    } else if (vista === "stats") {
      if (tabStats) tabStats.classList.add("active");
      if (statsWrapper) statsWrapper.classList.remove("hidden");
      if (seccionTitulo) seccionTitulo.innerText = "Estadísticas: Líderes de Goleo y Asistencias";
    }
  }

  if (tabPosiciones) tabPosiciones.addEventListener("click", () => seleccionarPestaña("posiciones"));
  if (tabFixture) tabFixture.addEventListener("click", () => seleccionarPestaña("fixture"));
  if (tabStats) tabStats.addEventListener("click", () => seleccionarPestaña("stats"));

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
