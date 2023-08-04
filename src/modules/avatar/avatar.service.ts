import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Avatar, AvatarDocument } from '../../schemas/avatar.schema';

@Injectable()
export class AvatarService {
    constructor(@InjectModel('Avatar') private avatarModel: Model<AvatarDocument>) { }

    async saveAvatar(userId: number, hash: string, base64Data: string): Promise<Avatar> {
        const newAvatar = new this.avatarModel({ userId, hash, base64Data });
        return await newAvatar.save();
    }

    async getAvatar(userId: number): Promise<Avatar> {
        return await this.avatarModel.findOne({ userId }).exec();
    }

    async deleteAvatar(userId: number): Promise<Avatar> {
        return await this.avatarModel.findOneAndDelete({ userId }).exec();
    }
}
