import { UsersService } from "../users/users.service";
import { RabbitMQService } from "../rabbitmq/rabbitmq.service";
export declare class AuthService {
    private usersService;
    private rabbitMQService;
    constructor(usersService: UsersService, rabbitMQService: RabbitMQService);
    validateKeycloakUser(payload: any): Promise<import("../users/entities/user.entity").User>;
}
