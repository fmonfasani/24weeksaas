# Plan: Invitaciones

**Estado**: Planificado

## ✅ Tareas

### Invitations Service (Dev 1)

- [ ] Modelo `Invitation` (token_hash, email, role, expires)
- [ ] Generación token seguro (JWT o random+firma)

### Email Worker (Dev 2)

- [ ] SMTP local con Mailhog
- [ ] Template HTML básico

### Integraciones (Dev 3)

- [ ] Escuchar `UserRegistered` (Identity)
- [ ] Emitir `MemberAddedToWorkspace` (Organizations)

### Frontend (Dev 4)

- [ ] Pantalla `/invite`
- [ ] Flujo de aceptación + registro o login

## 🏁 DoD

1. ✅ Usuario entra solo al workspace
2. ✅ Tokens caducan
