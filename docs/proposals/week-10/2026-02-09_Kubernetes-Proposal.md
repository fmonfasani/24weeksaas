# Propuesta: Kubernetes + Helm

## 🎯 Objetivo

Producto existe en dev/staging/prod. Deploy = git push → sistema actualizado.

## 💡 Componentes

- k3d (cluster local), NGINX Ingress, cert-manager
- Helm chart por cada slice
- Health checks: `/health/live`, `/health/ready`
- ConfigMaps, Secrets (no hardcoded)
- PersistentVolumes para DBs
