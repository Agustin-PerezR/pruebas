/**
 * Test unitario para RF-01 (REQ-1789501307396)
 */
const { generarEquiposYPlanteles } = require("../js/data.js");

function runTest() {
  console.log("Iniciando pruebas para RF-01: Generación de 10 equipos...");
  const equipos = generarEquiposYPlanteles();

  if (!Array.isArray(equipos)) throw new Error("Equipos debe ser un Array");
  if (equipos.length !== 10) throw new Error(`Se esperaban 10 equipos, se obtuvieron ${equipos.length}`);

  equipos.forEach((eq, idx) => {
    if (!eq.id || !eq.nombre || !eq.badge) {
      throw new Error(`Equipo en índice ${idx} tiene datos incompletos`);
    }
    if (!Array.isArray(eq.jugadores) || eq.jugadores.length !== 16) {
      throw new Error(`El equipo ${eq.nombre} debe tener 16 jugadores (tiene ${eq.jugadores?.length})`);
    }
    const arqueros = eq.jugadores.filter(j => j.posicion === "ARQ");
    if (arqueros.length < 1) {
      throw new Error(`El equipo ${eq.nombre} no tiene arqueros registrados`);
    }
  });

  console.log("✅ RF-01: Verificación exitosa. 10 equipos y planteles generados correctamente.");
}

try {
  runTest();
} catch (err) {
  console.error("❌ Falló la prueba:", err.message);
  process.exit(1);
}
