import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

// Hot reload trigger
const DB_PATH = join(__dirname, '..', 'database.json');

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

interface Database {
  users: User[];
  posts: Post[];
  userIdCounter: number;
  postIdCounter: number;
}

// Initialize or load database
const initDb = (): Database => {
  if (existsSync(DB_PATH)) {
    const data = readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
  }
  return {
    users: [],
    posts: [],
    userIdCounter: 1,
    postIdCounter: 1
  };
};

let db: Database = initDb();

const saveDb = () => {
  writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
};

// Initial save to create file
if (!existsSync(DB_PATH)) {
  saveDb();
}

export const database = {
  // User operations
  findUserByUsername: (username: string): User | undefined => {
    return db.users.find(u => u.username === username);
  },

  findUserById: (id: number): Omit<User, 'password'> | undefined => {
    const user = db.users.find(u => u.id === id);
    if (user) {
      const { password, ...safeUser } = user;
      return safeUser;
    }
    return undefined;
  },

  createUser: (username: string, password: string, nickname?: string): Omit<User, 'password'> => {
    const newUser: User = {
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
    const { password: _, ...safeUser } = newUser;
    return safeUser;
  },

  updateUser: (id: number, updates: Partial<Pick<User, 'nickname' | 'avatar' | 'gender' | 'bio'>>): Omit<User, 'password'> | undefined => {
    const userIndex = db.users.findIndex(u => u.id === id);
    if (userIndex === -1) return undefined;

    const user = db.users[userIndex];
    if (updates.nickname !== undefined) user.nickname = updates.nickname;
    if (updates.avatar !== undefined) user.avatar = updates.avatar;
    if (updates.gender !== undefined) user.gender = updates.gender;
    if (updates.bio !== undefined) user.bio = updates.bio;

    saveDb();
    const { password, ...safeUser } = user;
    return safeUser;
  },

  // Post operations
  getAllPosts: (): Post[] => {
    return db.posts;
  },

  createPost: (post: Omit<Post, 'id' | 'created_at'>): Post => {
    const newPost: Post = {
      ...post,
      id: db.postIdCounter++,
      created_at: new Date().toISOString()
    };
    db.posts.push(newPost);
    saveDb();
    return newPost;
  }
};
