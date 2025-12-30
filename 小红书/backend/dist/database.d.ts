export interface User {
    id: number;
    username: string;
    password: string;
    nickname: string;
    avatar: string;
    gender: '男' | '女' | '保密';
    bio?: string;
    created_at: string;
}
export interface Post {
    id: number;
    title: string;
    type: 'image' | 'video';
    url: string;
    cover_url?: string;
    description?: string;
    author_id: number;
    created_at: string;
}
export interface Comment {
    id: number;
    post_id: number;
    user_id: number;
    content: string;
    created_at: string;
}
export interface Like {
    id: number;
    post_id: number;
    user_id: number;
    created_at: string;
}
export interface Collection {
    id: number;
    post_id: number;
    user_id: number;
    created_at: string;
}
export declare const database: {
    findUserByUsername: (username: string) => User | undefined;
    findUserById: (id: number) => Omit<User, "password"> | undefined;
    createUser: (username: string, password: string, nickname?: string) => Omit<User, "password">;
    updateUser: (id: number, updates: Partial<Pick<User, "nickname" | "avatar" | "gender" | "bio">>) => Omit<User, "password"> | undefined;
    getAllPosts: () => Post[];
    createPost: (post: Omit<Post, "id" | "created_at">) => Post;
    getCommentsByPostId: (postId: number) => {
        id: number;
        post_id: number;
        user_id: number;
        content: string;
        created_at: string;
        user: Omit<User, "password">;
    }[];
    createComment: (postId: number, userId: number, content: string) => {
        user: Omit<User, "password">;
        id: number;
        post_id: number;
        user_id: number;
        content: string;
        created_at: string;
    };
    deleteComment: (commentId: number, userId: number) => boolean;
    getLikesByPostId: (postId: number) => Like[];
    isLikedByUser: (postId: number, userId: number) => boolean;
    likePost: (postId: number, userId: number) => boolean;
    unlikePost: (postId: number, userId: number) => boolean;
    getLikeCount: (postId: number) => number;
    getCollectionsByUserId: (userId: number) => {
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
    isCollectedByUser: (postId: number, userId: number) => boolean;
    collectPost: (postId: number, userId: number) => boolean;
    uncollectPost: (postId: number, userId: number) => boolean;
    getCollectionCount: (postId: number) => number;
};
