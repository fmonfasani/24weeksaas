# Propuesta: Adjuntos y Archivos (MinIO/S3)

## 1. 🎯 Objetivo

Subir imágenes, PDFs al workspace. Descargar con seguridad.

## 2. 💡 Solución Técnica

### Object Storage Desacoplado

- Local: MinIO. Prod: S3.
- Backend **NUNCA** recibe binarios. Solo metadata.

### Flujo Seguro (Pre-signed URLs)

1. Frontend `POST /files/upload-url` (pide permiso)
2. `files-service` valida y retorna URL firmada de S3 (PUT)
3. Frontend sube directo a S3
4. Frontend `POST /files/confirm` (guarda metadata en DB)

### Seguridad

- URLs expiran en 5 minutos.
- Validar `content-type` real.
- Billing valida cuota de almacenamiento.

## 3. 🛡️ Validación

Reiniciar Kubernetes → Archivos siguen accesibles (persistencia correcta).
