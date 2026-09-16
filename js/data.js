/**
 * Motor de Generación de 10 Equipos y Jugadores (RF-01)
 * ID Requerimiento: REQ-1789501307396
 */

const NOMBRES_CIUDADES = [
  "Metropolitano", "Costa Norte", "Real Central", "Atlético Puerto", "Deportivo Sur",
  "Valle Unido", "Estrella Oriental", "Unión Andina", "Sporting Ribera", "Pampa FC",
  "Alianza Sol", "Huracán del Plata", "Juventud Marina", "Leones del Parque"
];

const COLORES_EQUIPOS = [
  { primary: "#1e3a8a", secondary: "#60a5fa", badge: "🔵" },
  { primary: "#991b1b", secondary: "#f87171", badge: "🔴" },
  { primary: "#166534", secondary: "#4ade80", badge: "🟢" },
  { primary: "#854d0e", secondary: "#facc15", badge: "🟡" },
  { primary: "#581c87", secondary: "#c084fc", badge: "🟣" },
  { primary: "#0f766e", secondary: "#2dd4bf", badge: "🩵" },
  { primary: "#9a3412", secondary: "#fb923c", badge: "🟠" },
  { primary: "#374151", secondary: "#9ca3af", badge: "⚫" },
  { primary: "#831843", secondary: "#f472b6", badge: "🩷" },
  { primary: "#1e293b", secondary: "#38bdf8", badge: "🔷" }
];

const NOMBRES_PILA = [
  "Santiago", "Mateo", "Sebastián", "Alejandro", "Lucas", "Nicolás", "Julián", "Emiliano",
  "Rodrigo", "Lautaro", "Franco", "Gonzalo", "Tomás", "Facundo", "Ignacio", "Leandro",
  "Maximiliano", "Damián", "Gabriel", "Agustín", "Federico", "Joaquín", "Esteban", "Matías"
];

const APELLIDOS = [
  "González", "Rodríguez", "López", "Martínez", "Gómez", "Díaz", "Álvarez", "Romero",
  "Benítez", "Sánchez", "Pérez", "Fernández", "García", "Herrera", "Medina", "Torres",
  "Acosta", "Rojas", "Silva", "Suárez", "Giménez", "Castro", "Molina", "Ríos"
];

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generarNombreJugador() {
  return `${getRandomElement(NOMBRES_PILA)} ${getRandomElement(APELLIDOS)}`;
}

/**
 * Genera la lista de 10 equipos con planteles completos (16 jugadores por equipo)
 */
function generarEquiposYPlanteles() {
  const shuffledNames = [...NOMBRES_CIUDADES].sort(() => 0.5 - Math.random());
  const equipos = [];

  for (let i = 0; i < 10; i++) {
    const clubId = `EQ-${(i + 1).toString().padStart(2, "0")}`;
    const clubName = shuffledNames[i];
    const palette = COLORES_EQUIPOS[i % COLORES_EQUIPOS.length];

    const jugadores = [];
    const posiciones = [
      { rol: "Arquero", pos: "ARQ", count: 2, dorsalStart: 1 },
      { rol: "Defensor", pos: "DEF", count: 5, dorsalStart: 2 },
      { rol: "Mediocampista", pos: "MED", count: 5, dorsalStart: 7 },
      { rol: "Delantero", pos: "DEL", count: 4, dorsalStart: 12 }
    ];

    let currentDorsal = 1;
    posiciones.forEach(pGroup => {
      for (let j = 0; j < pGroup.count; j++) {
        jugadores.push({
          id: `JUG-${clubId}-${currentDorsal}`,
          dorsal: currentDorsal,
          nombre: generarNombreJugador(),
          posicion: pGroup.pos,
          rol: pGroup.rol,
          goles: 0,
          asistencias: 0,
          partidosJugados: 0
        });
        currentDorsal++;
      }
    });

    equipos.push({
      id: clubId,
      nombre: clubName,
      badge: palette.badge,
      colorPrimario: palette.primary,
      colorSecundario: palette.secondary,
      estadio: `Estadio Municipal de ${clubName}`,
      jugadores: jugadores
    });
  }

  return equipos;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { generarEquiposYPlanteles, NOMBRES_CIUDADES, COLORES_EQUIPOS };
}
