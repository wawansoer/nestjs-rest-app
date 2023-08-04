import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../../schemas/user.schema';

@Controller('api/users')
export class UserController {
    constructor(private readonly usersService: UserService) { }

    @Post()
    async createUser(@Body() user: User): Promise<User> {
        return this.usersService.create(user);
    }

    @Get(':userId')
    async getUser(@Param('userId') userId: number): Promise<User> {
        return this.usersService.findOne(userId);
    }
}
