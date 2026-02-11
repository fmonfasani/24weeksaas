# Propuesta: Hardening Seguridad

## 1. 🎯 Objetivo

Protección contra ataques reales (XSS, CSRF, Injection, Enumeration).

## 2. 💡 Solución Técnica

### Autenticación Robusta

- Access Token corto (5m) + Refresh rotatorio.
- Logout invalida refresh token.
- Cookies `HttpOnly Secure SameSite`.

### Protección CSRF

- `X-CSRF-Token` en métodos mutantes.
- BFF valida token contra cookie firmada.

### Tenant Isolation Crítica

Validar `workspace_id` en CADA request contra membresía del usuario.
Prevenir IDOR / Horizontal Privilege Escalation.

### Security Headers

- CSP, HSTS, X-Frame-Options, No-Sniff.

## 3. 🛡️ Validación

Intentar cambiar `workspace_id` manualmente en API → 403 Forbidden.
