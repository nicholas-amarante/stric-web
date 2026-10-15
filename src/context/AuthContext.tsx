import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Usuario, Role } from '../types';
import { authService } from '../services/authService';
import { useQueryClient } from '@tanstack/react-query';
import { isTokenExpired } from '../utils/jwt';

interface AuthContextType {
  user: Usuario | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isCandidate: boolean;
  isRecruiter: boolean;
  login: (email: string, senha: string) => Promise<Usuario>;
  register: (nome: string, email: string, senha: string, role: Role) => Promise<Usuario>;
  updateProfile: (dados: { nome?: string; email?: string; senhaAtual?: string; novaSenha?: string }) => Promise<Usuario>;
  logout: () => void;
  quickSwitchRole?: (role: Role) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();

  // 1. Inicializa o token verificando expiração síncrona
  const [token, setToken] = useState<string | null>(() => {
    const savedToken = localStorage.getItem('@stric:token');
    if (!savedToken || isTokenExpired(savedToken)) {
      localStorage.removeItem('@stric:token');
      localStorage.removeItem('@stric:user');
      return null;
    }
    return savedToken;
  });

  // 2. Inicializa o user apenas se houver token válido
  const [user, setUser] = useState<Usuario | null>(() => {
    const savedToken = localStorage.getItem('@stric:token');
    if (!savedToken || isTokenExpired(savedToken)) {
      return null;
    }
    const savedUser = localStorage.getItem('@stric:user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Sincroniza estado com localStorage
  useEffect(() => {
    if (user && token && !isTokenExpired(token)) {
      localStorage.setItem('@stric:user', JSON.stringify(user));
      localStorage.setItem('@stric:token', token);
    } else {
      localStorage.removeItem('@stric:user');
      localStorage.removeItem('@stric:token');
    }
  }, [user, token]);

  const logout = () => {
    queryClient.clear();
    setUser(null);
    setToken(null);
    localStorage.removeItem('@stric:user');
    localStorage.removeItem('@stric:token');
  };

  // 3. Camada B: Validação e sincronização com o backend em segundo plano caso haja token local
  useEffect(() => {
    if (!token) return;

    let isMounted = true;

    authService.getMe()
      .then((freshUser) => {
        if (isMounted && freshUser) {
          setUser(freshUser);
        }
      })
      .catch((err: any) => {
        if (isMounted) {
          // Se o servidor retornar 401 ou erro de autenticação, encerra a sessão
          if (err?.response?.status === 401 || err?.message?.includes('401')) {
            logout();
          }
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email: string, senha: string): Promise<Usuario> => {
    setIsLoading(true);
    try {
      const data = await authService.login(email, senha);
      setUser(data.usuario);
      setToken(data.token);
      return data.usuario;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (nome: string, email: string, senha: string, role: Role): Promise<Usuario> => {
    setIsLoading(true);
    try {
      const data = await authService.register(nome, email, senha, role);
      setUser(data.usuario);
      setToken(data.token);
      return data.usuario;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (dados: { nome?: string; email?: string; senhaAtual?: string; novaSenha?: string }): Promise<Usuario> => {
    setIsLoading(true);
    try {
      const updated = await authService.updateProfile(user?.id || '', {
        currentEmail: user?.email || '',
        ...dados,
      });
      setUser(updated);
      const newToken = localStorage.getItem('@stric:token');
      if (newToken && !isTokenExpired(newToken)) {
        setToken(newToken);
      }
      return updated;
    } finally {
      setIsLoading(false);
    }
  };

  const isAuthenticated = !!user && !!token && !isTokenExpired(token);
  const isCandidate = user?.role === 'ROLE_CANDIDATE';
  const isRecruiter = user?.role === 'ROLE_RECRUITER';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated,
        isCandidate,
        isRecruiter,
        login,
        register,
        updateProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider.');
  }
  return context;
};
