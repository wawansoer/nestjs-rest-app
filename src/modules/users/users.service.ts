import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import axios from 'axios';
import { RabbitMQService } from '../../config/rabbitmq.config';
import { User, UserDocument } from '../../schemas/user.schema';
const API_URL = 'https://email-service.digitalenvision.com.au/send-email';
@Injectable()
export class UsersService {
    private readonly logger = new Logger(UsersService.name)
    constructor(
        @InjectModel('User') private userModel: Model<UserDocument>,
        private readonly rabbitMQService: RabbitMQService,

    ) { }

    async create(user: User): Promise<User> {
        const newUser = new this.userModel(user);
        await newUser.save();
        this.sendDummyEmail(user.email);
        this.sendRabbitEvent(user);
        return newUser;
    }

    private sendDummyEmail(email: string) {
        axios
            .post(API_URL,
                {
                    email: email,
                    subject: 'Succesfully Registered',
                    message: 'Succesfully Registered',
                })
            .then((response) => {
                if (response.data.status === 'sent') {
                    this.logger.log(`Succes sent email to ${email}`)
                    return true
                }
            })
            .catch((error) => {
                // If there's an error in the request or the server responds with an error status code
                this.logger.error('Error sent email data:', error);
                return false
            });
    }

    private sendRabbitEvent(user: any) {
        const dummyEventData = { eventType: 'user_created', userId: user._id, userName: user.name };
        this.rabbitMQService.sendEvent(dummyEventData);
    }

}

