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
export declare const database: {
    findUserByUsername: (username: string) => User | undefined;
    findUserById: (id: number) => Omit<User, "password"> | undefined;
    createUser: (username: string, password: string, nickname?: string) => Omit<User, "password">;
    updateUser: (id: number, updates: Partial<Pick<User, "nickname" | "avatar" | "gender" | "bio">>) => Omit<User, "password"> | undefined;
    getAllPosts: () => Post[];
    createPost: (post: Omit<Post, "id" | "created_at">) => Post;
};
