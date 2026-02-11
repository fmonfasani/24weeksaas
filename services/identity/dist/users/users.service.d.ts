import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    findByKeycloakId(keycloakId: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    create(data: {
        keycloakId: string;
        email: string;
        name?: string;
    }): Promise<User>;
    findById(id: string): Promise<User | null>;
}
