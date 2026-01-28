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

export const contentService = {
  getPosts: async (skip = 0, limit = 20): Promise<Post[]> => {
    const response = await apiClient.get<Post[]>('/posts', {
      params: { skip, limit },
    });
    return response.data;
  },

  getPostById: async (postId: string): Promise<Post> => {
    const response = await apiClient.get<Post>(`/posts/${postId}`);
    return response.data;
  },

  createPost: async (postData: CreatePostRequest): Promise<Post> => {
    const response = await apiClient.post<Post>('/posts', postData);
    return response.data;
  },

  updatePost: async (postId: string, postData: Partial<Post>): Promise<Post> => {
    const response = await apiClient.put<Post>(`/posts/${postId}`, postData);
    return response.data;
  },

  deletePost: async (postId: string): Promise<void> => {
    await apiClient.delete(`/posts/${postId}`);
  },

  getComments: async (postId: string): Promise<Comment[]> => {
    const response = await apiClient.get<Comment[]>(`/posts/${postId}/comments`);
    return response.data;
  },

  createComment: async (postId: string, commentData: CreateCommentRequest): Promise<Comment> => {
    const response = await apiClient.post<Comment>(`/posts/${postId}/comments`, commentData);
    return response.data;
  },

  deleteComment: async (commentId: string): Promise<void> => {
    await apiClient.delete(`/comments/${commentId}`);
  },

  likePost: async (postId: string): Promise<Post> => {
    const response = await apiClient.post<Post>(`/posts/${postId}/like`);
    return response.data;
  },

  unlikePost: async (postId: string): Promise<Post> => {
    const response = await apiClient.post<Post>(`/posts/${postId}/unlike`);
    return response.data;
  },
};
