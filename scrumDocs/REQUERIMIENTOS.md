# Requerimientos -- prueba

_Generado automaticamente el 2026-09-15T19:46:46.048Z -- no editar a mano, se sobreescribe en cada publicacion._

## HU-01: Generación y simulación de datos de liga (10 equipos y jugadores)

### RF-01: Motor de generación de 10 equipos y jugadores (Funcional)

Generador aleatorio de nombres de clubes y planteles de futbolistas en memoria/cliente sin requerir login.

### RF-02: Simulador de fixture y resultados de la temporada (Funcional)

Generación de partidos de liga entre los 10 equipos con simulación de marcadores, goles y eventos.

## HU-02: Visualización de tabla de posiciones con diferenciación por colores

### RF-01: Cálculo y vista de tabla de posiciones con semáforo de colores (Funcional)

Cálculo de PJ, PG, PE, PP, GF, GC, DG y Puntos, aplicando verde (1º), naranja (copas) y rojo (descenso).

### RNF-01: Diseño UI responsive y estilos de la clasificación (No funcional)

Adaptabilidad a dispositivos móviles y coherencia estética según style.md.

## HU-03: Consulta de resultados y partidos de la temporada

### RF-01: Listado de fixture y filtrado de resultados por equipo (Funcional)

Pantalla de partidos disputados con posibilidad de filtrar por club.

## HU-04: Detalle de partido con eventos de goles y sustituciones

### RF-01: Detalle de partido con cronología de goles y sustituciones (Funcional)

Vista modal con minutos, goleadores y cambios de jugadores.

## HU-05: Ranking de estadísticas de máximos goleadores y asistidores

### RF-01: Sección de estadísticas de máximos goleadores y asistidores (Funcional)

Tablas ordenadas descendentemente con líderes de goleo y pases gol.
