"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const database_1 = require("../database");
let AuthService = class AuthService {
    register(username, password, nickname) {
        const existing = database_1.database.findUserByUsername(username);
        if (existing) {
            throw new common_1.ConflictException('用户名已存在');
        }
        return database_1.database.createUser(username, password, nickname);
    }
    login(username, password) {
        const user = database_1.database.findUserByUsername(username);
        if (!user || user.password !== password) {
            throw new common_1.UnauthorizedException('用户名或密码错误');
        }
        const { password: _ } = user, safeUser = __rest(user, ["password"]);
        return safeUser;
    }
    findById(id) {
        return database_1.database.findUserById(id);
    }
    updateProfile(userId, updates) {
        return database_1.database.updateUser(userId, updates);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)()
], AuthService);
//# sourceMappingURL=auth.service.js.map