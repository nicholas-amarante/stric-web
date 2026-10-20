# STRIC Web (Frontend SPA)

Interface web moderna do **Sistema de Triagem e Resumo Inteligente de Currículos (STRIC)**, desenvolvida para conectar candidatos e recrutadores com triagem automatizada orientada a Inteligência Artificial (Google Gemini).

---

## 🚀 Tecnologias Utilizadas

- **React 18** com **Vite** e **TypeScript**
- **Tailwind CSS** com **Design System Corporativo Clean/Minimalista** (estética sóbria, cards estruturados com bordas sutis, tipografia com alto contraste e foco em usabilidade SaaS executiva)
- **TanStack Query (React Query)** (gerenciamento de estado de requisições, polling automático resiliente e isolamento total de sessão com `queryClient.clear()` no logout)
- **React Hook Form** + **Zod** (validação estrita de formulários e schemas de dados)
- **Axios** (cliente HTTP com interceptors para injeção de token JWT e tratamento unificado de erros de resposta)
- **Lucide React** (iconografia moderna e semântica)

---

## 📋 Funcionalidades Principais

### 1. Autenticação, Perfis & Segurança (RBAC)
- **Controle de Acesso Baseado em Papéis**: Login e cadastro com perfis diferenciados: `ROLE_CANDIDATE` e `ROLE_RECRUITER`.
- **Sessão Segura**: Armazenamento de token JWT e redirecionamento dinâmico baseado em função via `ProtectedRoute`.
- **Isolamento de Cache no Logout**: Invocação preventiva de `queryClient.clear()` no logout, garantindo que nenhum dado sensível de vagas ou candidatos permaneça em cache na máquina ao trocar de usuário.
- **Página de Perfil Corporativa (`/perfil`)**:
  - Layout SaaS estruturado em 2 colunas com navegação rápida lateral e cards bem delimitados.
  - **Segurança de E-mail**: Exigência obrigatória de confirmação da senha atual para autorizar alterações no endereço de e-mail.
  - Alteração de senha com confirmação e validação client-side.
  - Feedback visual claro com rolagem automática suave (`window.scrollTo`) para mensagens de sucesso ou alertas de validação da API.

### 2. Área do Candidato (`/vagas`)
- **Busca Server-Side com Debounce**: Barra de pesquisa reativa utilizando o hook customizado `useDebounce`, conectada diretamente aos parâmetros de consulta do backend (`termoBusca` e `experienciaMaxima`).
- **Cards de Vagas Clean**: Exibição refinada com status visual (`ABERTA`, `PAUSADA`, `ENCERRADA`), requisitos obrigatórios/desejáveis e tempo mínimo de experiência.
- **Submissão Segura de Currículo**: Modal com validação rigorosa no frontend (somente arquivos `.pdf` de até 5MB) enviados via `multipart/form-data`.
- **Polling Resiliente de Análise**: Consulta automática a cada 3 segundos via React Query durante o estado `EM_ANALISE`, com parada imediata após conclusão (`CONCLUIDO`) ou rejeição.
- **Feedback Transparente de Triagem**: Visualização imediata do score de compatibilidade técnica (0 a 100%), resumo executivo gerado pela IA, requisitos atendidos e pontos de atenção detectados.

### 3. Painel do Recrutador (`/recrutador`)
- **Gestão de Vagas**: Alternância facilitada entre todas as vagas e a listagem exclusiva **"Minhas Vagas"** (`GET /api/vagas/minhas`), evitando poluição visual entre diferentes recrutadores da empresa.
- **Cadastro e Edição de Vagas**: Modal de criação com chips interativos para inclusão de requisitos técnicos obrigatórios e desejáveis.
- **Controle de Status da Vaga**: Acompanhamento do ciclo de vida da vaga (`ABERTA`, `PAUSADA`, `ENCERRADA`).
- **Ranking Automatizado de Candidatos**:
  - Ordenação decrescente por `score_aderencia` fornecido pela IA.
  - Badges semânticos de pontuação: **≥70% Verde** (alta compatibilidade), **50-69% Amarelo** (compatibilidade moderada), **<50% Vermelho** (baixa compatibilidade).
- **Conformidade Estrita com a LGPD**:
  - Mascaramento por padrão de todos os contatos do candidato (`(11) 9****-**34` e `j***@***.com`).
  - Ação deliberada **"Selecionar para Entrevista"**, exigindo justificativa formal que registra auditoria no backend e revela os contatos reais.
- **Download do PDF Original**: Acesso direto ao currículo submetido pelo candidato em formato binário seguro.

---

## 🔑 Credenciais de Demonstração (DatabaseSeeder)

O backend possui uma carga inicial de dados simulados prontos para teste imediato com a senha padrão **`senha123`**:

| Perfil | E-mail | Senha | Descrição |
|---|---|---|---|
| **Recrutador** | `ana.souza@techrecruiting.com.br` | `senha123` | Possui vagas cadastradas com ranking de candidatos triados por IA |
| **Recrutador** | `carlos.lima@rhagil.com.br` | `senha123` | Outro recrutador para validar isolamento de "Minhas Vagas" |
| **Candidato** | `lucas.santos@email.com` | `senha123` | Candidato com histórico e candidaturas cadastradas |
| **Candidato** | `beatriz.costa@email.com` | `senha123` | Candidata para testes de novas submissões |

---

## 🛠️ Como Executar o Projeto

1. **Instalar dependências**:
   ```bash
   npm install
   ```

2. **Executar em modo de desenvolvimento**:
   ```bash
   npm run dev
   ```
   A aplicação estará disponível em `http://localhost:5173`.

3. **Gerar build de produção**:
   ```bash
   npm run build
   ```

4. **Pré-visualizar o build**:
   ```bash
   npm run preview
   ```

---

## 🔗 Integração com o Backend

A aplicação consome a API REST Spring Boot hospedada no Render em `https://stric-api.onrender.com/api` (ou localmente via variável de ambiente).

### Variáveis de Ambiente
A URL base da API é configurada através da variável:
```env
VITE_API_BASE_URL=https://stric-api.onrender.com/api
```

- Para deploy na **Vercel**, certifique-se de definir a variável de ambiente `VITE_API_BASE_URL` nas configurações do projeto (`Project Settings -> Environment Variables`) caso deseje apontar para outro ambiente, ou ela utilizará o fallback padrão `https://stric-api.onrender.com/api`.
- O cliente HTTP centralizado está configurado em [src/services/api.ts](src/services/api.ts) e o proxy de desenvolvimento em [vite.config.ts](vite.config.ts).
