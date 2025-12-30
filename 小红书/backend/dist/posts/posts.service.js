"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsService = void 0;
const common_1 = require("@nestjs/common");
const database_1 = require("../database");
let PostsService = class PostsService {
    create(post) {
        return database_1.database.createPost({
            title: post.title,
            type: post.type,
            url: post.url,
            cover_url: post.cover_url,
            description: post.description,
            author_id: post.author_id || 0
        });
    }
    findAll() {
        const posts = database_1.database.getAllPosts();
        return posts.map(p => {
            const author = database_1.database.findUserById(p.author_id);
            return {
                id: p.id,
                title: p.title,
                type: p.type,
                url: p.url,
                cover_url: p.cover_url,
                description: p.description,
                created_at: p.created_at,
                author: (author === null || author === void 0 ? void 0 : author.nickname) || 'Anonymous',
                author_avatar: (author === null || author === void 0 ? void 0 : author.avatar) || 'https://i.pravatar.cc/150?u=anonymous'
            };
        });
    }
    getCommentsByPostId(postId) {
        return database_1.database.getCommentsByPostId(postId);
    }
    createComment(postId, userId, content) {
        return database_1.database.createComment(postId, userId, content);
    }
    deleteComment(commentId, userId) {
        return database_1.database.deleteComment(commentId, userId);
    }
    likePost(postId, userId) {
        return database_1.database.likePost(postId, userId);
    }
    unlikePost(postId, userId) {
        return database_1.database.unlikePost(postId, userId);
    }
    isLikedByUser(postId, userId) {
        return database_1.database.isLikedByUser(postId, userId);
    }
    getLikeCount(postId) {
        return database_1.database.getLikeCount(postId);
    }
    collectPost(postId, userId) {
        return database_1.database.collectPost(postId, userId);
    }
    uncollectPost(postId, userId) {
        return database_1.database.uncollectPost(postId, userId);
    }
    isCollectedByUser(postId, userId) {
        return database_1.database.isCollectedByUser(postId, userId);
    }
    getCollectionCount(postId) {
        return database_1.database.getCollectionCount(postId);
    }
    getCollectionsByUserId(userId) {
        return database_1.database.getCollectionsByUserId(userId);
    }
};
exports.PostsService = PostsService;
exports.PostsService = PostsService = __decorate([
    (0, common_1.Injectable)()
], PostsService);
//# sourceMappingURL=posts.service.js.map