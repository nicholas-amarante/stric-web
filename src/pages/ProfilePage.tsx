import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  User, 
  Mail, 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  Check, 
  X, 
  ArrowLeft, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  Eye,
  EyeOff,
  Home
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, isRecruiter, updateProfile } = useAuth();
  const navigate = useNavigate();

  // Dados Básicos
  const [nome, setNome] = useState<string>(user?.nome || '');
  const [email, setEmail] = useState<string>(user?.email || '');

  // Confirmação de Senha para Troca de E-mail
  const [senhaConfirmacaoEmail, setSenhaConfirmacaoEmail] = useState<string>('');
  const [showSenhaEmail, setShowSenhaEmail] = useState<boolean>(false);

  // Alteração de Senha
  const [querAlterarSenha, setQuerAlterarSenha] = useState<boolean>(false);
  const [senhaAtual, setSenhaAtual] = useState<string>('');
  const [novaSenha, setNovaSenha] = useState<string>('');
  const [confirmarNovaSenha, setConfirmarNovaSenha] = useState<string>('');

  const [showSenhaAtual, setShowSenhaAtual] = useState<boolean>(false);
  const [showNovaSenha, setShowNovaSenha] = useState<boolean>(false);
  const [showConfirmarSenha, setShowConfirmarSenha] = useState<boolean>(false);

  // Feedback
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Sincroniza se o usuário do contexto mudar
  useEffect(() => {
    if (user) {
      setNome(user.nome);
      setEmail(user.email);
    }
  }, [user]);

  // 1. Validação do Nome: não vazio, pelo menos 3 letras reais
  const cleanNome = nome.replace(/[^a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ]/g, '');
  let nomeError: string | null = null;
  if (!nome.trim()) {
    nomeError = 'O campo de nome não pode ser vazio.';
  } else if (cleanNome.length < 3) {
    nomeError = 'O nome deve conter pelo menos 3 letras válidas (ex: Ana).';
  }

  // 2. Validação do E-mail
  let emailError: string | null = null;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const emailAlterado = user ? email.trim().toLowerCase() !== user.email.toLowerCase() : false;

  if (!email.trim()) {
    emailError = 'O campo de e-mail não pode ser vazio.';
  } else if (!emailRegex.test(email.trim())) {
    emailError = 'Formato de e-mail inválido.';
  }

  // Se o e-mail foi alterado, a senha de confirmação é obrigatória
  let senhaEmailError: string | null = null;
  if (emailAlterado && !senhaConfirmacaoEmail) {
    senhaEmailError = 'Para alterar seu e-mail de login, digite sua senha atual.';
  }

  // 3. Validação de Alteração de Senha
  const temAlteracaoSenha = querAlterarSenha || senhaAtual || novaSenha || confirmarNovaSenha;
  let senhaAtualError: string | null = null;
  let novaSenhaError: string | null = null;
  let confirmarSenhaError: string | null = null;

  if (temAlteracaoSenha) {
    if (!senhaAtual) {
      senhaAtualError = 'Digite sua senha atual.';
    }
    if (!novaSenha) {
      novaSenhaError = 'Digite a nova senha.';
    } else if (novaSenha.length < 4) {
      novaSenhaError = 'A nova senha deve ter pelo menos 4 caracteres.';
    }
    if (!confirmarNovaSenha) {
      confirmarSenhaError = 'Confirme a nova senha.';
    } else if (novaSenha !== confirmarNovaSenha) {
      confirmarSenhaError = 'As senhas não coincidem. Digite exatamente a mesma senha.';
    }
  }

  // Detecção de Alterações (isDirty)
  const isDirty = 
    (user && nome !== user.nome) ||
    emailAlterado ||
    Boolean(temAlteracaoSenha);

  // Validação Geral
  const isValid = 
    !nomeError && 
    !emailError && 
    !senhaEmailError && 
    (!temAlteracaoSenha || (!senhaAtualError && !novaSenhaError && !confirmarSenhaError));

  const handleDiscard = () => {
    if (user) {
      setNome(user.nome);
      setEmail(user.email);
      setSenhaConfirmacaoEmail('');
      setQuerAlterarSenha(false);
      setSenhaAtual('');
      setNovaSenha('');
      setConfirmarNovaSenha('');
      setSaveError(null);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isDirty || !isValid || isSaving) return;

    setSaveError(null);
    setSaveSuccess(false);
    setIsSaving(true);

    try {
      await updateProfile({
        nome: nome.trim(),
        email: email.trim(),
        senhaAtual: emailAlterado ? (senhaConfirmacaoEmail || senhaAtual) : (temAlteracaoSenha ? senhaAtual : undefined),
        novaSenha: temAlteracaoSenha ? novaSenha : undefined,
      });

      // Sucesso: limpa campos de senha e fecha a seção de alteração de senha
      setSaveSuccess(true);
      setSenhaConfirmacaoEmail('');
      setQuerAlterarSenha(false);
      setSenhaAtual('');
      setNovaSenha('');
      setConfirmarNovaSenha('');
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: unknown) {
      // Erro: mantém os campos ABERTOS e os valores digitados intactos, alertando o usuário
      setSaveError(err instanceof Error ? err.message : 'Erro ao atualizar dados.');
      // Se era alteração de senha, mantém explicitamente a seção aberta
      if (temAlteracaoSenha) {
        setQuerAlterarSenha(true);
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 animate-fade-in">
      {/* Top Navigation - Botão claro para voltar para a tela de início */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-200 hover:text-white transition-colors py-1.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 shadow-sm"
          >
            <Home size={14} className="text-brand-400" />
            Voltar para o Início
          </button>

          <button
            type="button"
            onClick={() => navigate(isRecruiter ? '/recrutador' : '/vagas')}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors py-1.5 px-3 rounded-lg hover:bg-slate-900 border border-transparent hover:border-slate-800"
          >
            <ArrowLeft size={14} />
            {isRecruiter ? 'Painel do Recrutador' : 'Vagas Abertas'}
          </button>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <ShieldCheck size={14} className="text-emerald-400" />
          <span>Área Segura do Usuário</span>
        </div>
      </div>

      {/* Main Header (Sem IDs ou roles técnicas) */}
      <div className="border-b border-slate-800/80 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 p-0.5 shadow-lg shadow-brand-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-brand-400">
              <User size={30} />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold text-white tracking-tight">
                {user.nome}
              </h1>
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                isRecruiter 
                  ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30' 
                  : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
              }`}>
                <Sparkles size={11} />
                {isRecruiter ? 'Recrutador' : 'Candidato'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Gerencie suas informações pessoais e credenciais de acesso.
            </p>
          </div>
        </div>
      </div>

      {/* Feedback Alert: Sucesso */}
      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-3 animate-fade-in">
          <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
          <span>Informações atualizadas com sucesso! Os novos dados já estão disponíveis em sua conta.</span>
        </div>
      )}

      {/* Feedback Alert: Erro (como na tela de login, apenas alerta e mantém o usuário na tela com os campos abertos) */}
      {saveError && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-3 animate-fade-in">
          <AlertCircle size={18} className="text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5 flex-1">
            <p className="font-semibold text-rose-200">Não foi possível salvar as alterações</p>
            <p className="text-rose-300/90 leading-relaxed text-xs">{saveError}</p>
          </div>
          <button
            type="button"
            onClick={() => setSaveError(null)}
            className="text-rose-400 hover:text-rose-200 p-1 rounded hover:bg-rose-500/20 transition-colors"
            title="Fechar aviso"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Form Container */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Card 1: Dados Pessoais (Nome e E-mail) */}
        <div className="glass-panel rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <div>
              <h2 className="text-base font-semibold text-white">Dados Pessoais</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Clique nos campos abaixo para alterar o nome ou e-mail de acesso.
              </p>
            </div>

            {isDirty ? (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-500/15 text-amber-300 border border-amber-500/30">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                Modificado
              </span>
            ) : (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-850 text-slate-400 border border-slate-800">
                <Check size={12} className="text-emerald-400" />
                Sincronizado
              </span>
            )}
          </div>

          {/* Campo Nome Completo */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="nome" className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <User size={14} className="text-brand-400" />
                Nome Completo
              </label>
              <span className="text-[11px] text-slate-500">
                {cleanNome.length} letra{cleanNome.length !== 1 ? 's' : ''} válida{cleanNome.length !== 1 ? 's' : ''} (mínimo 3)
              </span>
            </div>

            <div className="relative">
              <input
                id="nome"
                type="text"
                value={nome}
                onChange={(e) => {
                  setNome(e.target.value);
                  if (saveError) setSaveError(null);
                }}
                placeholder="Digite seu nome (ex: Ana)"
                className={`glass-input w-full pl-3.5 pr-10 text-sm ${
                  nomeError && isDirty ? 'border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/20' : ''
                }`}
              />
              {nome && (
                <button
                  type="button"
                  onClick={() => {
                    setNome('');
                    if (saveError) setSaveError(null);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-1"
                  title="Limpar campo"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {nomeError && isDirty && (
              <p className="text-xs text-rose-400 flex items-center gap-1.5 mt-1 animate-fade-in">
                <AlertCircle size={13} />
                {nomeError}
              </p>
            )}
          </div>

          {/* Campo E-mail de Acesso */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Mail size={14} className="text-indigo-400" />
              E-mail de Acesso
            </label>

            <div className="relative">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (saveError) setSaveError(null);
                }}
                placeholder="seu.email@exemplo.com"
                className={`glass-input w-full pl-3.5 pr-10 text-sm ${
                  emailError && isDirty ? 'border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/20' : ''
                }`}
              />
              {email && (
                <button
                  type="button"
                  onClick={() => {
                    setEmail('');
                    if (saveError) setSaveError(null);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-1"
                  title="Limpar campo"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {emailError && isDirty && (
              <p className="text-xs text-rose-400 flex items-center gap-1.5 mt-1 animate-fade-in">
                <AlertCircle size={13} />
                {emailError}
              </p>
            )}

            {/* Confirmação de Senha necessária se o e-mail for alterado */}
            {emailAlterado && (
              <div className="mt-3 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2 animate-fade-in">
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
                  <Lock size={14} />
                  <span>Confirmação de Segurança: Alteração de E-mail</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Como o e-mail é a principal credencial de login, digite sua senha atual para autorizar a mudança:
                </p>

                <div className="relative">
                  <input
                    type={showSenhaEmail ? 'text' : 'password'}
                    value={senhaConfirmacaoEmail}
                    onChange={(e) => {
                      setSenhaConfirmacaoEmail(e.target.value);
                      if (saveError) setSaveError(null);
                    }}
                    placeholder="Digite sua senha atual"
                    className={`glass-input w-full pl-3.5 pr-10 text-sm ${
                      saveError && saveError.toLowerCase().includes('senha')
                        ? 'border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/20'
                        : 'border-amber-500/50 focus:border-amber-500 focus:ring-amber-500/20'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowSenhaEmail(!showSenhaEmail)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-1"
                  >
                    {showSenhaEmail ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>

                {senhaEmailError && (
                  <p className="text-xs text-rose-400 flex items-center gap-1.5 mt-1">
                    <AlertCircle size={13} />
                    {senhaEmailError}
                  </p>
                )}
                {saveError && saveError.toLowerCase().includes('senha') && (
                  <p className="text-xs text-rose-400 font-medium flex items-center gap-1.5 mt-1 animate-fade-in">
                    <AlertCircle size={13} />
                    {saveError}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Card 2: Alteração de Senha */}
        <div className="glass-panel rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <div>
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <KeyRound size={18} className="text-brand-400" />
                Segurança e Senha
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Altere a sua senha de acesso. Para sua segurança, você deve informar a senha atual e repetir a nova senha duas vezes.
              </p>
            </div>

            {!querAlterarSenha && (
              <button
                type="button"
                onClick={() => setQuerAlterarSenha(true)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-xs font-medium text-slate-300 hover:text-white transition-colors border border-slate-700/60"
              >
                Mudar Senha
              </button>
            )}
          </div>

          {querAlterarSenha && (
            <div className="space-y-4 animate-fade-in">
              {/* Senha Atual */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Lock size={13} className="text-slate-400" />
                  Senha Atual
                </label>
                <div className="relative">
                  <input
                    type={showSenhaAtual ? 'text' : 'password'}
                    value={senhaAtual}
                    onChange={(e) => {
                      setSenhaAtual(e.target.value);
                      if (saveError) setSaveError(null);
                    }}
                    placeholder="Digite sua senha atual"
                    className={`glass-input w-full pl-3.5 pr-10 text-sm ${
                      (senhaAtualError || (saveError && saveError.toLowerCase().includes('senha'))) 
                        ? 'border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/20' 
                        : ''
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowSenhaAtual(!showSenhaAtual)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-1"
                  >
                    {showSenhaAtual ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                {senhaAtualError && (
                  <p className="text-xs text-rose-400 flex items-center gap-1.5 mt-1">
                    <AlertCircle size={13} />
                    {senhaAtualError}
                  </p>
                )}
                {saveError && saveError.toLowerCase().includes('senha') && (
                  <p className="text-xs text-rose-400 font-medium flex items-center gap-1.5 mt-1 animate-fade-in">
                    <AlertCircle size={13} />
                    {saveError}
                  </p>
                )}
              </div>

              {/* Nova Senha */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <KeyRound size={13} className="text-brand-400" />
                  Nova Senha (mínimo 4 caracteres)
                </label>
                <div className="relative">
                  <input
                    type={showNovaSenha ? 'text' : 'password'}
                    value={novaSenha}
                    onChange={(e) => {
                      setNovaSenha(e.target.value);
                      if (saveError) setSaveError(null);
                    }}
                    placeholder="Digite a nova senha"
                    className={`glass-input w-full pl-3.5 pr-10 text-sm ${
                      novaSenhaError ? 'border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/20' : ''
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNovaSenha(!showNovaSenha)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-1"
                  >
                    {showNovaSenha ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                {novaSenhaError && (
                  <p className="text-xs text-rose-400 flex items-center gap-1.5 mt-1">
                    <AlertCircle size={13} />
                    {novaSenhaError}
                  </p>
                )}
              </div>

              {/* Confirmar Nova Senha (Repetir 2x) */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Check size={13} className="text-emerald-400" />
                  Confirmar Nova Senha (repita a senha)
                </label>
                <div className="relative">
                  <input
                    type={showConfirmarSenha ? 'text' : 'password'}
                    value={confirmarNovaSenha}
                    onChange={(e) => {
                      setConfirmarNovaSenha(e.target.value);
                      if (saveError) setSaveError(null);
                    }}
                    placeholder="Repita a nova senha para confirmar"
                    className={`glass-input w-full pl-3.5 pr-10 text-sm ${
                      confirmarSenhaError ? 'border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/20' : ''
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmarSenha(!showConfirmarSenha)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-1"
                  >
                    {showConfirmarSenha ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                {confirmarSenhaError && (
                  <p className="text-xs text-rose-400 flex items-center gap-1.5 mt-1">
                    <AlertCircle size={13} />
                    {confirmarSenhaError}
                  </p>
                )}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setQuerAlterarSenha(false);
                    setSenhaAtual('');
                    setNovaSenha('');
                    setConfirmarNovaSenha('');
                    if (saveError) setSaveError(null);
                  }}
                  className="text-xs text-slate-400 hover:text-slate-200 transition-colors py-1 px-2.5"
                >
                  Cancelar alteração de senha
                </button>
              </div>
            </div>
          )}
        </div>

        {/* BARRA DE AÇÃO: Aparece automaticamente assim que o usuário alterar algum campo */}
        {isDirty && (
          <div className="p-4 rounded-xl bg-slate-900/90 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xl backdrop-blur-md animate-fade-in">
            <div className="text-left w-full sm:w-auto">
              <p className="text-xs font-semibold text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                Você possui alterações pendentes
              </p>
              <p className="text-[11px] text-slate-400">
                Confirme para salvar os novos dados ou descarte para manter os atuais.
              </p>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={handleDiscard}
                disabled={isSaving}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white text-xs font-medium transition-colors border border-slate-700/60"
              >
                Descartar
              </button>

              <button
                type="submit"
                disabled={!isValid || isSaving}
                className={`btn-primary text-xs py-2 px-5 flex items-center gap-2 ${
                  !isValid || isSaving ? 'opacity-50 cursor-not-allowed' : 'shadow-glow'
                }`}
              >
                {isSaving ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Validando senha...</span>
                  </>
                ) : (
                  <>
                    <Check size={14} />
                    <span>Confirmar Alteração</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </form>

      {/* LGPD Security Notice */}
      <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-850 flex items-start gap-3">
        <ShieldCheck size={18} className="text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs text-slate-400">
          <p className="font-semibold text-slate-300">
            Conformidade com a LGPD e Proteção de Dados
          </p>
          <p className="leading-relaxed">
            Seus dados pessoais são armazenados com criptografia e utilizados unicamente para identificação nas etapas do processo seletivo. Para candidatos, os dados de contato permanecem mascarados aos recrutadores até a etapa de seleção para entrevista.
          </p>
        </div>
      </div>
    </div>
  );
};
