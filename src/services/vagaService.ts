import api from './api';
import { Vaga, Candidatura, CreateJobInput } from '../types';
import { MOCK_VAGAS, MOCK_CANDIDATURAS } from './mockData';

// Estado em memória para persistência temporária se a API estiver offline
let localVagas = [...MOCK_VAGAS];

export const vagaService = {
  async listarVagasAbertas(): Promise<Vaga[]> {
    try {
      const response = await api.get<Vaga[]>('/vagas');
      if (response.data && response.data.length > 0) {
        return response.data;
      }
      return localVagas;
    } catch (error) {
      console.warn('API backend em localhost:8080 offline ou sem dados. Utilizando dados de demonstração.', error);
      return localVagas;
    }
  },

  async obterVagaPorId(id: string): Promise<Vaga> {
    try {
      const response = await api.get<Vaga>(`/vagas/${id}`);
      return response.data;
    } catch (error) {
      const vaga = localVagas.find(v => v.id === id);
      if (vaga) return vaga;
      throw new Error(`Vaga com id ${id} não encontrada.`);
    }
  },

  async criarVaga(dados: CreateJobInput): Promise<Vaga> {
    try {
      const response = await api.post<Vaga>('/vagas', dados);
      return response.data;
    } catch (error) {
      console.warn('API backend indisponível. Cadastrando vaga localmente.', error);
      const novaVaga: Vaga = {
        id: `vaga-${Date.now()}`,
        ...dados,
        status: 'ABERTA',
        dataCriacao: new Date().toISOString(),
        recrutadorNome: 'Mariana Silveira',
        totalCandidatos: 0,
      };
      localVagas = [novaVaga, ...localVagas];
      return novaVaga;
    }
  },

  async listarCandidaturasPorVaga(vagaId: string): Promise<Candidatura[]> {
    try {
      const response = await api.get<Candidatura[]>(`/vagas/${vagaId}/candidaturas`);
      if (response.data && response.data.length > 0) {
        return response.data;
      }
      return MOCK_CANDIDATURAS.filter(c => c.vagaId === vagaId);
    } catch (error) {
      console.warn('API backend indisponível. Carregando candidaturas de demonstração.', error);
      return MOCK_CANDIDATURAS.filter(c => c.vagaId === vagaId);
    }
  }
};
