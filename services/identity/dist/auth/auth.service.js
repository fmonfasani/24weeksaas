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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const rabbitmq_service_1 = require("../rabbitmq/rabbitmq.service");
let AuthService = class AuthService {
    constructor(usersService, rabbitMQService) {
        this.usersService = usersService;
        this.rabbitMQService = rabbitMQService;
    }
    async validateKeycloakUser(payload) {
        const { sub: keycloakId, email, name } = payload;
        let user = await this.usersService.findByKeycloakId(keycloakId);
        if (!user) {
            user = await this.usersService.create({
                keycloakId,
                email,
                name,
            });
            await this.rabbitMQService.publish("user.registered", {
                userId: user.id,
                email: user.email,
                keycloakId: user.keycloakId,
                timestamp: new Date().toISOString(),
            });
            console.log("🎉 UserRegistered event published:", {
                userId: user.id,
                email,
            });
        }
        return user;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        rabbitmq_service_1.RabbitMQService])
], AuthService);
//# sourceMappingURL=auth.service.js.map