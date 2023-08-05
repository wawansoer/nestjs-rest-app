/**
 * Controller for handling user-related HTTP requests.
 */
import { Controller, Delete, Get, Param, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { Response } from 'express';

@Controller('api/user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    /**
     * Retrieves user data by userId.
     * @param userId - The id of the user.
     * @param res - The response object.
     * @returns The user data or an error message.
     */
    @Get(':userId')
    async getUser(
        @Param('userId') userId: number,
        @Res() res: Response,
    ) {
        try {
            const user = await this.userService.getUserById(userId);
            return res.status(200).json({
                status: 'success',
                message: 'User found!',
                data: user
            });
        } catch (error) {
            return res.status(404).json({
                status: 'failed',
                message: 'User not found!',
                data: error
            });
        }
    }

    /**
     * Retrieves the user's avatar by userId.
     * @param userId - The id of the user.
     * @param res - The response object.
     * @returns The user's avatar or an error message.
     */
    @Get(':userId/avatar')
    async getAvatar(
        @Param('userId') userId: number,
        @Res() res: Response,
    ) {
        try {
            const avatarBase64 = await this.userService.getAvatar(userId);

            return res.status(200).json({
                status: 'success',
                message: 'User avatar found!',
                data: { avatar: avatarBase64 }
            });
        } catch (error) {
            console.log(error);
            return res.status(400).json({
                status: 'failed',
                message: 'User avatar not found!',
                data: error
            });
        }
    }

    /**
     * Deletes the user's avatar by userId.
     * @param userId - The id of the user.
     * @param res - The response object.
     * @returns A success message or an error message.
     */
    @Delete(':userId/avatar')
    async deleteAvatar(
        @Param('userId') userId: number,
        @Res() res: Response,
    ) {
        try {
            await this.userService.deleteAvatar(userId);
            return res.status(200).json({
                status: 'success',
                message: 'User avatar deleted successfully!'
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                status: 'error',
                message: 'Failed to delete user avatar.',
                data: error
            });
        }
    }
}