# Propuesta: Invitaciones Externas

## 1. 🎯 Objetivo

El usuario externo recibe email, crea cuenta y entra directamente a workspace.

## 2. 💡 Solución Técnica

### Invitations Slice

Servicio que coordina acceso inicial. Maneja tokens.
Token NO se guarda plano (hash).

### Flujo

1. **Invitar**: Admin (POST /invitations) → Service crea token firmado → Email Worker envía link.
2. **Link**: `app.domain/invite?token=XYZ` → Frontend valida.
3. **Registro**: Usuario se registra en Identity (Keycloak).
4. **Listener**: Invitations Service escucha `UserRegistered` → Matchea email/token → Dispara `MemberAddedToWorkspace`.

### Seguridad

- Token expira 48h.
- Un solo uso.
- Invalidado al aceptar.

## 3. 🛡️ Validación

Invitar a usuario que YA tiene cuenta → entra directo sin duplicarse.
