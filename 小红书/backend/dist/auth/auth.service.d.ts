import { User } from '../database';
export declare class AuthService {
    register(username: string, password: string, nickname?: string): Omit<User, 'password'>;
    login(username: string, password: string): Omit<User, 'password'>;
    findById(id: number): Omit<User, 'password'> | undefined;
    updateProfile(userId: number, updates: Partial<Pick<User, 'nickname' | 'avatar' | 'gender' | 'bio'>>): Omit<User, 'password'> | undefined;
}
