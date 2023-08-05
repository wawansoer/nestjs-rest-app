import { Injectable, Logger } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQService {
  private readonly QUEUE_NAME = 'user_events';
  private readonly logger = new Logger(RabbitMQService.name);
  private channel: amqp.Channel;

  constructor() {
    this.connect();
  }

  private async connect() {
    try {
      const connection = await amqp.connect(
        'amqp://guest:guest@localhost:5672/',
      );
      this.channel = await connection.createChannel();
      await this.channel.assertQueue(this.QUEUE_NAME, { durable: false });
    } catch (error) {
      this.logger.error('Error connecting to RabbitMQ:', error.message);
    }
  }

  async sendEvent(eventData: any) {
    try {
      const message = JSON.stringify(eventData);
      this.channel.sendToQueue(this.QUEUE_NAME, Buffer.from(message));
      this.logger.log(`Sent event to RabbitMQ: ${message}`);
    } catch (error) {
      this.logger.error('Error sending event to RabbitMQ:', error.message);
    }
  }
}
