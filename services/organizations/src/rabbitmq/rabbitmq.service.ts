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
    await this.startConsumer();
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

      console.log("✅ RabbitMQ connected (Subscriber)");
    } catch (error) {
      console.error("❌ RabbitMQ connection error:", error);
    }
  }

  private async startConsumer() {
    if (!this.channel) return;

    // Create a queue for this service
    const q = await this.channel.assertQueue("organizations_service_queue", {
      exclusive: false,
      durable: true,
    });

    // Bind queue to exchange
    await this.channel.bindQueue(q.queue, "saas_events", "user.registered");

    // Consume messages
    this.channel.consume(q.queue, (msg) => {
      if (msg) {
        const content = JSON.parse(msg.content.toString());
        console.log("📥 Received Event:", content);
        
        // TODO: Handle the event (e.g. create default workspace?)
        this.handleUserRegistered(content);

        this.channel.ack(msg);
      }
    });
  }

  private async handleUserRegistered(payload: any) {
    console.log("Processing user registration:", payload);
    // Logic to create a default workspace or verify user could go here
  }

  private async close() {
    try {
      if (this.channel) await this.channel.close();
      if (this.connection) await this.connection.close();
    } catch (error) {
      console.error("Error closing RabbitMQ:", error);
    }
  }
}
