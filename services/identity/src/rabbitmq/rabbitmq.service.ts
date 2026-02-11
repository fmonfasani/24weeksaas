import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as amqp from "amqplib";

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
    await this.close();
  }

  private async connect() {
    try {
      const url = this.configService.get<string>("RABBITMQ_URL");
      this.connection = await amqp.connect(url);
      this.channel = await this.connection.createChannel();

      // Assert Exchange
      await this.channel.assertExchange("saas_events", "topic", {
        durable: true,
      });

      console.log("✅ RabbitMQ connected");
    } catch (error) {
      console.error("❌ RabbitMQ connection error:", error);
      // Retry logic could go here
    }
  }

  private async close() {
    try {
      if (this.channel) await this.channel.close();
      if (this.connection) await this.connection.close();
    } catch (error) {
      console.error("Error closing RabbitMQ:", error);
    }
  }

  async publish(routingKey: string, message: any) {
    if (!this.channel) {
      console.error("RabbitMQ channel not active");
      return;
    }

    this.channel.publish(
      "saas_events",
      routingKey,
      Buffer.from(JSON.stringify(message)),
    );
    console.log(`📤 Event published: ${routingKey}`, message);
  }
}
