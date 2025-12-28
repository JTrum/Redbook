import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { database, User } from '../database';

@Injectable()
export class AuthService {

    register(username: string, password: string, nickname?: string): Omit<User, 'password'> {
        // Check if user already exists
        const existing = database.findUserByUsername(username);
        if (existing) {
            throw new ConflictException('用户名已存在');
        }

        // Create new user
        return database.createUser(username, password, nickname);
    }

    login(username: string, password: string): Omit<User, 'password'> {
        const user = database.findUserByUsername(username);

        if (!user || user.password !== password) {
            throw new UnauthorizedException('用户名或密码错误');
        }

        // Don't return password
        const { password: _, ...safeUser } = user;
        return safeUser;
    }

    findById(id: number): Omit<User, 'password'> | undefined {
        return database.findUserById(id);
    }

    updateProfile(userId: number, updates: Partial<Pick<User, 'nickname' | 'avatar' | 'gender' | 'bio'>>): Omit<User, 'password'> | undefined {
        return database.updateUser(userId, updates);
    }
}
