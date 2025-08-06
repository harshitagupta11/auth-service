import { Repository } from 'typeorm';
import { User } from '../entity/User';
import { LimitedUserData, userData } from '../types.ts';
import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';

export class UserService {
    constructor(private userRepository: Repository<User>) {}

    async create({
        firstName,
        lastName,
        email,
        password,
        role,
        tenantId,
    }: userData) {
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
                role, // Assigning a default role
                tenant: tenantId ? { id: tenantId } : undefined,
            });
        } catch {
            const error = createHttpError(500, 'Failed to stored in database');
            throw error;
        }
    }

    async findByEmailWithPassword(email: string) {
        const user = await this.userRepository.findOne({
            where: { email },
            select: [
                'id',
                'firstName',
                'lastName',
                'email',
                'password',
                'role',
            ],
        });
        return user;
    }

    async findById(id: number) {
        return await this.userRepository.findOne({ where: { id } });
    }

    async update(
        userId: number,
        { firstName, lastName, role }: LimitedUserData,
    ) {
        try {
            return await this.userRepository.update(userId, {
                firstName,
                lastName,
                role,
            });
        } catch {
            const error = createHttpError(
                500,
                'Failed to update the user in the database',
            );
            throw error;
        }
    }
    async getAll() {
        return await this.userRepository.find();
    }
    async deleteById(userId: number) {
        return await this.userRepository.delete(userId);
    }
}
