import { Workspace } from "./workspace.entity";
export declare enum MembershipRole {
    OWNER = "owner",
    ADMIN = "admin",
    MEMBER = "member"
}
export declare class Membership {
    id: string;
    userId: string;
    workspaceId: string;
    role: MembershipRole;
    createdAt: Date;
    workspace: Workspace;
}
