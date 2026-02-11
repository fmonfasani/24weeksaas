import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Workspace } from "./workspace.entity";

export enum MembershipRole {
  OWNER = "owner",
  ADMIN = "admin",
  MEMBER = "member",
}

@Entity("memberships")
export class Membership {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "user_id" })
  userId: string; // ID del usuario en Identity Service

  @Column({ name: "workspace_id" })
  workspaceId: string;

  @Column({
    type: "enum",
    enum: MembershipRole,
    default: MembershipRole.MEMBER,
  })
  role: MembershipRole;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @ManyToOne(() => Workspace, (workspace) => workspace.memberships)
  @JoinColumn({ name: "workspace_id" })
  workspace: Workspace;
}
