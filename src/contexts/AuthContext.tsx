
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, AuthState } from '../types/auth';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
}

// Начальное состояние
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

// Создаем контекст
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock данные пользователей для демонстрации (в реальном приложении будет база данных)
const MOCK_USERS = [
  {
    id: "1",
    username: "admin",
    email: "admin@example.com",
    password: "admin123",
    role: "admin" as UserRole,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    username: "moderator",
    email: "moderator@example.com",
    password: "moderator123",
    role: "moderator" as UserRole,
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    username: "user",
    email: "user@example.com",
    password: "user123",
    role: "user" as UserRole,
    createdAt: new Date().toISOString(),
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(initialState);

  // Проверяем при загрузке, есть ли в localStorage сохраненный пользователь
  useEffect(() => {
    const checkAuth = async () => {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          localStorage.removeItem('currentUser');
          setAuthState({ ...initialState, isLoading: false });
        }
      } else {
        setAuthState({ ...initialState, isLoading: false });
      }
    };

    checkAuth();
  }, []);

  // Вход в систему
  const login = async (email: string, password: string) => {
    // Имитация API запроса
    const user = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      throw new Error("Неверный email или пароль");
    }

    const { password: _, ...userWithoutPassword } = user;
    
    // Сохраняем в localStorage
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
    
    setAuthState({
      user: userWithoutPassword,
      isAuthenticated: true,
      isLoading: false,
    });
  };

  // Регистрация
  const register = async (username: string, email: string, password: string) => {
    // Проверка, что пользователь с таким email не существует
    const existingUser = MOCK_USERS.find((u) => u.email === email);
    if (existingUser) {
      throw new Error("Пользователь с таким email уже существует");
    }

    // Создаем нового пользователя (в реальном приложении - запрос к API)
    const newUser = {
      id: (MOCK_USERS.length + 1).toString(),
      username,
      email,
      password,
      role: "user" as UserRole, // По умолчанию обычный пользователь
      createdAt: new Date().toISOString(),
    };

    // Добавляем в список пользователей (в реальном приложении - сохранение в БД)
    MOCK_USERS.push(newUser);

    // Автоматически выполняем вход
    await login(email, password);
  };

  // Выход из системы
  const logout = () => {
    localStorage.removeItem('currentUser');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  // Проверка роли пользователя
  const hasRole = (roles: UserRole | UserRole[]) => {
    if (!authState.user) return false;
    
    if (Array.isArray(roles)) {
      return roles.includes(authState.user.role);
    }
    
    return authState.user.role === roles;
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        register,
        logout,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Хук для использования контекста
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth должен использоваться внутри AuthProvider");
  }
  return context;
};
