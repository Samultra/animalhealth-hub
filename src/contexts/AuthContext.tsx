
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, AuthState } from '../types/auth';
import { getDB, initDB, initDemoData } from '../services/db';

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

// Моковые пароли для демонстрации (в реальном приложении хранятся в хэшированном виде)
const MOCK_PASSWORDS = {
  "admin@example.com": "admin123",
  "moderator@example.com": "moderator123",
  "user@example.com": "user123",
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(initialState);

  // Инициализация базы данных при загрузке
  useEffect(() => {
    const initialize = async () => {
      await initDB();
      await initDemoData();
      
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

    initialize();
  }, []);

  // Вход в систему
  const login = async (email: string, password: string) => {
    const db = await getDB();
    const userIndex = db.transaction('users').store.index('by-email');
    const user = await userIndex.get(email);

    // Проверяем пароль (в демо-версии используем моковые пароли)
    if (!user || MOCK_PASSWORDS[email as keyof typeof MOCK_PASSWORDS] !== password) {
      throw new Error("Неверный email или пароль");
    }
    
    // Сохраняем в localStorage
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    setAuthState({
      user,
      isAuthenticated: true,
      isLoading: false,
    });
  };

  // Регистрация
  const register = async (username: string, email: string, password: string) => {
    const db = await getDB();
    const userIndex = db.transaction('users').store.index('by-email');
    
    // Проверка, что пользователь с таким email не существует
    const existingUser = await userIndex.get(email);
    if (existingUser) {
      throw new Error("Пользователь с таким email уже существует");
    }

    // Создаем нового пользователя
    const newUser = {
      id: Date.now().toString(),
      username,
      email,
      role: "user" as UserRole, // По умолчанию обычный пользователь
      createdAt: new Date().toISOString(),
    };

    // Сохраняем пользователя в базу данных
    const tx = db.transaction('users', 'readwrite');
    await tx.store.add(newUser);
    await tx.done;

    // Для демо-версии добавляем пароль в моковую базу
    (MOCK_PASSWORDS as any)[email] = password;

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
