import { OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
export declare class RabbitMQService implements OnModuleInit, OnModuleDestroy {
    private configService;
    private connection;
    private channel;
    constructor(configService: ConfigService);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    private connect;
    private close;
    publish(routingKey: string, message: any): Promise<void>;
}
