import api from './api';
import { AuthResponse, Role, Usuario } from '../types';
import { AxiosError } from 'axios';

export const authService = {
  async login(email: string, _senha: string): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/login', { email, senha: _senha });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        const errorMsg = error.response.data?.message || 'E-mail ou senha incorretos.';
        throw new Error(errorMsg);
      }
      throw new Error('Não foi possível conectar ao servidor. Verifique se o backend está rodando.');
    }
  },

  async register(nome: string, email: string, _senha: string, role: Role): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/register', {
        nome,
        email,
        senha: _senha,
        role
      });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        const errorMsg = error.response.data?.message || 'Falha ao realizar cadastro.';
        throw new Error(errorMsg);
      }
      throw new Error('Não foi possível conectar ao servidor. Verifique se o backend está rodando.');
    }
  },

  async getMe(): Promise<Usuario> {
    const response = await api.get<Usuario>('/auth/me');
    return response.data;
  },

  async updateProfile(
    _userId: string, 
    dados: { currentEmail: string; nome?: string; email?: string; senhaAtual?: string; novaSenha?: string }
  ): Promise<Usuario> {
    try {
      // Dispara a atualização real para o backend Spring Boot no endpoint PUT /api/auth/profile
      const response = await api.put<{ success: boolean; message: string; data: AuthResponse }>('/auth/profile', {
        nome: dados.nome,
        email: dados.email,
        senhaAtual: dados.senhaAtual,
        novaSenha: dados.novaSenha,
      });

      // Extrai os dados retornados (tratando resposta envolvida por ApiResponse ou direta)
      const authData = response.data?.data || (response.data as unknown as AuthResponse);

      // Se o e-mail foi alterado, um novo token JWT foi gerado pelo backend
      if (authData.token) {
        localStorage.setItem('@stric:token', authData.token);
      }

      if (authData.usuario) {
        localStorage.setItem('@stric:user', JSON.stringify(authData.usuario));
        return authData.usuario;
      }

      return authData as unknown as Usuario;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        const errorMsg = error.response.data?.message || 'Falha ao atualizar dados no servidor.';
        throw new Error(errorMsg);
      }
      throw new Error('Não foi possível conectar ao servidor para atualizar o perfil.');
    }
  }
};

