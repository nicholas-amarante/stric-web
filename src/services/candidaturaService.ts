import api from './api';
import { Candidatura, UploadCandidaturaResponse } from '../types';
import { AxiosError } from 'axios';

export const candidaturaService = {
  /**
   * Envio de currículo em PDF via multipart/form-data.
   * Validação rigorosa no client-side: extensão .pdf e tamanho <= 5MB.
   */
  async enviarCandidatura(vagaId: string, arquivo: File): Promise<UploadCandidaturaResponse> {
    // 1. Validação client-side de extensão
    if (!arquivo.name.toLowerCase().endsWith('.pdf')) {
      throw new Error('Formato de arquivo inválido. Apenas arquivos no formato .pdf são aceitos.');
    }

    // 2. Validação client-side de tamanho (5MB = 5 * 1024 * 1024 bytes)
    const MAX_SIZE_BYTES = 5 * 1024 * 1024;
    if (arquivo.size > MAX_SIZE_BYTES) {
      throw new Error(`O arquivo excede o limite máximo permitido de 5MB (${(arquivo.size / (1024 * 1024)).toFixed(2)} MB).`);
    }

    // 3. Montagem do FormData para multipart/form-data
    const formData = new FormData();
    formData.append('vagaId', vagaId);
    formData.append('arquivo', arquivo);

    try {
      // Backend responde com HTTP 202 Accepted
      const response = await api.post<UploadCandidaturaResponse>(`/candidaturas/vagas/${vagaId}/submeter`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      if (error instanceof AxiosError && error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      const msg = error.response?.data?.message || error.message || 'Falha ao enviar candidatura para o servidor.';
      throw new Error(msg);
    }
  },

  /**
   * Consulta o status atual de uma candidatura (usado no polling a cada 3s).
   */
  async consultarCandidatura(id: string): Promise<Candidatura> {
    try {
      const response = await api.get<Candidatura>(`/candidaturas/${id}`);
      return response.data;
    } catch (error: any) {
      if (error instanceof AxiosError && error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      const msg = error.response?.data?.message || error.message || 'Falha ao consultar status da candidatura.';
      throw new Error(msg);
    }
  },

  /**
   * Lista as candidaturas enviadas pelo candidato logado.
   */
  async listarMinhasCandidaturas(): Promise<Candidatura[]> {
    try {
      const response = await api.get<Candidatura[]>('/candidaturas/minhas');
      const data = response.data;
      // Trata desempacotamento seguro caso venha direto ou envelopado
      if (Array.isArray(data)) {
        return data;
      }
      if (data && typeof data === 'object' && Array.isArray((data as any).data)) {
        return (data as any).data;
      }
      return [];
    } catch (error: any) {
      if (error instanceof AxiosError && error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      const msg = error.response?.data?.message || error.message || 'Falha ao carregar suas candidaturas.';
      throw new Error(msg);
    }
  },

  /**
   * Dispara a ação de selecionar o candidato para entrevista e revela os dados de contato completos.
   */
  async selecionarParaEntrevista(id: string, justificativa?: string): Promise<Candidatura> {
    try {
      const response = await api.patch<Candidatura>(
        `/candidaturas/${id}/selecionar-entrevista`,
        justificativa ? { justificativa } : undefined
      );
      return response.data;
    } catch (error: any) {
      if (error instanceof AxiosError && error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      const msg = error.response?.data?.message || error.message || 'Falha ao selecionar candidato para entrevista.';
      throw new Error(msg);
    }
  },

  /**
   * Download do PDF original do currículo.
   */
  async baixarCurriculo(id: string, nomeArquivo?: string): Promise<void> {
    try {
      const response = await api.get(`/candidaturas/${id}/download-pdf`, {
        responseType: 'blob',
      });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = nomeArquivo || `curriculo-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error: any) {
      if (error instanceof AxiosError && error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      const msg = error.response?.data?.message || error.message || 'Falha ao baixar arquivo de currículo.';
      throw new Error(msg);
    }
  }
};

export default candidaturaService;
