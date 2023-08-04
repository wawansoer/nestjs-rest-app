import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class UserService {
    async getUserById(userId: number) {
        const response = await axios.get(`https://reqres.in/api/users/${userId}`);
        return response.data;
    }
}
