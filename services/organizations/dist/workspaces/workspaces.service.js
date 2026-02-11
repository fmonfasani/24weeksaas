"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspacesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const workspace_entity_1 = require("./entities/workspace.entity");
const membership_entity_1 = require("./entities/membership.entity");
let WorkspacesService = class WorkspacesService {
    workspacesRepository;
    membershipsRepository;
    constructor(workspacesRepository, membershipsRepository) {
        this.workspacesRepository = workspacesRepository;
        this.membershipsRepository = membershipsRepository;
    }
    async create(userId, name, slug) {
        const workspace = this.workspacesRepository.create({
            name,
            slug,
        });
        const savedWorkspace = await this.workspacesRepository.save(workspace);
        const membership = this.membershipsRepository.create({
            userId,
            workspace: savedWorkspace,
            role: membership_entity_1.MembershipRole.OWNER,
        });
        await this.membershipsRepository.save(membership);
        return savedWorkspace;
    }
    async findAllForUser(userId) {
        const memberships = await this.membershipsRepository.find({
            where: { userId },
            relations: ["workspace"],
        });
        return memberships.map((m) => m.workspace);
    }
    async findOne(id) {
        return this.workspacesRepository.findOne({ where: { id } });
    }
};
exports.WorkspacesService = WorkspacesService;
exports.WorkspacesService = WorkspacesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(workspace_entity_1.Workspace)),
    __param(1, (0, typeorm_1.InjectRepository)(membership_entity_1.Membership)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], WorkspacesService);
//# sourceMappingURL=workspaces.service.js.map