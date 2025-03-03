import React, { createContext, useReducer, useContext, useEffect } from 'react';
import { LoginCredentials, AuthState } from '../types/auth.types';
import { User } from '../types/user.types';
import { getCurrentUser, loginUser, logoutUser } from '../services/authService';

type AuthAction = 
  | { type: 'LOGIN_REQUEST' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' };

interface AuthContextType {
  authState: AuthState;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_REQUEST':
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload,
        error: null
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        error: action.payload
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const initAuth = async () => {
      try {
        dispatch({ type: 'LOGIN_REQUEST' });
        const user = await getCurrentUser();
        if (user) {
          dispatch({ type: 'LOGIN_SUCCESS', payload: user });
        } else {
          dispatch({ type: 'LOGOUT' });
        }
      } catch (error) {
        dispatch({ type: 'LOGOUT' });
      }
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      dispatch({ type: 'LOGIN_REQUEST' });
      const user = await loginUser(credentials);
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    } catch (error) {
      dispatch({ 
        type: 'LOGIN_FAILURE', 
        payload: error instanceof Error ? error.message : 'Failed to login' 
      });
    }
  };

  const logout = async () => {
    await logoutUser();
    dispatch({ type: 'LOGOUT' });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <AuthContext.Provider 
      value={{ 
        authState, 
        login, 
        logout, 
        clearError 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };











// import React, { createContext, useState, useEffect, ReactNode } from 'react';
// import { User } from '../types/user.types';
// import { authService } from '../services/authService';

// interface AuthContextType {
//   user: User | null;
//   isLoading: boolean;
//   error: string | null;
//   login: (email: string, password: string) => Promise<void>;
//   logout: () => void;
//   forgotPassword: (email: string) => Promise<void>;
//   resetPassword: (token: string, newPassword: string) => Promise<void>;
//   clearError: () => void;
// }

// export const AuthContext = createContext<AuthContextType>({
//   user: null,
//   isLoading: false,
//   error: null,
//   login: async () => {},
//   logout: () => {},
//   forgotPassword: async () => {},
//   resetPassword: async () => {},
//   clearError: () => {},
// });

// interface AuthProviderProps {
//   children: ReactNode;
// }

// export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const checkAuthStatus = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         if (token) {
//           const user = await authService.getCurrentUser();
//           setUser(user);
//         }
//       } catch (error) {
//         localStorage.removeItem('token');
//         console.error('Auth check error:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     checkAuthStatus();
//   }, []);

//   const login = async (email: string, password: string) => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       const { user, token } = await authService.login(email, password);
//       localStorage.setItem('token', token);
//       setUser(user);
//     } catch (error) {
//       if (error instanceof Error) {
//         setError(error.message);
//       } else {
//         setError('An unknown error occurred');
//       }
//       throw error;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     setUser(null);
//   };

//   const forgotPassword = async (email: string) => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       await authService.forgotPassword(email);
//     } catch (error) {
//       if (error instanceof Error) {
//         setError(error.message);
//       } else {
//         setError('An unknown error occurred');
//       }
//       throw error;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const resetPassword = async (token: string, newPassword: string) => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       await authService.resetPassword(token, newPassword);
//     } catch (error) {
//       if (error instanceof Error) {
//         setError(error.message);
//       } else {
//         setError('An unknown error occurred');
//       }
//       throw error;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const clearError = () => {
//     setError(null);
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         isLoading,
//         error,
//         login,
//         logout,
//         forgotPassword,
//         resetPassword,
//         clearError,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };