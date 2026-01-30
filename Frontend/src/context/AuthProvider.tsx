import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { User } from "../services/authService";
import { authService } from "../services/authService";
import { AuthContext, type AuthContextType } from "./authContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const currentUser = await authService.getCurrentUser(); // calls /auth/me
        setUser(currentUser);
      } catch {
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    await authService.login({ email, password });
    const currentUser = await authService.getCurrentUser();
    setUser(currentUser);
  }, []);

  const register = useCallback(async (username: string, email: string, password: string) => {
    await authService.register({ username, email, password });
    const currentUser = await authService.getCurrentUser();
    setUser(currentUser);
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  const updateUser = useCallback((u: User) => setUser(u), []);

  const value: AuthContextType = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: !!user,
      login,
      register,
      logout,
      updateUser,
    }),
    [user, isLoading, login, register, logout, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
