# Semana 22: Hardening Seguridad

## Análisis

Keycloak autentica pero sistema expuesto a: enumeration, CSRF, token theft, XSS, malware uploads.

## Propuesta

- Access token 5-10min, refresh rotatorio
- CSRF tokens obligatorios
- CORS solo app.dominio.com
- Validar workspace en TODAS las requests
- Archivos: magic bytes, antivirus, renombre
- Headers: CSP, X-Frame-Options, HSTS
