export interface PostModel {
    id: number;
    title: string;
    type: 'image' | 'video';
    url: string;
    cover_url?: string;
    author: string;
}
export declare class PostsService {
    create(post: {
        title: string;
        type: 'image' | 'video';
        url: string;
        cover_url?: string;
        author_id?: number;
        description?: string;
    }): import("../database").Post;
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
    getCommentsByPostId(postId: number): {
        id: number;
        post_id: number;
        user_id: number;
        content: string;
        created_at: string;
        user: Omit<import("../database").User, "password">;
    }[];
    createComment(postId: number, userId: number, content: string): {
        user: Omit<import("../database").User, "password">;
        id: number;
        post_id: number;
        user_id: number;
        content: string;
        created_at: string;
    };
    deleteComment(commentId: number, userId: number): boolean;
    likePost(postId: number, userId: number): boolean;
    unlikePost(postId: number, userId: number): boolean;
    isLikedByUser(postId: number, userId: number): boolean;
    getLikeCount(postId: number): number;
    collectPost(postId: number, userId: number): boolean;
    uncollectPost(postId: number, userId: number): boolean;
    isCollectedByUser(postId: number, userId: number): boolean;
    getCollectionCount(postId: number): number;
    getCollectionsByUserId(userId: number): {
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
