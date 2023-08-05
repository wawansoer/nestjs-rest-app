import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from './users.service';
import { User } from '../../schemas/user.schema';

/**
 * This code snippet represents a controller class for handling user-related HTTP requests.
 * It provides a method to create a new user by receiving user data through an HTTP POST request.
 * The user data is then passed to the 'create' method of the 'UsersService' class, which saves the user data to the database,
 * sends a dummy email to the user's email address, and sends a RabbitMQ event.
 */

@Controller('api/users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    /**
     * Create a new user.
     * @param user The user data.
     * @returns The response object.
     */
    @Post()
    async createUser(
        @Body() user: User,
        @Res() res: Response,
    ) {
        try {
            const createdUser = await this.usersService.create(user);
            return res.status(200).json({
                status: 'success',
                message: 'User created successfully',
                data: createdUser,
            });

        } catch (error) {
            return res.status(401).json({
                status: 'failed',
                message: 'Failed add user!',
                data: error
            });
        }
    }
}