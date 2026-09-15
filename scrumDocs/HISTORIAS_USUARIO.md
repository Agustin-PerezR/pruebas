# Historias de Usuario -- prueba

_Generado automaticamente el 2026-09-15T19:46:44.955Z -- no editar a mano, se sobreescribe en cada publicacion._

## HU-01: Generación y simulación de datos de liga (10 equipos y jugadores)

Como usuario aficionado al fútbol, quiero que el sistema genere automáticamente una liga de 10 equipos con jugadores y partidos aleatorios, para disponer de datos de temporada completos sin necesidad de ingreso manual ni autenticación.

### Criterios de Aceptacion

- Se generan automáticamente 10 equipos con nombres de fantasía o representativos.
- Cada equipo cuenta con su plantel de jugadores generados aleatoriamente.
- Se simulan los partidos y resultados de la temporada.
- La aplicación no requiere inicio de sesión ni registro de usuarios.

## HU-02: Visualización de tabla de posiciones con diferenciación por colores

Como aficionado al fútbol, quiero ver la tabla de posiciones organizada de los 10 equipos con zonas diferenciadas por colores, para identificar rápidamente al puntero, los clasificados a copas internacionales y los equipos en zona de descenso.

### Criterios de Aceptacion

- Muestra la tabla de posiciones con: Posición, Equipo, PJ, PG, PE, PP, GF, GC, DG y Puntos.
- Resalta en color verde al primer puesto (líder/campeón).
- Resalta en color naranja a los equipos que clasifican a copas internacionales.
- Resalta en color rojo a los equipos que pierden la categoría (descenso).
- Diseño intuitivo y responsive para diferentes resoluciones y dispositivos.

## HU-03: Consulta de resultados y partidos de la temporada

Como aficionado al fútbol, quiero ver el listado de resultados de los partidos disputados a lo largo de la temporada, para seguir el rendimiento de los equipos.

### Criterios de Aceptacion

- Presenta el listado o fixture de partidos disputados con sus respectivos resultados y marcadores finales.
- Permite consultar los resultados de cada equipo a lo largo del torneo.

## HU-04: Detalle de partido con eventos de goles y sustituciones

Como aficionado al fútbol, quiero ingresar al detalle de un partido específico, para conocer las incidencias clave ocurridas durante el encuentro como autores de goles y cambios realizados.

### Criterios de Aceptacion

- Al hacer clic o seleccionar un partido, se accede a una vista o modal de detalle.
- Despliega la lista de goles anotados indicando jugador y minuto de juego.
- Despliega la lista de sustituciones/cambios indicando jugador saliente, jugador entrante y minuto.

## HU-05: Ranking de estadísticas de máximos goleadores y asistidores

Como aficionado al fútbol, quiero contar con un apartado de estadísticas de jugadores, para consultar quiénes son los máximos goleadores y los mejores asistidores de la liga.

### Criterios de Aceptacion

- Sección dedicada a estadísticas individuales del torneo.
- Tabla/ranking de máximos goleadores ordenados de mayor a menor cantidad de goles.
- Tabla/ranking de máximos asistidores ordenados de mayor a menor cantidad de asistencias.
