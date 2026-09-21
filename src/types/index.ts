export type Role = 'ROLE_CANDIDATE' | 'ROLE_RECRUITER';

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  role: Role;
  dataCriacao?: string;
}

export interface AuthResponse {
  token: string;
  tipo?: string;
  usuario: Usuario;
}

export type StatusVaga = 'ABERTA' | 'ENCERRADA';

export interface Vaga {
  id: string;
  titulo: string;
  descricao: string;
  requisitosObrigatorios: string[];
  requisitosDesejaveis: string[];
  tempoExperienciaAnos: number;
  status: StatusVaga;
  dataCriacao?: string;
  recrutadorNome?: string;
  totalCandidatos?: number;
}

export type StatusCandidatura = 
  | 'EM_ANALISE' 
  | 'CONCLUIDO' 
  | 'SELECIONADO_ENTREVISTA' 
  | 'REJEITADO' 
  | 'ERRO_PROCESSAMENTO';

export interface DadosExtraidos {
  tempoExperienciaAnos: number;
  nivelFormacao: string;
  telefoneIdentificado: string;
  emailIdentificado: string;
}

export interface AnaliseIA {
  scoreAderencia: number; // 0 a 100
  resumoExecutivo: string;
  requisitosAtendidos: string[];
  pontosAtencao: string[];
  dadosExtraidos: DadosExtraidos;
}

export interface Candidatura {
  id: string;
  vagaId: string;
  vagaTitulo?: string;
  candidatoId: string;
  candidatoNome?: string;
  candidatoEmailMascarado?: string;
  candidatoTelefoneMascarado?: string;
  emailCompleto?: string;
  telefoneCompleto?: string;
  status: StatusCandidatura;
  dataSubmissao: string;
  analiseIA?: AnaliseIA;
  arquivoNomeOriginal?: string;
}

export interface UploadCandidaturaResponse {
  id: string;
  status: StatusCandidatura;
  vagaId: string;
  mensagem: string;
}

export interface CreateJobInput {
  titulo: string;
  descricao: string;
  requisitosObrigatorios: string[];
  requisitosDesejaveis: string[];
  tempoExperienciaAnos: number;
}

export interface ApiErrorResponse {
  status: number;
  message: string;
  timestamp?: string;
  erros?: string[];
}
