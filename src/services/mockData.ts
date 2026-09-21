import { Vaga, Candidatura, Usuario } from '../types';

export const MOCK_RECRUITER: Usuario = {
  id: 'usr-rec-001',
  nome: 'Mariana Silveira (Recrutadora Tech)',
  email: 'mariana.tech@stric.com.br',
  role: 'ROLE_RECRUITER',
};

export const MOCK_CANDIDATE: Usuario = {
  id: 'usr-can-001',
  nome: 'Lucas Mendonça',
  email: 'lucas.mendonca@email.com',
  role: 'ROLE_CANDIDATE',
};

export const MOCK_VAGAS: Vaga[] = [
  {
    id: 'vaga-001',
    titulo: 'Desenvolvedor(a) Full Stack Senior (Java & React)',
    descricao: 'Buscamos um(a) desenvolvedor(a) sênior com sólida experiência em ecossistema Spring Boot e React moderno para atuar na evolução de nossa plataforma financeira de alta escala.',
    requisitosObrigatorios: [
      'Java 21 / Spring Boot 3',
      'React com TypeScript',
      'PostgreSQL',
      'Arquitetura de Microsserviços',
      'Testes automatizados (JUnit, Mockito)'
    ],
    requisitosDesejaveis: [
      'Tailwind CSS',
      'Docker e Kubernetes',
      'Spring AI ou integração com LLMs',
      'AWS Cloud'
    ],
    tempoExperienciaAnos: 5,
    status: 'ABERTA',
    dataCriacao: '2026-09-18T10:00:00Z',
    recrutadorNome: 'Mariana Silveira',
    totalCandidatos: 4,
  },
  {
    id: 'vaga-002',
    titulo: 'Engenheiro(a) de Software Front-End Pleno',
    descricao: 'Oportunidade para atuar no desenvolvimento de interfaces ricas, performáticas e acessíveis utilizando React, Next.js e Tailwind CSS.',
    requisitosObrigatorios: [
      'React 18+',
      'TypeScript avançado',
      'Tailwind CSS',
      'Gerenciamento de estado com TanStack Query'
    ],
    requisitosDesejaveis: [
      'Next.js App Router',
      'Testes com Vitest e Playwright',
      'Design Systems'
    ],
    tempoExperienciaAnos: 3,
    status: 'ABERTA',
    dataCriacao: '2026-09-17T14:30:00Z',
    recrutadorNome: 'Mariana Silveira',
    totalCandidatos: 2,
  },
  {
    id: 'vaga-003',
    titulo: 'Arquiteto(a) de Inteligência Artificial & Cloud',
    descricao: 'Liderar a estratégia técnica de integração de modelos generativos (Gemini, Claude, GPT) em pipelines corporativos orientados a eventos.',
    requisitosObrigatorios: [
      'Experiência comprovada em LLMs e RAG',
      'Python ou Java avançado',
      'Engenharia de Prompt e Segurança Anti-Injection',
      'Arquitetura Cloud (AWS/GCP)'
    ],
    requisitosDesejaveis: [
      'Spring AI ou LangChain',
      'Bancos Vetoriais (Pgvector, Pinecone)',
      'Governança de IA e LGPD'
    ],
    tempoExperienciaAnos: 6,
    status: 'ABERTA',
    dataCriacao: '2026-09-15T09:00:00Z',
    recrutadorNome: 'Mariana Silveira',
    totalCandidatos: 3,
  }
];

export const MOCK_CANDIDATURAS: Candidatura[] = [
  {
    id: 'cand-001',
    vagaId: 'vaga-001',
    vagaTitulo: 'Desenvolvedor(a) Full Stack Senior (Java & React)',
    candidatoId: 'usr-can-001',
    candidatoNome: 'Lucas M*******',
    candidatoEmailMascarado: 'l****.m******@email.com',
    candidatoTelefoneMascarado: '(11) 9****-**42',
    emailCompleto: 'lucas.mendonca@email.com',
    telefoneCompleto: '(11) 98765-4321',
    status: 'CONCLUIDO',
    dataSubmissao: '2026-09-19T11:20:00Z',
    arquivoNomeOriginal: 'Curriculo_Lucas_Mendonca_2026.pdf',
    analiseIA: {
      scoreAderencia: 92,
      resumoExecutivo: 'Candidato com 6 anos de experiência robusta em Java e ecossistema Spring Boot, além de 4 anos atuando diretamente com React e TypeScript. Possui vivência prática em microsserviços e PostgreSQL, atendendo com folga todos os requisitos mandatórios da vaga.',
      requisitosAtendidos: [
        'Java 21 / Spring Boot 3 (Avançado)',
        'React com TypeScript (Sólido)',
        'PostgreSQL e modelagem relacional',
        'Microsserviços e mensageria',
        'Testes automatizados (JUnit/Mockito)'
      ],
      pontosAtencao: [
        'Experiência com Spring AI ainda em estágio inicial/estudo.',
        'Não cita certificações formais em AWS Cloud no currículo.'
      ],
      dadosExtraidos: {
        tempoExperienciaAnos: 6,
        nivelFormacao: 'Bacharelado em Ciência da Computação (USP)',
        telefoneIdentificado: '(11) 98765-4321',
        emailIdentificado: 'lucas.mendonca@email.com'
      }
    }
  },
  {
    id: 'cand-002',
    vagaId: 'vaga-001',
    vagaTitulo: 'Desenvolvedor(a) Full Stack Senior (Java & React)',
    candidatoId: 'usr-can-002',
    candidatoNome: 'Beatriz S****',
    candidatoEmailMascarado: 'b******@techmail.io',
    candidatoTelefoneMascarado: '(21) 9****-**18',
    emailCompleto: 'beatriz.silva@techmail.io',
    telefoneCompleto: '(21) 99123-8818',
    status: 'SELECIONADO_ENTREVISTA',
    dataSubmissao: '2026-09-18T16:45:00Z',
    arquivoNomeOriginal: 'CV_Beatriz_SeniorDev.pdf',
    analiseIA: {
      scoreAderencia: 78,
      resumoExecutivo: 'Excelente perfil com foco em desenvolvimento back-end Java e microsserviços. Conhece React para manutenção e telas corporativas, porém sua maior força reside em arquiteturas distribuídas e banco de dados PostgreSQL.',
      requisitosAtendidos: [
        'Java 21 / Spring Boot 3',
        'PostgreSQL',
        'Microsserviços',
        'Docker e Kubernetes'
      ],
      pontosAtencao: [
        'Experiência em React é focada em legado/classes; pouca vivência com React 18 hooks modernos.',
        'Tempo total de experiência de 4 anos (vaga solicita 5 anos).'
      ],
      dadosExtraidos: {
        tempoExperienciaAnos: 4,
        nivelFormacao: 'Engenharia de Software (UFRJ)',
        telefoneIdentificado: '(21) 99123-8818',
        emailIdentificado: 'beatriz.silva@techmail.io'
      }
    }
  },
  {
    id: 'cand-003',
    vagaId: 'vaga-001',
    vagaTitulo: 'Desenvolvedor(a) Full Stack Senior (Java & React)',
    candidatoId: 'usr-can-003',
    candidatoNome: 'Rafael A******',
    candidatoEmailMascarado: 'r*****@yahoo.com.br',
    candidatoTelefoneMascarado: '(31) 9****-**90',
    emailCompleto: 'rafael.albuquerque@yahoo.com.br',
    telefoneCompleto: '(31) 98456-7890',
    status: 'CONCLUIDO',
    dataSubmissao: '2026-09-19T08:15:00Z',
    arquivoNomeOriginal: 'Curriculo_Rafael_2026.pdf',
    analiseIA: {
      scoreAderencia: 58,
      resumoExecutivo: 'Perfil essencialmente Front-End com forte domínio em React, TypeScript e Tailwind. Apresenta conhecimentos teóricos em Java e Spring Boot, mas sem histórico de projetos corporativos complexos no back-end.',
      requisitosAtendidos: [
        'React com TypeScript',
        'Tailwind CSS',
        'Testes de interface'
      ],
      pontosAtencao: [
        'Não comprovou experiência corporativa prática com Spring Boot e microsserviços.',
        'Pouca vivência com tuning e queries complexas em PostgreSQL.'
      ],
      dadosExtraidos: {
        tempoExperienciaAnos: 3,
        nivelFormacao: 'Sistemas de Informação (PUC Minas)',
        telefoneIdentificado: '(31) 98456-7890',
        emailIdentificado: 'rafael.albuquerque@yahoo.com.br'
      }
    }
  },
  {
    id: 'cand-004',
    vagaId: 'vaga-001',
    vagaTitulo: 'Desenvolvedor(a) Full Stack Senior (Java & React)',
    candidatoId: 'usr-can-004',
    candidatoNome: 'Diego F******',
    candidatoEmailMascarado: 'd****@inbox.net',
    candidatoTelefoneMascarado: '(41) 9****-**77',
    emailCompleto: 'diego.fernandes@inbox.net',
    telefoneCompleto: '(41) 97111-2277',
    status: 'CONCLUIDO',
    dataSubmissao: '2026-09-17T20:10:00Z',
    arquivoNomeOriginal: 'Diego_Fernandes_CV.pdf',
    analiseIA: {
      scoreAderencia: 35,
      resumoExecutivo: 'Candidato júnior/iniciante com projetos em PHP e JavaScript puro. Não possui experiência com Java moderno (Spring Boot) nem com React funcional/TypeScript. Não atende aos requisitos mínimos estipulados para a posição sênior.',
      requisitosAtendidos: [
        'Conceitos básicos de banco de dados relacional'
      ],
      pontosAtencao: [
        'Não possui experiência com Java nem Spring Boot.',
        'Não trabalhou com React nem TypeScript.',
        'Experiência profissional inferior a 1 ano na área.'
      ],
      dadosExtraidos: {
        tempoExperienciaAnos: 1,
        nivelFormacao: 'Tecnólogo em Análise e Desenvolvimento de Sistemas',
        telefoneIdentificado: '(41) 97111-2277',
        emailIdentificado: 'diego.fernandes@inbox.net'
      }
    }
  }
];
