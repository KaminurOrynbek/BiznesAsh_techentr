import apiClient from './api';

export interface Post {
  id: string;
  authorId: string;
  content: string;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  updatedAt: string;
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

// Backend content API is under /content (e.g. POST /content/posts, GET /content/posts/:id)
const CONTENT_PREFIX = '/content';

// API may return { post: {...} } or flat post; fields may be snake_case. Normalize to Post.
function normalizePost(raw: Record<string, unknown>): Post {
  const p = (raw.post as Record<string, unknown>) ?? raw;
  return {
    id: String(p.id ?? ''),
    authorId: String(p.authorId ?? p.author_id ?? ''),
    content: String(p.content ?? ''),
    likesCount: Number(p.likesCount ?? p.likes_count ?? 0),
    commentsCount: Number(p.commentsCount ?? p.comments_count ?? 0),
    createdAt: String(p.createdAt ?? p.created_at ?? ''),
    updatedAt: String(p.updatedAt ?? p.updated_at ?? ''),
  };
}

export const contentService = {
  getPosts: async (skip = 0, limit = 20): Promise<Post[]> => {
    const response = await apiClient.get<Post[] | { posts?: Post[] }>(`${CONTENT_PREFIX}/posts`, {
      params: { skip, limit },
    });
    const data = response.data;
    const list = Array.isArray(data) ? data : (data as { posts?: Post[] }).posts ?? [];
    return list.map((item) => normalizePost((item ?? {}) as unknown as Record<string, unknown>));
  },

  getPostById: async (postId: string): Promise<Post> => {
    const response = await apiClient.get<Record<string, unknown>>(`${CONTENT_PREFIX}/posts/${postId}`);
    return normalizePost(response.data);
  },

  createPost: async (postData: CreatePostRequest): Promise<Post> => {
    const response = await apiClient.post<Record<string, unknown>>(`${CONTENT_PREFIX}/posts`, postData);
    return normalizePost(response.data);
  },

  updatePost: async (postId: string, postData: Partial<Post>): Promise<Post> => {
    const response = await apiClient.put<Record<string, unknown>>(`${CONTENT_PREFIX}/posts/${postId}`, postData);
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
    const response = await apiClient.post<Record<string, unknown>>(`${CONTENT_PREFIX}/posts/${postId}/like`);
    return normalizePost(response.data);
  },

  unlikePost: async (postId: string): Promise<Post> => {
    const response = await apiClient.post<Record<string, unknown>>(`${CONTENT_PREFIX}/posts/${postId}/unlike`);
    return normalizePost(response.data);
  },
};
