
export type UserRole = "admin" | "moderator" | "user";

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
