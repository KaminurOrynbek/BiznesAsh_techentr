import apiClient from "./api";

export interface Post {
  id: string;
  authorId: string;
  content: string;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  updatedAt: string;

  // Optional fields (if backend later starts returning them)
  authorUsername?: string;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostRequest {
  content: string;
}

export interface CreateCommentRequest {
  content: string;
}

const CONTENT_PREFIX = "/content";

/**
 * Normalize API response to Post
 * Backend may return:
 * - { post: {...} }
 * - {...}
 * - snake_case fields
 */
function normalizePost(raw: unknown): Post {
  const obj = (raw ?? {}) as Record<string, unknown>;
  const p = (obj.post ?? obj) as Record<string, unknown>;

  const id = String(p.id ?? "");
  const authorId = String(p.authorId ?? p.author_id ?? "");
  const content = String(p.content ?? "");
  const likesCount = Number(p.likesCount ?? p.likes_count ?? 0);
  const commentsCount = Number(p.commentsCount ?? p.comments_count ?? 0);
  const createdAt = String(p.createdAt ?? p.created_at ?? "");
  const updatedAt = String(p.updatedAt ?? p.updated_at ?? "");

  // Optional author username (if exists in payload)
  const authorUsername =
    typeof p.authorUsername === "string"
      ? p.authorUsername
      : typeof p.author_username === "string"
      ? p.author_username
      : undefined;

  return {
    id,
    authorId,
    content,
    likesCount: Number.isFinite(likesCount) ? likesCount : 0,
    commentsCount: Number.isFinite(commentsCount) ? commentsCount : 0,
    createdAt,
    updatedAt,
    ...(authorUsername ? { authorUsername } : {}),
  };
}

export const contentService = {
  getPosts: async (skip = 0, limit = 20): Promise<Post[]> => {
    const response = await apiClient.get<unknown>(`${CONTENT_PREFIX}/posts`, {
      params: { skip, limit },
    });

    const data = response.data;

    // possible shapes:
    // - Post[]
    // - { posts: Post[] }
    // - { posts: unknown[] }
    if (Array.isArray(data)) {
      return data.map((item) => normalizePost(item));
    }

    const obj = (data ?? {}) as Record<string, unknown>;
    const list = obj.posts;

    if (Array.isArray(list)) {
      return list.map((item) => normalizePost(item));
    }

    return [];
  },

  getPostById: async (postId: string): Promise<Post> => {
    const response = await apiClient.get<unknown>(`${CONTENT_PREFIX}/posts/${postId}`);
    return normalizePost(response.data);
  },

  createPost: async (postData: CreatePostRequest): Promise<Post> => {
    const response = await apiClient.post<unknown>(`${CONTENT_PREFIX}/posts`, postData);
    return normalizePost(response.data);
  },

  updatePost: async (postId: string, postData: Partial<Post>): Promise<Post> => {
    const response = await apiClient.put<unknown>(`${CONTENT_PREFIX}/posts/${postId}`, postData);
    return normalizePost(response.data);
  },

  deletePost: async (postId: string): Promise<void> => {
    await apiClient.delete(`${CONTENT_PREFIX}/posts/${postId}`);
  },

  getComments: async (postId: string): Promise<Comment[]> => {
    const response = await apiClient.get<Comment[]>(`${CONTENT_PREFIX}/posts/${postId}/comments`);
    return response.data;
  },

  createComment: async (postId: string, commentData: CreateCommentRequest): Promise<Comment> => {
    const response = await apiClient.post<Comment>(`${CONTENT_PREFIX}/posts/${postId}/comments`, commentData);
    return response.data;
  },

  deleteComment: async (commentId: string): Promise<void> => {
    await apiClient.delete(`${CONTENT_PREFIX}/comments/${commentId}`);
  },

  likePost: async (postId: string): Promise<Post> => {
    const response = await apiClient.post<unknown>(`${CONTENT_PREFIX}/posts/${postId}/like`);
    return normalizePost(response.data);
  },

  unlikePost: async (postId: string): Promise<Post> => {
    const response = await apiClient.post<unknown>(`${CONTENT_PREFIX}/posts/${postId}/unlike`);
    return normalizePost(response.data);
  },
};
