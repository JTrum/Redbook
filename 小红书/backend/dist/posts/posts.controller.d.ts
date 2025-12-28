import { PostsService } from './posts.service';
export declare class PostsController {
    private readonly postsService;
    constructor(postsService: PostsService);
    uploadFile(file: Express.Multer.File): {
        url: string;
    };
    createPost(body: any): import("../database").Post;
    findAll(): {
        id: number;
        title: string;
        type: "image" | "video";
        url: string;
        cover_url: string;
        description: string;
        created_at: string;
        author: string;
        author_avatar: string;
    }[];
}
