import { Controller, Post, Put, Body, HttpCode, HttpStatus, NotFoundException, Get, Query, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { database } from '../database';

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

    @Get('following-status')
    checkFollowingStatus(@Query('followerId') followerId: string, @Query('followingId') followingId: string) {
        const follower = parseInt(followerId);
        const following = parseInt(followingId);
        
        if (isNaN(follower) || isNaN(following)) {
            return { success: false, message: '参数错误' };
        }
        
        const isFollowing = database.isFollowing(follower, following);
        return { success: true, isFollowing };
    }

    @Post('follow')
    followUser(@Body() body: { followerId: number; followingId: number }) {
        const { followerId, followingId } = body;
        
        if (followerId === undefined || followingId === undefined) {
            return { success: false, message: '参数错误' };
        }
        
        const success = database.followUser(followerId, followingId);
        return { success, message: success ? '关注成功' : '已关注或参数错误' };
    }

    @Post('unfollow')
    unfollowUser(@Body() body: { followerId: number; followingId: number }) {
        const { followerId, followingId } = body;
        
        if (followerId === undefined || followingId === undefined) {
            return { success: false, message: '参数错误' };
        }
        
        const success = database.unfollowUser(followerId, followingId);
        return { success, message: success ? '取消关注成功' : '未关注或参数错误' };
    }

    @Get('followers/:userId')
    getFollowers(@Param('userId') userId: string) {
        const id = parseInt(userId);
        if (isNaN(id)) {
            return [];
        }
        
        const followers = database.getFollowers(id);
        return followers.map(user => {
            const { password, ...safeUser } = user;
            return safeUser;
        });
    }

    @Get('following/:userId')
    getFollowing(@Param('userId') userId: string) {
        const id = parseInt(userId);
        if (isNaN(id)) {
            return [];
        }
        
        const following = database.getFollowing(id);
        return following.map(user => {
            const { password, ...safeUser } = user;
            return safeUser;
        });
    }

    @Get('following-count/:userId')
    getFollowingCount(@Param('userId') userId: string) {
        const id = parseInt(userId);
        if (isNaN(id)) {
            return { count: 0 };
        }
        
        const count = database.getFollowingCount(id);
        return { count };
    }

    @Get('followers-count/:userId')
    getFollowersCount(@Param('userId') userId: string) {
        const id = parseInt(userId);
        if (isNaN(id)) {
            return { count: 0 };
        }
        
        const count = database.getFollowersCount(id);
        return { count };
    }
};
