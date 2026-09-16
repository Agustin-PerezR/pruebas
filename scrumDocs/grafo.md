# Grafo de Dependencias -- prueba

_Generado automaticamente el 2026-09-16T11:43:58.564Z -- no editar a mano, se sobreescribe en cada publicacion._

```mermaid
graph TD
  subgraph US_1789500774004["HU-01: Generación y simulación de datos de liga (10 equipos y jugadores)"]
    REQ_1789501307396["RF-01: Motor de generación de 10 equipos y jugadores"]
    REQ_1789501323521["RF-02: Simulador de fixture y resultados de la temporada"]
  end
  subgraph US_1789500801469["HU-02: Visualización de tabla de posiciones con diferenciación por colores"]
    REQ_1789501339015["RF-01: Cálculo y vista de tabla de posiciones con semáforo de colores"]
    REQ_1789501354292["RNF-01: Diseño UI responsive y estilos de la clasificación"]
  end
  subgraph US_1789500818362["HU-03: Consulta de resultados y partidos de la temporada"]
    REQ_1789501384835["RF-01: Listado de fixture y filtrado de resultados por equipo"]
  end
  subgraph US_1789500834077["HU-04: Detalle de partido con eventos de goles y sustituciones"]
    REQ_1789501399433["RF-01: Detalle de partido con cronología de goles y sustituciones"]
  end
  subgraph US_1789500850317["HU-05: Ranking de estadísticas de máximos goleadores y asistidores"]
    REQ_1789501414613["RF-01: Sección de estadísticas de máximos goleadores y asistidores"]
  end
  subgraph US_1789501889436["RO-01: Dockerizar la aplicación (Dockerfile y docker-compose)"]
    REQ_1789501889447["RF-01: Dockerizar la aplicación (Dockerfile y docker-compose)"]
  end
  REQ_1789501307396 --> REQ_1789501323521
  REQ_1789501323521 --> REQ_1789501339015
  REQ_1789501339015 --> REQ_1789501354292
  REQ_1789501323521 --> REQ_1789501384835
  REQ_1789501384835 --> REQ_1789501399433
  REQ_1789501323521 --> REQ_1789501414613
  REQ_1789501307396 --> REQ_1789501889447
```