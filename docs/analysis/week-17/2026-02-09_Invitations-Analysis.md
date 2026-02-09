# Semana 17: Invitaciones Externas

## Análisis

Usuario aún no existe cuando lo invitan. Token firmado + flow por eventos.

## Propuesta

Invitations Slice. Token hash, expires 48h, un solo uso. Email worker con Mailhog.

## Tareas

- [ ] Invitations service + tokens firmados
- [ ] Email worker + templates
- [ ] Listener UserRegistered → crear membership
