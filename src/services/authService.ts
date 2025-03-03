import api from './api';
import { LoginCredentials } from '../types/auth.types';
import { mockLogin, mockGetCurrentUser } from '../mock/mockData';
import { User } from '../types/user.types';

// For development, we'll use mock implementations
export const loginUser = async (credentials: LoginCredentials): Promise<User> => {
  // In production, you would use:
  // const response = await api.post('/auth/login', credentials);
  // localStorage.setItem('token', response.data.token);
  // return response.data.user;
  
  return mockLogin(credentials);
};

export const logoutUser = async (): Promise<void> => {
  localStorage.removeItem('token');
};

export const getCurrentUser = async (): Promise<User | null> => {
  return mockGetCurrentUser();
};