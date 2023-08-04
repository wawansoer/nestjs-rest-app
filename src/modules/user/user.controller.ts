import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('api/user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get(':userId')
    async getUser(@Param('userId') userId: number) {
        try {
            const user = await this.userService.getUserById(userId);
            return {
                status: 'success',
                message: 'User found!',
                data: user,
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
