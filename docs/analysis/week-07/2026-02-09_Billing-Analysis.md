# Análisis: Billing, Planes y Límites

## 1. 📊 Descripción del Problema

- **Contexto**: El sistema pasa de "app" a producto SaaS monetizable.
- **Impacto**: **Crítico** - Sin billing el producto no genera ingresos.

## 2. 🕵️ Diagnóstico

Las reglas de negocio globales (límites por plan) NO pueden vivir en cada servicio.
**Solución**: Billing-service como **Policy Authority** del sistema.
