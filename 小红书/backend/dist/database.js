"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.database = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const DB_PATH = (0, path_1.join)(__dirname, '..', 'database.json');
const initDb = () => {
    if ((0, fs_1.existsSync)(DB_PATH)) {
        const data = (0, fs_1.readFileSync)(DB_PATH, 'utf-8');
        const parsed = JSON.parse(data);
        return {
            users: parsed.users || [],
            posts: parsed.posts || [],
            comments: parsed.comments || [],
            likes: parsed.likes || [],
            collections: parsed.collections || [],
            userIdCounter: parsed.userIdCounter || 1,
            postIdCounter: parsed.postIdCounter || 1,
            commentIdCounter: parsed.commentIdCounter || 1,
            likeIdCounter: parsed.likeIdCounter || 1,
            collectionIdCounter: parsed.collectionIdCounter || 1
        };
    }
    return {
        users: [],
        posts: [],
        comments: [],
        likes: [],
        collections: [],
        userIdCounter: 1,
        postIdCounter: 1,
        commentIdCounter: 1,
        likeIdCounter: 1,
        collectionIdCounter: 1
    };
};
let db = initDb();
const saveDb = () => {
    (0, fs_1.writeFileSync)(DB_PATH, JSON.stringify(db, null, 2));
};
if (!(0, fs_1.existsSync)(DB_PATH)) {
    saveDb();
}
exports.database = {
    findUserByUsername: (username) => {
        return db.users.find(u => u.username === username);
    },
    findUserById: (id) => {
        const user = db.users.find(u => u.id === id);
        if (user) {
            const { password } = user, safeUser = __rest(user, ["password"]);
            return safeUser;
        }
        return undefined;
    },
    createUser: (username, password, nickname) => {
        const newUser = {
            id: db.userIdCounter++,
            username,
            password,
            nickname: nickname || username,
            avatar: `https://i.pravatar.cc/150?u=${username}`,
            gender: '保密',
            created_at: new Date().toISOString()
        };
        db.users.push(newUser);
        saveDb();
        const { password: _ } = newUser, safeUser = __rest(newUser, ["password"]);
        return safeUser;
    },
    updateUser: (id, updates) => {
        const userIndex = db.users.findIndex(u => u.id === id);
        if (userIndex === -1)
            return undefined;
        const user = db.users[userIndex];
        if (updates.nickname !== undefined)
            user.nickname = updates.nickname;
        if (updates.avatar !== undefined)
            user.avatar = updates.avatar;
        if (updates.gender !== undefined)
            user.gender = updates.gender;
        if (updates.bio !== undefined)
            user.bio = updates.bio;
        saveDb();
        const { password } = user, safeUser = __rest(user, ["password"]);
        return safeUser;
    },
    getAllPosts: () => {
        return db.posts;
    },
    createPost: (post) => {
        const newPost = Object.assign(Object.assign({}, post), { id: db.postIdCounter++, created_at: new Date().toISOString() });
        db.posts.push(newPost);
        saveDb();
        return newPost;
    },
    getCommentsByPostId: (postId) => {
        return db.comments
            .filter(c => c.post_id === postId)
            .map(c => {
            const user = exports.database.findUserById(c.user_id);
            return {
                id: c.id,
                post_id: c.post_id,
                user_id: c.user_id,
                content: c.content,
                created_at: c.created_at,
                user: user
            };
        })
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    },
    createComment: (postId, userId, content) => {
        const newComment = {
            id: db.commentIdCounter++,
            post_id: postId,
            user_id: userId,
            content,
            created_at: new Date().toISOString()
        };
        db.comments.push(newComment);
        saveDb();
        const user = exports.database.findUserById(userId);
        return Object.assign(Object.assign({}, newComment), { user });
    },
    deleteComment: (commentId, userId) => {
        const commentIndex = db.comments.findIndex(c => c.id === commentId && c.user_id === userId);
        if (commentIndex === -1)
            return false;
        db.comments.splice(commentIndex, 1);
        saveDb();
        return true;
    },
    getLikesByPostId: (postId) => {
        return db.likes.filter(l => l.post_id === postId);
    },
    isLikedByUser: (postId, userId) => {
        return db.likes.some(l => l.post_id === postId && l.user_id === userId);
    },
    likePost: (postId, userId) => {
        if (exports.database.isLikedByUser(postId, userId))
            return false;
        const newLike = {
            id: db.likeIdCounter++,
            post_id: postId,
            user_id: userId,
            created_at: new Date().toISOString()
        };
        db.likes.push(newLike);
        saveDb();
        return true;
    },
    unlikePost: (postId, userId) => {
        const likeIndex = db.likes.findIndex(l => l.post_id === postId && l.user_id === userId);
        if (likeIndex === -1)
            return false;
        db.likes.splice(likeIndex, 1);
        saveDb();
        return true;
    },
    getLikeCount: (postId) => {
        return db.likes.filter(l => l.post_id === postId).length;
    },
    getCollectionsByUserId: (userId) => {
        return db.collections
            .filter(c => c.user_id === userId)
            .map(c => {
            const post = db.posts.find(p => p.id === c.post_id);
            if (!post)
                return null;
            const author = exports.database.findUserById(post.author_id);
            return {
                id: c.id,
                post_id: c.post_id,
                created_at: c.created_at,
                post: Object.assign(Object.assign({}, post), { author: (author === null || author === void 0 ? void 0 : author.nickname) || 'Anonymous', author_avatar: (author === null || author === void 0 ? void 0 : author.avatar) || 'https://i.pravatar.cc/150?u=anonymous' })
            };
        })
            .filter(c => c !== null);
    },
    isCollectedByUser: (postId, userId) => {
        return db.collections.some(c => c.post_id === postId && c.user_id === userId);
    },
    collectPost: (postId, userId) => {
        if (exports.database.isCollectedByUser(postId, userId))
            return false;
        const newCollection = {
            id: db.collectionIdCounter++,
            post_id: postId,
            user_id: userId,
            created_at: new Date().toISOString()
        };
        db.collections.push(newCollection);
        saveDb();
        return true;
    },
    uncollectPost: (postId, userId) => {
        const collectionIndex = db.collections.findIndex(c => c.post_id === postId && c.user_id === userId);
        if (collectionIndex === -1)
            return false;
        db.collections.splice(collectionIndex, 1);
        saveDb();
        return true;
    },
    getCollectionCount: (postId) => {
        return db.collections.filter(c => c.post_id === postId).length;
    }
};
//# sourceMappingURL=database.js.map