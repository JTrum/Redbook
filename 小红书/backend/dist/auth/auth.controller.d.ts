import { AuthService } from './auth.service';
declare class AuthDto {
    username: string;
    password: string;
    nickname?: string;
}
declare class UpdateProfileDto {
    userId: number;
    nickname?: string;
    avatar?: string;
    gender?: '男' | '女' | '保密';
    bio?: string;
}
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(body: AuthDto): Omit<import("../database").User, "password">;
    login(body: AuthDto): Omit<import("../database").User, "password">;
    updateProfile(body: UpdateProfileDto): Omit<import("../database").User, "password">;
}
export {};
