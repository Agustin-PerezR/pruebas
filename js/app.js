/**
 * Controlador Principal de la Aplicación Web de Fútbol
 */

document.addEventListener("DOMContentLoaded", () => {
  const tablaWrapper = document.getElementById("tabla-wrapper");
  const fixtureWrapper = document.getElementById("fixture-wrapper");
  const btnNuevaTemporada = document.getElementById("btn-nueva-temporada");
  const infoPartidos = document.getElementById("info-partidos");
  const seccionTitulo = document.getElementById("seccion-titulo");

  const tabPosiciones = document.getElementById("tab-posiciones");
  const tabFixture = document.getElementById("tab-fixture");

  let vistaActiva = "posiciones"; // 'posiciones' | 'fixture'
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
  if (tabPosiciones && tabFixture) {
    tabPosiciones.addEventListener("click", () => {
      vistaActiva = "posiciones";
      tabPosiciones.classList.add("active");
      tabFixture.classList.remove("active");
      tablaWrapper.classList.remove("hidden");
      fixtureWrapper.classList.add("hidden");
      if (seccionTitulo) seccionTitulo.innerText = "Clasificación General";
    });

    tabFixture.addEventListener("click", () => {
      vistaActiva = "fixture";
      tabFixture.classList.add("active");
      tabPosiciones.classList.remove("active");
      fixtureWrapper.classList.remove("hidden");
      tablaWrapper.classList.add("hidden");
      if (seccionTitulo) seccionTitulo.innerText = "Fixture y Resultados de la Temporada";
    });
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
