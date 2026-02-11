# Plan: Disaster Recovery

**Estado**: Planificado

## ✅ Tareas

### DB Backups (Dev 1)

- [ ] Configurar pgBackRest/WAL-G
- [ ] Test restore automatizado

### Storage (Dev 2)

- [ ] Versioning S3
- [ ] Script de recuperación de archivos borrados

### Replay (Dev 3)

- [ ] Script de reindexación masiva para Search/Audit

### Documentación (Dev 4)

- [ ] Escribir DISASTER.md
- [ ] Cronograma de simulacros

## 🏁 DoD

1. ✅ Restauración probada en entorno staging
2. ✅ RPO/RTO cumplidos
