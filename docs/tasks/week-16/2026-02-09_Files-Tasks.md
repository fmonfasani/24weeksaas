# Plan: Archivos

**Estado**: Planificado

## ✅ Tareas

### Storage (Dev 1)

- [ ] Configurar MinIO/S3 buckets + políticas
- [ ] Lifecycle rules (borrado no inmmadiato)

### Files Service (Dev 2)

- [ ] Generación Pre-signed URLs (boto3 / sdk)
- [ ] Metadata de archivos en DB
- [ ] Integración con Billing (tamaño max)

### Integraciones (Dev 3)

- [ ] Audit logs de subida/descarga
- [ ] Permissions (UPLOAD_FILE)

### Frontend (Dev 4)

- [ ] Drag & drop zona
- [ ] Progress bar real
- [ ] Previews de imágenes

## 🏁 DoD

1. ✅ Backend no procesa bytes
2. ✅ Archivos privados por defecto
