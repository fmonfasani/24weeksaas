"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RabbitMQService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const amqp = __importStar(require("amqplib"));
let RabbitMQService = class RabbitMQService {
    configService;
    connection;
    channel;
    constructor(configService) {
        this.configService = configService;
    }
    async onModuleInit() {
        await this.connect();
        await this.startConsumer();
    }
    async onModuleDestroy() {
        await this.close();
    }
    async connect() {
        try {
            const url = this.configService.get("RABBITMQ_URL");
            this.connection = await amqp.connect(url);
            this.channel = await this.connection.createChannel();
            await this.channel.assertExchange("saas_events", "topic", {
                durable: true,
            });
            console.log("✅ RabbitMQ connected (Subscriber)");
        }
        catch (error) {
            console.error("❌ RabbitMQ connection error:", error);
        }
    }
    async startConsumer() {
        if (!this.channel)
            return;
        const q = await this.channel.assertQueue("organizations_service_queue", {
            exclusive: false,
            durable: true,
        });
        await this.channel.bindQueue(q.queue, "saas_events", "user.registered");
        this.channel.consume(q.queue, (msg) => {
            if (msg) {
                const content = JSON.parse(msg.content.toString());
                console.log("📥 Received Event:", content);
                this.handleUserRegistered(content);
                this.channel.ack(msg);
            }
        });
    }
    async handleUserRegistered(payload) {
        console.log("Processing user registration:", payload);
    }
    async close() {
        try {
            if (this.channel)
                await this.channel.close();
            if (this.connection)
                await this.connection.close();
        }
        catch (error) {
            console.error("Error closing RabbitMQ:", error);
        }
    }
};
exports.RabbitMQService = RabbitMQService;
exports.RabbitMQService = RabbitMQService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], RabbitMQService);
//# sourceMappingURL=rabbitmq.service.js.map