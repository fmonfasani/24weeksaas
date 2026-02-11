# Propuesta: Migraciones sin Downtime

## 1. 🎯 Objetivo

Deployar nueva versión mientras usuarios trabajan, sin errores 500.

## 2. 💡 Solución Técnica

### Expand & Contract

Nunca `ALTER TABLE` destructivo.

1. **Expand**: Agregar columna nueva (nullable).
2. **Compat**: Código escribe en ambas, lee de nueva (o fallback).
3. **Backfill**: Worker migra datos viejos en background.
4. **Contract**: Una vez migrado, borrar columna vieja (semanas después).

### API Versioning

`Accept-Version: v2`. BFF soporta simultáneamente v1 y v2.
Gateway enruta según header.

## 3. 🛡️ Validación

Deployar cambio de schema mientras script crea datos → 0 errores.
