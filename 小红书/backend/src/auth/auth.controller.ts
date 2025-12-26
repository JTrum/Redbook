import { Controller, Post, Put, Body, HttpCode, HttpStatus, NotFoundException } from '@nestjs/common';
import { AuthService } from './auth.service';

class AuthDto {
    username: string;
    password: string;
    nickname?: string;
}

class UpdateProfileDto {
    userId: number;
    nickname?: string;
    avatar?: string;
    gender?: '男' | '女' | '保密';
    bio?: string;
}

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    register(@Body() body: AuthDto) {
        return this.authService.register(body.username, body.password, body.nickname);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    login(@Body() body: AuthDto) {
        return this.authService.login(body.username, body.password);
    }

    @Put('profile')
    updateProfile(@Body() body: UpdateProfileDto) {
        const updated = this.authService.updateProfile(body.userId, {
            nickname: body.nickname,
            avatar: body.avatar,
            gender: body.gender,
            bio: body.bio
        });
        if (!updated) {
            throw new NotFoundException('用户不存在');
        }
        return updated;
    }
}
