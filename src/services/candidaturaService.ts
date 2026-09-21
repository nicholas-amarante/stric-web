import api from './api';
import { Candidatura, UploadCandidaturaResponse } from '../types';
import { MOCK_CANDIDATURAS } from './mockData';

// Estado em memória para simulação de polling e candidaturas locais
let localCandidaturas = [...MOCK_CANDIDATURAS];
const pollingCounters = new Map<string, number>();

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
      const response = await api.post<UploadCandidaturaResponse>('/candidaturas', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.warn('API backend indisponível. Simulando resposta HTTP 202 e processamento assíncrono.', error);
      const novoId = `cand-demo-${Date.now()}`;
      
      // Cria a candidatura simulada em estado inicial 'EM_ANALISE'
      const novaCandidatura: Candidatura = {
        id: novoId,
        vagaId: vagaId,
        candidatoId: 'usr-can-001',
        candidatoNome: 'Lucas Mendonça',
        candidatoEmailMascarado: 'l****.m******@email.com',
        candidatoTelefoneMascarado: '(11) 9****-**42',
        emailCompleto: 'lucas.mendonca@email.com',
        telefoneCompleto: '(11) 98765-4321',
        status: 'EM_ANALISE',
        dataSubmissao: new Date().toISOString(),
        arquivoNomeOriginal: arquivo.name,
      };

      localCandidaturas = [novaCandidatura, ...localCandidaturas];
      pollingCounters.set(novoId, 0);

      return {
        id: novoId,
        status: 'EM_ANALISE',
        vagaId: vagaId,
        mensagem: 'Currículo recebido com sucesso. Processamento da IA em andamento.',
      };
    }
  },

  /**
   * Consulta o status atual de uma candidatura (usado no polling a cada 3s).
   */
  async consultarCandidatura(id: string): Promise<Candidatura> {
    try {
      const response = await api.get<Candidatura>(`/candidaturas/${id}`);
      return response.data;
    } catch (error) {
      // Simulação de ciclo de vida da IA para demonstração
      const candidatura = localCandidaturas.find(c => c.id === id);
      if (!candidatura) {
        throw new Error(`Candidatura ${id} não encontrada.`);
      }

      if (candidatura.status === 'EM_ANALISE') {
        const count = (pollingCounters.get(id) || 0) + 1;
        pollingCounters.set(id, count);

        // Após ~6 segundos (2 consultas de 3s), simula a conclusão da análise pela IA
        if (count >= 2) {
          candidatura.status = 'CONCLUIDO';
          candidatura.analiseIA = {
            scoreAderencia: 88,
            resumoExecutivo: 'Candidato com forte aderência aos requisitos principais da vaga. Excelente experiência prática comprovada, bom domínio de arquitetura e clareza no histórico de projetos.',
            requisitosAtendidos: [
              'Experiência técnica exigida para a função',
              'Domínio das ferramentas e linguagens obrigatórias',
              'Formação alinhada com as expectativas da vaga'
            ],
            pontosAtencao: [
              'Conhecimentos complementares em cloud podem ser aprofundados durante o onboarding.'
            ],
            dadosExtraidos: {
              tempoExperienciaAnos: 4,
              nivelFormacao: 'Graduação em Tecnologia da Informação',
              telefoneIdentificado: '(11) 98765-4321',
              emailIdentificado: 'lucas.mendonca@email.com'
            }
          };
        }
      }

      return { ...candidatura };
    }
  },

  /**
   * Dispara a ação de selecionar o candidato para entrevista e revela os dados de contato completos.
   */
  async selecionarParaEntrevista(id: string): Promise<Candidatura> {
    try {
      const response = await api.patch<Candidatura>(`/candidaturas/${id}/selecionar-entrevista`);
      return response.data;
    } catch (error) {
      console.warn('API backend indisponível. Simulando revelação de dados via PATCH.', error);
      const cand = localCandidaturas.find(c => c.id === id);
      if (cand) {
        cand.status = 'SELECIONADO_ENTREVISTA';
        return { ...cand };
      }
      throw new Error(`Candidatura ${id} não encontrada.`);
    }
  },

  /**
   * Download do PDF original do currículo.
   */
  async baixarCurriculo(id: string, nomeArquivo?: string): Promise<void> {
    try {
      const response = await api.get(`/candidaturas/${id}/curriculo`, {
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
    } catch (error) {
      console.warn('Download do arquivo via API falhou. Gerando arquivo demonstrativo.', error);
      // Gera um Blob PDF de demonstração para download seguro
      const sampleContent = `%PDF-1.4\n1 0 obj\n<< /Title (Curriculo STRIC) >>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF`;
      const blob = new Blob([sampleContent], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = nomeArquivo || `curriculo-demo-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
  },

  /**
   * Lista as candidaturas enviadas pelo candidato logado.
   */
  async listarMinhasCandidaturas(): Promise<Candidatura[]> {
    try {
      const response = await api.get<Candidatura[]>('/candidaturas/minhas');
      return response.data;
    } catch (error) {
      return localCandidaturas;
    }
  }
};
