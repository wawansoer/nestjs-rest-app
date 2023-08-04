import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../../schemas/user.schema';

@Controller('api/users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post()
    async createUser(@Body() user: User) {
        try {
            const users = await this.usersService.create(user);
            return {
                status: 'success',
                message: 'Success save user',
                data: users,
            };
        } catch (error) {
            return {
                status: 'failed',
                message: 'Failed get user',
                data: error,
            };
        }

    }
}



