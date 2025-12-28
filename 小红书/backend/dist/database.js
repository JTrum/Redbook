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
        return JSON.parse(data);
    }
    return {
        users: [],
        posts: [],
        userIdCounter: 1,
        postIdCounter: 1
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
    }
};
//# sourceMappingURL=database.js.map