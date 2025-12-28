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
}
