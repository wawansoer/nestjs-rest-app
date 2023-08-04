import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { AvatarService } from './avatar.service';
import { Avatar } from '../../schemas/avatar.schema';

@Controller('api/user/:userId/avatar')
export class AvatarController {
    constructor(private readonly avatarService: AvatarService) { }

    @Get()
    async getAvatar(@Param('userId') userId: number): Promise<string> {
        const avatar = await this.avatarService.getAvatar(userId);
        if (!avatar) {
            return null;
        }
        return avatar.base64Data;
    }

    @Post()
    async saveAvatar(
        @Param('userId') userId: number,
        @Param('hash') hash: string,
        @Body() body: { base64Data: string },
    ): Promise<Avatar> {
        return this.avatarService.saveAvatar(userId, hash, body.base64Data);
    }

    @Delete()
    async deleteAvatar(@Param('userId') userId: number): Promise<Avatar> {
        return this.avatarService.deleteAvatar(userId);
    }
}
