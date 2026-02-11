import { WorkspacesService } from "./workspaces.service";
export declare class WorkspacesController {
    private readonly workspacesService;
    constructor(workspacesService: WorkspacesService);
    create(req: any, body: {
        name: string;
        slug?: string;
    }): Promise<import("./entities/workspace.entity").Workspace>;
    findAll(req: any): Promise<import("./entities/workspace.entity").Workspace[]>;
}
