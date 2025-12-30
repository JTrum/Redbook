import { Controller, Get, Post, UploadedFile, UseInterceptors, Body, Param, Delete, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PostsService } from './posts.service';
import { diskStorage } from 'multer';
import { extname } from 'path';

const storage = diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        cb(null, `${randomName}${extname(file.originalname)}`);
    },
});

@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) { }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file', { storage }))
    uploadFile(@UploadedFile() file: Express.Multer.File) {
        return {
            url: `http://localhost:3000/uploads/${file.filename}`,
        };
    }

    @Post()
    createPost(@Body() body: any) {
        return this.postsService.create(body);
    }

    @Get()
    findAll() {
        return this.postsService.findAll();
    }

    @Get(':postId/comments')
    getComments(@Param('postId') postId: string) {
        return this.postsService.getCommentsByPostId(Number(postId));
    }

    @Post(':postId/comments')
    createComment(@Param('postId') postId: string, @Body() body: { userId: number; content: string; parent_id?: number }) {
        return this.postsService.createComment(Number(postId), body.userId, body.content, body.parent_id);
    }

    @Delete('comments/:commentId')
    deleteComment(@Param('commentId') commentId: string, @Body() body: { userId: number }) {
        return this.postsService.deleteComment(Number(commentId), body.userId);
    }

    @Post(':postId/like')
    likePost(@Param('postId') postId: string, @Body() body: { userId: number }) {
        return this.postsService.likePost(Number(postId), body.userId);
    }

    @Post(':postId/unlike')
    unlikePost(@Param('postId') postId: string, @Body() body: { userId: number }) {
        return this.postsService.unlikePost(Number(postId), body.userId);
    }

    @Get(':postId/like/status')
    getLikeStatus(@Param('postId') postId: string, @Query('userId') userId: string) {
        return {
            liked: this.postsService.isLikedByUser(Number(postId), Number(userId)),
            likeCount: this.postsService.getLikeCount(Number(postId))
        };
    }

    @Post(':postId/collect')
    collectPost(@Param('postId') postId: string, @Body() body: { userId: number }) {
        return this.postsService.collectPost(Number(postId), body.userId);
    }

    @Post(':postId/uncollect')
    uncollectPost(@Param('postId') postId: string, @Body() body: { userId: number }) {
        return this.postsService.uncollectPost(Number(postId), body.userId);
    }

    @Get(':postId/collect/status')
    getCollectStatus(@Param('postId') postId: string, @Query('userId') userId: string) {
        return {
            collected: this.postsService.isCollectedByUser(Number(postId), Number(userId)),
            collectionCount: this.postsService.getCollectionCount(Number(postId))
        };
    }

    @Get('user/:userId/collections')
    getUserCollections(@Param('userId') userId: string) {
        return this.postsService.getCollectionsByUserId(Number(userId));
    }
}
