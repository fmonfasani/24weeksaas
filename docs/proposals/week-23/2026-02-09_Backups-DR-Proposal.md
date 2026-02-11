# Propuesta: Backups y Disaster Recovery

## 1. 🎯 Objetivo

Recuperar sistema ante pérdida total (RPO ≤ 5 min, RTO ≤ 30 min).

## 2. 💡 Estrategia

### DBs

- **PostgreSQL**: WAL Archiving continuo a S3 (pgBackRest).
- **Point-in-Time Recovery**: Restaurar a minuto exacto.

### Storage

- Buckets con Versioning activado.
- Lifecycle policies.

### Stateless

- **Search**: No backup. Reconstruir desde eventos (Replay).
- **Redis**: Snapshot RDB (opcional).

### Runbook

Documento `DISASTER.md` con pasos probados.

## 3. 🛡️ Validación

Borrar DB prod simulada → Restaurar a 5 mins antes → Datos vuelven.
