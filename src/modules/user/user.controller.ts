import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';

/**
 * Controller for handling user-related HTTP requests.
 */
@Controller('api/user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    /**
     * Retrieves user data by userId.
     * @param userId - The id of the user.
     * @returns The user data or an error message.
     */
    @Get(':userId')
    async getUser(@Param('userId') userId: number) {
        if (isNaN(userId)) {
            return {
                status: 'failed',
                message: 'Invalid userId',
                data: null,
            };
        }
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
                message: 'Failed to get user',
                data: error,
            };
        }
    }
}
