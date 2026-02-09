# Propuesta: CI/CD + GitOps

## 🎯 Objetivo

merge a develop → deploy en dev | merge a main → deploy en producción

## 💡 Flujo

1. Push código → CI (tests, build docker, push registry)
2. CI actualiza values.yaml en repo infra
3. ArgoCD detecta cambio → sincroniza cluster
4. Rollback = seleccionar versión anterior en ArgoCD
