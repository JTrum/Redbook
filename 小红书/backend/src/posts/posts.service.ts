import { Injectable } from '@nestjs/common';
import { database } from '../database';

export interface PostModel {
    id: number;
    title: string;
    type: 'image' | 'video';
    url: string;
    cover_url?: string;
    author: string;
}

@Injectable()
export class PostsService {

    create(post: { title: string; type: 'image' | 'video'; url: string; cover_url?: string; author_id?: number; description?: string }) {
        return database.createPost({
            title: post.title,
            type: post.type,
            url: post.url,
            cover_url: post.cover_url,
            description: post.description,
            author_id: post.author_id || 0
        });
    }

    findAll() {
        const posts = database.getAllPosts();
        // Transform to include author name and avatar
        return posts.map(p => {
            const author = database.findUserById(p.author_id);
            return {
                id: p.id,
                title: p.title,
                type: p.type,
                url: p.url,
                cover_url: p.cover_url,
                description: p.description,
                created_at: p.created_at,
                author: author?.nickname || 'Anonymous',
                author_avatar: author?.avatar || 'https://i.pravatar.cc/150?u=anonymous'
            };
        });
    }
}

