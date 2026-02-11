import { Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { RabbitMQService } from "../rabbitmq/rabbitmq.service";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private rabbitMQService: RabbitMQService,
  ) {}

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

      // Emitir evento UserRegistered a RabbitMQ
      await this.rabbitMQService.publish("user.registered", {
        userId: user.id,
        email: user.email,
        keycloakId: user.keycloakId,
        timestamp: new Date().toISOString(),
      });

      console.log("🎉 UserRegistered event published:", {
        userId: user.id,
        email,
      });
    }

    return user;
  }
}
