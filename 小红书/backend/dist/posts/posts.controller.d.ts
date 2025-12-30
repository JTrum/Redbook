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
    getComments(postId: string): {
        id: number;
        post_id: number;
        user_id: number;
        content: string;
        created_at: string;
        user: Omit<import("../database").User, "password">;
    }[];
    createComment(postId: string, body: {
        userId: number;
        content: string;
    }): {
        user: Omit<import("../database").User, "password">;
        id: number;
        post_id: number;
        user_id: number;
        content: string;
        created_at: string;
    };
    deleteComment(commentId: string, body: {
        userId: number;
    }): boolean;
    likePost(postId: string, body: {
        userId: number;
    }): boolean;
    unlikePost(postId: string, body: {
        userId: number;
    }): boolean;
    getLikeStatus(postId: string, userId: string): {
        liked: boolean;
        likeCount: number;
    };
    collectPost(postId: string, body: {
        userId: number;
    }): boolean;
    uncollectPost(postId: string, body: {
        userId: number;
    }): boolean;
    getCollectStatus(postId: string, userId: string): {
        collected: boolean;
        collectionCount: number;
    };
    getUserCollections(userId: string): {
        id: number;
        post_id: number;
        created_at: string;
        post: {
            author: string;
            author_avatar: string;
            id: number;
            title: string;
            type: "image" | "video";
            url: string;
            cover_url?: string;
            description?: string;
            author_id: number;
            created_at: string;
        };
    }[];
}
