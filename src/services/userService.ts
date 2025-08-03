import { Repository } from 'typeorm';
import { User } from '../entity/User';
import { userData } from '../types.ts';
import createHttpError from 'http-errors';
import { Roles } from '../constants';
import bcrypt from 'bcrypt';

export class UserService {
    constructor(private userRepository: Repository<User>) {}

    async create({ firstName, lastName, email, password }: userData) {
        const user = await this.userRepository.findOne({
            where: { email: email },
        });
        if (user) {
            const error = createHttpError(400, 'User already exist');
            throw error;
        }
        // Hash the password before saving it
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        try {
            return await this.userRepository.save({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                role: Roles.CUSTOMER, // Assigning a default role
            });
        } catch {
            const error = createHttpError(500, 'Failed to stored in database');
            throw error;
        }
    }

    async findByEmail(email: string) {
        const user = await this.userRepository.findOne({ where: { email } });
        return user;
    }

    async findById(id: number) {
        return await this.userRepository.findOne({ where: { id } });
    }
}
