import { UsersService } from "./users.service";
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    getMe(req: any): Promise<{
        userId: string;
        email: string;
        name: string;
        workspaces: any[];
    }>;
}
