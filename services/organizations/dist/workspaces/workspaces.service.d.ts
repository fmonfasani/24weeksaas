import { Repository } from "typeorm";
import { Workspace } from "./entities/workspace.entity";
import { Membership } from "./entities/membership.entity";
export declare class WorkspacesService {
    private workspacesRepository;
    private membershipsRepository;
    constructor(workspacesRepository: Repository<Workspace>, membershipsRepository: Repository<Membership>);
    create(userId: string, name: string, slug?: string): Promise<Workspace>;
    findAllForUser(userId: string): Promise<Workspace[]>;
    findOne(id: string): Promise<Workspace | null>;
}
