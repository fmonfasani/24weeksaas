# Plan de Implementación: Contexto de Tenant y Permisos

**Estado**: Planificado

## ✅ Checklist de Tareas

### 🌐 Gateway + Headers (Dev 1)

- [ ] Configurar propagación de `X-Workspace-Id`
- [ ] Implementar rate limit por workspace
- [ ] Bloquear requests sin header `X-Workspace-Id`
- [ ] Configurar Redis para cache

### 🔐 Identity Service (Dev 2)

- [ ] Crear tabla `memberships` (user_id, workspace_id, role)
- [ ] Implementar cache Redis para membresías
- [ ] Actualizar endpoint `GET /me` con memberships array
- [ ] Eliminar `activeWorkspaceId` del response
- [ ] Validar workspace en cada request

### 🏢 Organizations Service (Dev 3)

- [ ] Implementar membership roles
- [ ] Crear endpoint `GET /workspaces/{id}/members`
- [ ] Emitir evento `UserAddedToWorkspace`
- [ ] Agregar `workspace_id` a todas las tablas
- [ ] Implementar Tenant Middleware

### 💻 Frontend (Dev 4)

- [ ] Implementar workspace switcher en Shell
- [ ] Persistir workspace activo en localStorage
- [ ] Agregar interceptor HTTP con `X-Workspace-Id`
- [ ] Recargar remotes al cambiar workspace
- [ ] Mostrar workspace actual visualmente

### 🧪 Validación (QA)

- [ ] Borrar cookies → reloguear → workspaces recordados
- [ ] Cambiar workspace NO requiere nuevo login
- [ ] Datos completamente aislados entre workspaces
- [ ] Test seguridad: modificar `X-Workspace-Id` → 403

## 🚫 Errores a Evitar

| ❌ Error                            | ✅ Correcto                       |
| ----------------------------------- | --------------------------------- |
| Filtrar por user_id                 | Filtrar por workspace_id          |
| Guardar workspace activo en backend | Frontend decide workspace activo  |
| Confiar en JWT para permisos        | Validar membresía en cada request |
| UI switch sin impacto backend       | Switch recarga todo el contexto   |
| Cachear permisos sin invalidación   | Invalidar cache por eventos       |

## 🏁 Definition of Done (DoD)

1. ✅ Usuario puede pertenecer a múltiples workspaces
2. ✅ Cambiar workspace NO requiere relogin
3. ✅ Datos 100% aislados por workspace
4. ✅ Header `X-Workspace-Id` obligatorio
5. ✅ Manipular header devuelve 403
