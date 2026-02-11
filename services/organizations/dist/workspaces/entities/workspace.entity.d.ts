import { Membership } from "./membership.entity";
export declare class Workspace {
    id: string;
    name: string;
    slug: string;
    createdAt: Date;
    updatedAt: Date;
    memberships: Membership[];
}
