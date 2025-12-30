"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const posts_service_1 = require("./posts.service");
const multer_1 = require("multer");
const path_1 = require("path");
const storage = (0, multer_1.diskStorage)({
    destination: './uploads',
    filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        cb(null, `${randomName}${(0, path_1.extname)(file.originalname)}`);
    },
});
let PostsController = class PostsController {
    constructor(postsService) {
        this.postsService = postsService;
    }
    uploadFile(file) {
        return {
            url: `http://localhost:3000/uploads/${file.filename}`,
        };
    }
    createPost(body) {
        return this.postsService.create(body);
    }
    findAll() {
        return this.postsService.findAll();
    }
    getComments(postId) {
        return this.postsService.getCommentsByPostId(Number(postId));
    }
    createComment(postId, body) {
        return this.postsService.createComment(Number(postId), body.userId, body.content);
    }
    deleteComment(commentId, body) {
        return this.postsService.deleteComment(Number(commentId), body.userId);
    }
    likePost(postId, body) {
        return this.postsService.likePost(Number(postId), body.userId);
    }
    unlikePost(postId, body) {
        return this.postsService.unlikePost(Number(postId), body.userId);
    }
    getLikeStatus(postId, userId) {
        return {
            liked: this.postsService.isLikedByUser(Number(postId), Number(userId)),
            likeCount: this.postsService.getLikeCount(Number(postId))
        };
    }
    collectPost(postId, body) {
        return this.postsService.collectPost(Number(postId), body.userId);
    }
    uncollectPost(postId, body) {
        return this.postsService.uncollectPost(Number(postId), body.userId);
    }
    getCollectStatus(postId, userId) {
        return {
            collected: this.postsService.isCollectedByUser(Number(postId), Number(userId)),
            collectionCount: this.postsService.getCollectionCount(Number(postId))
        };
    }
    getUserCollections(userId) {
        return this.postsService.getCollectionsByUserId(Number(userId));
    }
};
exports.PostsController = PostsController;
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', { storage })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PostsController.prototype, "uploadFile", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PostsController.prototype, "createPost", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PostsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':postId/comments'),
    __param(0, (0, common_1.Param)('postId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PostsController.prototype, "getComments", null);
__decorate([
    (0, common_1.Post)(':postId/comments'),
    __param(0, (0, common_1.Param)('postId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PostsController.prototype, "createComment", null);
__decorate([
    (0, common_1.Delete)('comments/:commentId'),
    __param(0, (0, common_1.Param)('commentId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PostsController.prototype, "deleteComment", null);
__decorate([
    (0, common_1.Post)(':postId/like'),
    __param(0, (0, common_1.Param)('postId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PostsController.prototype, "likePost", null);
__decorate([
    (0, common_1.Post)(':postId/unlike'),
    __param(0, (0, common_1.Param)('postId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PostsController.prototype, "unlikePost", null);
__decorate([
    (0, common_1.Get)(':postId/like/status'),
    __param(0, (0, common_1.Param)('postId')),
    __param(1, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], PostsController.prototype, "getLikeStatus", null);
__decorate([
    (0, common_1.Post)(':postId/collect'),
    __param(0, (0, common_1.Param)('postId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PostsController.prototype, "collectPost", null);
__decorate([
    (0, common_1.Post)(':postId/uncollect'),
    __param(0, (0, common_1.Param)('postId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PostsController.prototype, "uncollectPost", null);
__decorate([
    (0, common_1.Get)(':postId/collect/status'),
    __param(0, (0, common_1.Param)('postId')),
    __param(1, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], PostsController.prototype, "getCollectStatus", null);
__decorate([
    (0, common_1.Get)('user/:userId/collections'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PostsController.prototype, "getUserCollections", null);
exports.PostsController = PostsController = __decorate([
    (0, common_1.Controller)('posts'),
    __metadata("design:paramtypes", [posts_service_1.PostsService])
], PostsController);
//# sourceMappingURL=posts.controller.js.map