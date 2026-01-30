import apiClient from "./api";

export interface User {
  id: string;
  username: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  userId: string;
}

export const authService = {
  login: async (credentials: AuthCredentials): Promise<AuthResponse> => {
    const res = await apiClient.post<AuthResponse>("/auth/login", credentials);
    localStorage.setItem("token", res.data.token);
    return res.data;
  },

  register: async (data: { username: string; email: string; password: string }): Promise<AuthResponse> => {
    const res = await apiClient.post<AuthResponse>("/auth/register", data);
    localStorage.setItem("token", res.data.token);
    return res.data;
  },

  logout: () => {
    localStorage.removeItem("token");
  },

  // пока не используем /auth/me, чтобы не ломать редирект
  getCurrentUser: async (): Promise<User> => {
    const res = await apiClient.get<User>("/auth/me");
    return res.data;
  },
};
