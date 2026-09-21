# STRIC Web (Frontend SPA)

Interface web moderna do **Sistema de Triagem e Resumo Inteligente de Currículos (STRIC)**, desenvolvida para conectar candidatos e recrutadores com triagem automatizada orientada a Inteligência Artificial.

---

## 🚀 Tecnologias Utilizadas

- **React 18** com **Vite** e **TypeScript**
- **Tailwind CSS** (design system customizado, dark mode, glassmorphism e microinterações)
- **TanStack Query (React Query)** (gerenciamento de estado assíncrono e polling a cada 3s)
- **React Hook Form** + **Zod** (validação de formulários e schemas)
- **Axios** (cliente HTTP com interceptors para injeção de JWT e tratamento de erros)
- **Lucide React** (iconografia moderna)

---

## 📋 Funcionalidades Principais

### 1. Autenticação & Perfis (RBAC)
- Login e cadastro com seleção de papéis: `Candidato` ou `Recrutador`.
- Gerenciamento de sessão com tokens JWT via LocalStorage e interceptors Axios.
- Rotas protegidas por papéis (Private Routes).
- Edição de perfil com validação de senha atual e atualização em tempo real no banco de dados.

### 2. Área do Candidato
- Listagem de vagas abertas com filtros de busca por cargo, tecnologia e anos de experiência.
- Modal de candidatura com validação client-side estrita (apenas `.pdf` até 5MB).
- Envio via `multipart/form-data`.
- Feedback com **polling automático a cada 3 segundos** (HTTP 202 `EM_ANALISE` -> `CONCLUIDO`).
- Visualização imediata do score de compatibilidade, resumo executivo da IA e requisitos atendidos.

### 3. Painel do Recrutador
- Cadastro de novas vagas com chips interativos de requisitos obrigatórios e desejáveis.
- Ranking de candidatos ordenado pelo `score_aderencia` (badges coloridos: ≥70% verde, 50-69% amarelo, <50% vermelho).
- Card detalhado do candidato com resumo executivo da IA, formação e experiência identificadas.
- **Conformidade com a LGPD**: mascaramento padrão de contatos (`(11) 9****-**34` e `j***@***.com`) com botão *"Selecionar para Entrevista"* para revelação e auditoria.
- Download do arquivo original do currículo em PDF.

---

## 🛠️ Como Executar o Projeto

1. **Instalar dependências**:
   ```bash
   npm install
   ```

2. **Executar em ambiente de desenvolvimento**:
   ```bash
   npm run dev
   ```
   A aplicação estará disponível em `http://localhost:5173`.

3. **Gerar build de produção**:
   ```bash
   npm run build
   ```

---

## 🔗 Integração com o Backend

A aplicação consome a API REST Spring Boot em `http://localhost:8080/api` (configurada via proxy no `vite.config.ts` e `api.ts`).
