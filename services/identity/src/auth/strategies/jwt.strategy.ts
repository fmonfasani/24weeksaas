import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthService } from "../auth.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // En producción, esto debe ser la clave pública de Keycloak
      secretOrKey: process.env.JWT_SECRET || "dev-secret-change-in-production",
    });
  }

  async validate(payload: any) {
    // Validar usuario con Keycloak
    const user = await this.authService.validateKeycloakUser(payload);

    return {
      userId: user.id,
      email: user.email,
      keycloakId: user.keycloakId,
    };
  }
}
