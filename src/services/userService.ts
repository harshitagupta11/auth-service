import { Repository } from 'typeorm';
import { User } from '../entity/User';
import { userData } from '../types.ts';
import createHttpError from 'http-errors';

export class UserService {
    constructor(private userRepository: Repository<User>) {}

    async create({ firstName, lastName, email, password }: userData) {
        try {
            return await this.userRepository.save({
                firstName,
                lastName,
                email,
                password,
            });
        } catch {
            const error = createHttpError(500, 'Failed to stored in database');
            throw error;
        }
    }
}
