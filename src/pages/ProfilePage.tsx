import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();

  // Dados Básicos
  const [nome, setNome] = useState<string>(user?.nome || '');
  const [email, setEmail] = useState<string>(user?.email || '');
  const [senhaConfirmacaoEmail, setSenhaConfirmacaoEmail] = useState<string>('');
  const [showSenhaEmail, setShowSenhaEmail] = useState<boolean>(false);

  // Alteração de Senha
  const [senhaAtual, setSenhaAtual] = useState<string>('');
  const [novaSenha, setNovaSenha] = useState<string>('');
  const [confirmarNovaSenha, setConfirmarNovaSenha] = useState<string>('');
  
  const [showSenhaAtual, setShowSenhaAtual] = useState<boolean>(false);
  const [showNovaSenha, setShowNovaSenha] = useState<boolean>(false);
  const [showConfirmarSenha, setShowConfirmarSenha] = useState<boolean>(false);

  // Feedback
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const isEmailChanged = email !== user?.email;
  const isDirty = nome !== user?.nome || isEmailChanged || senhaAtual !== '' || novaSenha !== '';

  useEffect(() => {
    if (user) {
      setNome(user.nome);
      setEmail(user.email);
    }
  }, [user]);

  const handleDiscard = () => {
    setNome(user?.nome || '');
    setEmail(user?.email || '');
    setSenhaConfirmacaoEmail('');
    setSenhaAtual('');
    setNovaSenha('');
    setConfirmarNovaSenha('');
      setSenhaConfirmacaoEmail('');
    setSaveError(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError(null);
    setSuccessMsg(null);
    setIsSaving(true);

    if (isEmailChanged && !senhaConfirmacaoEmail) {
      setSaveError('Para alterar o e-mail, confirme sua senha atual.');
      setIsSaving(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (novaSenha && novaSenha !== confirmarNovaSenha) {
      setSaveError('A nova senha e a confirmação não conferem.');
      setIsSaving(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    try {
            if (updateProfile) {
        await updateProfile({ 
          nome: nome.trim(), 
          email: email.trim(), 
          senhaAtual: (senhaAtual || senhaConfirmacaoEmail || '').trim(), 
          novaSenha: (novaSenha || '').trim() 
        });
      }
      setSuccessMsg('Configurações atualizadas com sucesso.');
      setSenhaAtual('');
      setNovaSenha('');
      setConfirmarNovaSenha('');
      setSenhaConfirmacaoEmail('');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error: any) {
      setSaveError(error.message || 'Erro ao atualizar perfil.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 text-slate-800 bg-[#f8fafc] min-h-[80vh]">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Configurações da Conta</h1>
          <p className="text-sm text-slate-500 mt-1">Gerencie suas informações pessoais e preferências de segurança.</p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors bg-white px-4 py-2 rounded-md border border-slate-200 shadow-sm"
        >
          <ArrowLeft size={16} /> Voltar
        </button>
      </div>

      {(saveError || successMsg) && (
        <div className={`mb-6 p-4 rounded-md flex items-center gap-3 ${saveError ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
          {saveError ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
          <span className="text-sm font-medium">{saveError || successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-10">
        
        {/* BLOCO 1: Informações Pessoais */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 pt-8 border-t border-slate-200">
          <div className="lg:w-1/3">
            <h2 className="text-lg font-semibold text-slate-900">Informações Pessoais</h2>
            <p className="text-sm text-slate-500 mt-1">Atualize seus dados de contato e nome de exibição.</p>
          </div>
          
          <div className="lg:w-2/3 bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Nome Completo</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-slate-800 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Endereço de E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-slate-800 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Confirmação de senha se o email for alterado */}
            {isEmailChanged && (
              <div className="space-y-2 p-4 bg-amber-50 border border-amber-200 rounded-lg animate-fade-in">
                <label className="text-sm font-medium text-amber-900 flex items-center gap-1.5">
                  <AlertCircle size={16} /> Para alterar o e-mail, digite sua senha atual
                </label>
                <div className="relative">
                  <input
                    type={showSenhaEmail ? 'text' : 'password'}
                    value={senhaConfirmacaoEmail}
                    onChange={(e) => {
                      setSenhaConfirmacaoEmail(e.target.value);
                      if (saveError) setSaveError(null);
                    }}
                    placeholder="Sua senha atual"
                    className="w-full bg-white border border-amber-300 rounded-md pl-3 pr-10 py-2 text-slate-800 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSenhaEmail(!showSenhaEmail)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showSenhaEmail ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* BLOCO 2: Segurança */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 pt-8 border-t border-slate-200">
          <div className="lg:w-1/3">
            <h2 className="text-lg font-semibold text-slate-900">Segurança</h2>
            <p className="text-sm text-slate-500 mt-1">Altere sua senha para manter a conta segura.</p>
          </div>
          
          <div className="lg:w-2/3 bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Senha Atual</label>
              <div className="relative">
                <input
                  type={showSenhaAtual ? 'text' : 'password'}
                  value={senhaAtual}
                  onChange={(e) => setSenhaAtual(e.target.value)}
                  placeholder="Deixe em branco se não for alterar"
                  className="w-full bg-white border border-slate-300 rounded-md pl-3 pr-10 py-2 text-slate-800 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowSenhaAtual(!showSenhaAtual)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showSenhaAtual ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Nova Senha</label>
                <div className="relative">
                  <input
                    type={showNovaSenha ? 'text' : 'password'}
                    value={novaSenha}
                    onChange={(e) => setNovaSenha(e.target.value)}
                    placeholder="Nova senha"
                    className="w-full bg-white border border-slate-300 rounded-md pl-3 pr-10 py-2 text-slate-800 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNovaSenha(!showNovaSenha)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showNovaSenha ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Confirmar Nova Senha</label>
                <div className="relative">
                  <input
                    type={showConfirmarSenha ? 'text' : 'password'}
                    value={confirmarNovaSenha}
                    onChange={(e) => setConfirmarNovaSenha(e.target.value)}
                    placeholder="Repita a senha"
                    className="w-full bg-white border border-slate-300 rounded-md pl-3 pr-10 py-2 text-slate-800 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmarSenha(!showConfirmarSenha)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmarSenha ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BARRA DE AÇÃO FLUTUANTE SE HOUVER MUDANÇAS */}
        {isDirty && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-50 animate-fade-in">
            <div className="bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-slate-600 text-sm font-medium">
                Você possui alterações não salvas.
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleDiscard}
                  disabled={isSaving}
                  className="flex-1 sm:flex-none px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 transition-colors text-sm font-medium"
                >
                  Descartar
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 sm:flex-none px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    'Salvar Alterações'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
