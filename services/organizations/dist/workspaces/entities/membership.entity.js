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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Membership = exports.MembershipRole = void 0;
const typeorm_1 = require("typeorm");
const workspace_entity_1 = require("./workspace.entity");
var MembershipRole;
(function (MembershipRole) {
    MembershipRole["OWNER"] = "owner";
    MembershipRole["ADMIN"] = "admin";
    MembershipRole["MEMBER"] = "member";
})(MembershipRole || (exports.MembershipRole = MembershipRole = {}));
let Membership = class Membership {
    id;
    userId;
    workspaceId;
    role;
    createdAt;
    workspace;
};
exports.Membership = Membership;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Membership.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "user_id" }),
    __metadata("design:type", String)
], Membership.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "workspace_id" }),
    __metadata("design:type", String)
], Membership.prototype, "workspaceId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: MembershipRole,
        default: MembershipRole.MEMBER,
    }),
    __metadata("design:type", String)
], Membership.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at" }),
    __metadata("design:type", Date)
], Membership.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => workspace_entity_1.Workspace, (workspace) => workspace.memberships),
    (0, typeorm_1.JoinColumn)({ name: "workspace_id" }),
    __metadata("design:type", workspace_entity_1.Workspace)
], Membership.prototype, "workspace", void 0);
exports.Membership = Membership = __decorate([
    (0, typeorm_1.Entity)("memberships")
], Membership);
//# sourceMappingURL=membership.entity.js.map