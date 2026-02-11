import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Workspace } from "./entities/workspace.entity";
import { Membership, MembershipRole } from "./entities/membership.entity";

@Injectable()
export class WorkspacesService {
  constructor(
    @InjectRepository(Workspace)
    private workspacesRepository: Repository<Workspace>,
    @InjectRepository(Membership)
    private membershipsRepository: Repository<Membership>,
  ) {}

  async create(userId: string, name: string, slug?: string): Promise<Workspace> {
    const workspace = this.workspacesRepository.create({
      name,
      slug,
    });
    const savedWorkspace = await this.workspacesRepository.save(workspace);

    // Create membership for creator as OWNER
    const membership = this.membershipsRepository.create({
      userId,
      workspace: savedWorkspace,
      role: MembershipRole.OWNER,
    });
    await this.membershipsRepository.save(membership);

    return savedWorkspace;
  }

  async findAllForUser(userId: string): Promise<Workspace[]> {
    const memberships = await this.membershipsRepository.find({
      where: { userId },
      relations: ["workspace"],
    });
    return memberships.map((m) => m.workspace);
  }

  async findOne(id: string): Promise<Workspace | null> {
    return this.workspacesRepository.findOne({ where: { id } });
  }
}
