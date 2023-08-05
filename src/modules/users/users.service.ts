import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import axios from 'axios';
import { RabbitMQService } from '../../config/rabbitmq.config';
import { User, UserDocument } from '../../schemas/user.schema';
const API_URL = 'https://email-service.digitalenvision.com.au/send-email';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectModel('User') private userModel: Model<UserDocument>,
    private readonly rabbitMQService: RabbitMQService,
  ) {}

  /**
   * Creates a new user, saves it to the database, sends a dummy email, and sends a RabbitMQ event.
   * @param user The user object with email, firstName, and lastName properties.
   * @returns The newly created user object.
   */
  async create(user: User): Promise<User> {
    const newUser = new this.userModel(user);
    await newUser.save();
    await this.sendDummyEmail(user.email);
    this.sendRabbitEvent(user);
    return newUser;
  }

  /**
   * Sends a dummy email to the specified email address.
   * @param email The email address to send the email to.
   * @returns A boolean indicating whether the email was successfully sent.
   */
  private async sendDummyEmail(email: string): Promise<boolean> {
    try {
      const response = await axios.post(API_URL, {
        email: email,
        subject: 'Successfully Registered',
        message: 'Successfully Registered',
      });
      if (response.data.status === 'sent') {
        this.logger.log(`Successfully sent email to ${email}`);
        return true;
      }
    } catch (error) {
      this.logger.error('Error sending email:', error);
    }
    return false;
  }

  /**
   * Sends a RabbitMQ event with the user data.
   * @param user The user object.
   */
  private sendRabbitEvent(user: User): void {
    const dummyEventData = {
      eventType: 'user_created',
      useremail: user.email,
    };
    this.rabbitMQService.sendEvent(dummyEventData);
  }
}
