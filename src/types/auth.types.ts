import { User } from "./user.types";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  shouldRedirect: boolean;
  isLoading: boolean;
  error: string | null;
}