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

interface Database {
  users: User[];
  posts: Post[];
  comments: Comment[];
  likes: Like[];
  collections: Collection[];
  userIdCounter: number;
  postIdCounter: number;
  commentIdCounter: number;
  likeIdCounter: number;
  collectionIdCounter: number;
}

// Initialize or load database
const initDb = (): Database => {
  if (existsSync(DB_PATH)) {
    const data = readFileSync(DB_PATH, 'utf-8');
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
  },

  // Comment operations
  getCommentsByPostId: (postId: number) => {
    return db.comments
      .filter(c => c.post_id === postId)
      .map(c => {
        const user = database.findUserById(c.user_id);
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

  createComment: (postId: number, userId: number, content: string) => {
    const newComment: Comment = {
      id: db.commentIdCounter++,
      post_id: postId,
      user_id: userId,
      content,
      created_at: new Date().toISOString()
    };
    db.comments.push(newComment);
    saveDb();
    const user = database.findUserById(userId);
    return {
      ...newComment,
      user
    };
  },

  deleteComment: (commentId: number, userId: number): boolean => {
    const commentIndex = db.comments.findIndex(c => c.id === commentId && c.user_id === userId);
    if (commentIndex === -1) return false;
    db.comments.splice(commentIndex, 1);
    saveDb();
    return true;
  },

  // Like operations
  getLikesByPostId: (postId: number) => {
    return db.likes.filter(l => l.post_id === postId);
  },

  isLikedByUser: (postId: number, userId: number): boolean => {
    return db.likes.some(l => l.post_id === postId && l.user_id === userId);
  },

  likePost: (postId: number, userId: number): boolean => {
    if (database.isLikedByUser(postId, userId)) return false;
    const newLike: Like = {
      id: db.likeIdCounter++,
      post_id: postId,
      user_id: userId,
      created_at: new Date().toISOString()
    };
    db.likes.push(newLike);
    saveDb();
    return true;
  },

  unlikePost: (postId: number, userId: number): boolean => {
    const likeIndex = db.likes.findIndex(l => l.post_id === postId && l.user_id === userId);
    if (likeIndex === -1) return false;
    db.likes.splice(likeIndex, 1);
    saveDb();
    return true;
  },

  getLikeCount: (postId: number): number => {
    return db.likes.filter(l => l.post_id === postId).length;
  },

  // Collection operations
  getCollectionsByUserId: (userId: number) => {
    return db.collections
      .filter(c => c.user_id === userId)
      .map(c => {
        const post = db.posts.find(p => p.id === c.post_id);
        if (!post) return null;
        const author = database.findUserById(post.author_id);
        return {
          id: c.id,
          post_id: c.post_id,
          created_at: c.created_at,
          post: {
            ...post,
            author: author?.nickname || 'Anonymous',
            author_avatar: author?.avatar || 'https://i.pravatar.cc/150?u=anonymous'
          }
        };
      })
      .filter(c => c !== null);
  },

  isCollectedByUser: (postId: number, userId: number): boolean => {
    return db.collections.some(c => c.post_id === postId && c.user_id === userId);
  },

  collectPost: (postId: number, userId: number): boolean => {
    if (database.isCollectedByUser(postId, userId)) return false;
    const newCollection: Collection = {
      id: db.collectionIdCounter++,
      post_id: postId,
      user_id: userId,
      created_at: new Date().toISOString()
    };
    db.collections.push(newCollection);
    saveDb();
    return true;
  },

  uncollectPost: (postId: number, userId: number): boolean => {
    const collectionIndex = db.collections.findIndex(c => c.post_id === postId && c.user_id === userId);
    if (collectionIndex === -1) return false;
    db.collections.splice(collectionIndex, 1);
    saveDb();
    return true;
  },

  getCollectionCount: (postId: number): number => {
    return db.collections.filter(c => c.post_id === postId).length;
  }
};
