import { Controller, Get, Post, UploadedFile, UseInterceptors, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PostsService } from './posts.service';
import { diskStorage } from 'multer';
import { extname } from 'path';

// Configure Multer to save files to './uploads' directory
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
        // This is where "MinIO/OSS" logic would happen by proxy. 
        // Since we use local storage, we just return the local static URL.
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
}
