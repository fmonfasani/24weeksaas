# Semana 21: Migraciones sin Downtime

## Análisis

Nuevo código + DB vieja = incompatibilidad. Cada deploy puede romper clientes.

## Propuesta

Expand & Contract + API versioning. Nunca cambios destructivos directos.

## Tareas

- [ ] Migraciones expand → backfill → contract
- [ ] API versioning v1/v2 en BFFs
- [ ] Eventos versionados, consumers tolerantes
- [ ] Feature flags por workspace
