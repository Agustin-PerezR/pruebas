# Plan de Requerimientos — prueba

_Generado automáticamente el 2026-09-16T12:58:17.674Z — no editar a mano, se sobreescribe en cada publicación._

Orden sugerido de desarrollo (respeta dependencias entre Requerimientos). Cada fila indica de qué Requerimientos depende, si tiene.

| Orden | Código | Requerimiento | Historia de Usuario | Módulo | Entrega | Estado | Desarrollador | Depende de | Rechazos |
|---|---|---|---|---|---|---|---|---|---|
| 1 | RF-01 | Motor de generación de 10 equipos y jugadores | HU-01 | — | — | production ✓✓ | dev-prueba | — | — |
| 2 | RF-02 | Simulador de fixture y resultados de la temporada | HU-01 | — | — | production ✓✓ | dev-prueba | RF-01 | — |
| 3 | RF-01 | Dockerizar la aplicación (Dockerfile y docker-compose) | RO-01 | — | — | production ✓✓ | dev-prueba | RF-01 | — |
| 4 | RF-01 | Cálculo y vista de tabla de posiciones con semáforo de colores | HU-02 | — | — | production ✓✓ | dev-prueba | RF-02 | — |
| 5 | RF-01 | Listado de fixture y filtrado de resultados por equipo | HU-03 | — | — | production ✓✓ | dev-prueba | RF-02 | — |
| 6 | RF-01 | Sección de estadísticas de máximos goleadores y asistidores | HU-05 | — | — | production ✓✓ | dev-prueba | RF-02 | — |
| 7 | RNF-01 | Diseño UI responsive y estilos de la clasificación | HU-02 | — | — | production ✓✓ | dev-prueba | RF-01 | — |
| 8 | RF-01 | Detalle de partido con cronología de goles y sustituciones | HU-04 | — | — | production ✓✓ | dev-prueba | RF-01 | — |

## Detalle

### RF-01 — Motor de generación de 10 equipos y jugadores
Motor de generacion de 10 equipos y planteles de 16 jugadores implementado y verificado con pruebas unitarias. PR #1 abierto contra dev.
- Estimado: 2h

### RF-02 — Simulador de fixture y resultados de la temporada
Simulador de fixture de 18 fechas y resultados de 90 partidos con eventos de goles y sustituciones completado y verificado con suite de tests. PR #2 abierto contra dev.
- Estimado: 3h

### RF-01 — Dockerizar la aplicación (Dockerfile y docker-compose)
Dockerización con Dockerfile y docker-compose.yml (8086:8000) completada y PR #8 abierto.
- Estimado: 2h

### RF-01 — Cálculo y vista de tabla de posiciones con semáforo de colores
Cálculo de tabla de posiciones con semáforo de colores y vista web responsive implementados y verificados con suite de tests. PR #3 abierto contra dev.
- Estimado: 3h

### RF-01 — Listado de fixture y filtrado de resultados por equipo
Listado de fixture de 18 fechas y filtrado dinamico por equipo y jornada implementado y verificado con suite de tests. PR #5 abierto contra dev.
- Estimado: 2h

### RF-01 — Sección de estadísticas de máximos goleadores y asistidores
Sección de estadísticas completada con rankings de goleadores y asistidores y PR #7 abierto.
- Estimado: 2h

### RNF-01 — Diseño UI responsive y estilos de la clasificación
Diseño responsive con media queries para móviles y coherencia estética según style.md verificado con tests. PR #4 abierto contra dev.
- Estimado: 2h

### RF-01 — Detalle de partido con cronología de goles y sustituciones
Detalle modal de partido con cronología de goles, asistencias y sustituciones implementado y verificado con suite de tests. PR #6 abierto contra dev.
- Estimado: 3h
