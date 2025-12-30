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
                author_avatar: author?.avatar || 'https://i.pravatar.cc/150?u=anonymous',
                author_id: p.author_id
            };
        });
    }

    getCommentsByPostId(postId: number) {
        return database.getCommentsByPostId(postId);
    }

    createComment(postId: number, userId: number, content: string, parent_id?: number) {
        return database.createComment(postId, userId, content, parent_id);
    }

    deleteComment(commentId: number, userId: number) {
        return database.deleteComment(commentId, userId);
    }

    likePost(postId: number, userId: number) {
        return database.likePost(postId, userId);
    }

    unlikePost(postId: number, userId: number) {
        return database.unlikePost(postId, userId);
    }

    isLikedByUser(postId: number, userId: number) {
        return database.isLikedByUser(postId, userId);
    }

    getLikeCount(postId: number) {
        return database.getLikeCount(postId);
    }

    collectPost(postId: number, userId: number) {
        return database.collectPost(postId, userId);
    }

    uncollectPost(postId: number, userId: number) {
        return database.uncollectPost(postId, userId);
    }

    isCollectedByUser(postId: number, userId: number) {
        return database.isCollectedByUser(postId, userId);
    }

    getCollectionCount(postId: number) {
        return database.getCollectionCount(postId);
    }

    getCollectionsByUserId(userId: number) {
        return database.getCollectionsByUserId(userId);
    }
}

