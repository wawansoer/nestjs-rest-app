import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as fs from 'fs';
import * as crypto from 'crypto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Avatar } from '../../schemas/avatar.schema';
/**
 * This class is responsible for retrieving user data from an external API and managing user avatars.
 * It uses the axios library to make HTTP requests to the API and returns the response data.
 * The avatars are stored in the file system and their details are stored in MongoDB.
 */

@Injectable()
export class UserService {
    constructor(@InjectModel(Avatar.name) private readonly avatarModel: Model<Avatar>) { }

    /**
     * Retrieves user data by the specified user ID.
     * @param userId The ID of the user to retrieve.
     * @returns The user data.
     */
    async getUserById(userId: number) {
        const response = await axios.get(`https://reqres.in/api/users/${userId}`);

        return response.data;
    }

    /**
     * Retrieves the avatar URL for the specified user ID.
     * If the avatar is already stored in MongoDB, the URL is returned.
     * If the avatar is not stored, it is fetched from an external API, saved to the file system and MongoDB, and the URL is returned.
     * @param userId The ID of the user to retrieve the avatar for.
     * @returns The URL of the user's avatar image.
     */
    async getAvatar(userId: number): Promise<string> {
        const user = await this.avatarModel.findOne({ userId }).exec();
        if (user) {
            const data = `${process.env.BASE_URL}avatars/${user.base64Data}.png`
            return data;
        } else {
            const response = await axios.get(
                `https://reqres.in/img/faces/${userId}-image.jpg`,
                { responseType: 'arraybuffer' },
            );

            const hash = crypto.createHash('sha256').update(response.data).digest('hex');
            const base64Data = hash.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

            // Save the avatar as a plain file
            const path = `public/avatars/${base64Data}.png`;
            fs.writeFileSync(path, response.data);

            // Save the avatar details in MongoDB
            await this.avatarModel.create({ userId, hash, base64Data });
            const data = `${process.env.BASE_URL}avatars/${base64Data}.png`
            return data;
        }
    }

    /**
     * Deletes the avatar for the specified user ID.
     * If the avatar is stored in MongoDB, it is deleted from the file system and MongoDB.
     * @param userId The ID of the user to delete the avatar for.
     */
    async deleteAvatar(userId: number): Promise<void> {
        const user = await this.avatarModel.findOne({ userId }).exec();
        if (user) {
            // Remove the file from the FileSystem storage
            const path = `public/avatars/${user.base64Data}.png`;
            fs.unlinkSync(path);

            // Remove the stored entry from MongoDB
            await this.avatarModel.deleteOne({ userId }).exec();
        }
    }
}