import { Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateKeycloakUser(payload: any) {
    // Payload viene del JWT de Keycloak
    const { sub: keycloakId, email, name } = payload;

    // Buscar o crear usuario
    let user = await this.usersService.findByKeycloakId(keycloakId);

    if (!user) {
      // Primer login: crear usuario y emitir evento UserRegistered
      user = await this.usersService.create({
        keycloakId,
        email,
        name,
      });

      // TODO: Emitir evento UserRegistered a RabbitMQ
      console.log("🎉 UserRegistered event:", { userId: user.id, email });
    }

    return user;
  }
}
