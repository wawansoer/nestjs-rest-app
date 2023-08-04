import { Injectable } from '@nestjs/common';
import axios from 'axios';

/**
 * This class is responsible for retrieving user data from an external API.
 * It uses the axios library to make HTTP requests to the API and returns the response data.
 */
@Injectable()
export class UserService {
    /**
     * Retrieves user data by the specified user ID.
     * @param userId The ID of the user to retrieve.
     * @returns The user data.
     */
    async getUserById(userId: number) {
        const response = await axios.get(`https://reqres.in/api/users/${userId}`);
        return response.data;
    }
}
