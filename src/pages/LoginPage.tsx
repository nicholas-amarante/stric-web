import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';
import { 
  Bot, 
  Lock, 
  Mail, 
  User, 
  ArrowRight, 
  ShieldCheck, 
  UserCircle, 
  LayoutDashboard
} from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('E-mail em formato inválido.'),
  senha: z.string().min(4, 'A senha deve ter pelo menos 4 caracteres.'),
});

const registerSchema = z.object({
  nome: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres.'),
  email: z.string().email('E-mail em formato inválido.'),
  senha: z.string().min(4, 'A senha deve ter pelo menos 4 caracteres.'),
  role: z.enum(['ROLE_CANDIDATE', 'ROLE_RECRUITER']),
});

type LoginInputs = z.infer<typeof loginSchema>;
type RegisterInputs = z.infer<typeof registerSchema>;

export const LoginPage: React.FC = () => {
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [selectedRole, setSelectedRole] = useState<Role>('ROLE_CANDIDATE');
  const [authError, setAuthError] = useState<string | null>(null);
  const { login, register: registerUser, isLoading } = useAuth();
  const navigate = useNavigate();

  // Login Form
  const {
    register: loginRegister,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors }
  } = useForm<LoginInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      senha: '',
    }
  });

  // Register Form
  const {
    register: regRegister,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: regErrors }
  } = useForm<RegisterInputs>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      nome: '',
      email: '',
      senha: '',
      role: 'ROLE_CANDIDATE',
    }
  });

  const onLogin = async (data: LoginInputs) => {
    setAuthError(null);
    try {
      const loggedUser = await login(data.email, data.senha);
      navigate(loggedUser.role === 'ROLE_RECRUITER' ? '/recrutador' : '/vagas');
    } catch (err: unknown) {
      setAuthError(err instanceof Error ? err.message : 'Falha na autenticação.');
    }
  };

  const onRegister = async (data: RegisterInputs) => {
    setAuthError(null);
    try {
      const registeredUser = await registerUser(data.nome, data.email, data.senha, selectedRole);
      navigate(registeredUser.role === 'ROLE_RECRUITER' ? '/recrutador' : '/vagas');
    } catch (err: unknown) {
      setAuthError(err instanceof Error ? err.message : 'Falha ao realizar cadastro.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 shadow-glow mb-2">
            <Bot size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            STRIC - Triagem com IA
          </h1>
          <p className="text-xs text-slate-400">
            {isRegistering 
              ? 'Crie sua conta para acessar vagas ou gerenciar processos seletivos'
              : 'Entre na sua conta para acompanhar vagas e candidaturas'}
          </p>
        </div>

        {/* Card Principal */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border-slate-800 space-y-6 shadow-2xl">
          {/* Abas: Entrar vs Cadastrar */}
          <div className="grid grid-cols-2 p-1 bg-slate-950/80 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => { setIsRegistering(false); setAuthError(null); }}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                !isRegistering 
                  ? 'bg-brand-600 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => { setIsRegistering(true); setAuthError(null); }}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                isRegistering 
                  ? 'bg-brand-600 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Criar Conta
            </button>
          </div>

          {authError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {authError}
            </div>
          )}

          {/* FORMULÁRIO DE LOGIN */}
          {!isRegistering ? (
            <form onSubmit={handleLoginSubmit(onLogin)} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  E-mail
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    {...loginRegister('email')}
                    placeholder="seu.email@exemplo.com"
                    className="glass-input pl-10 w-full text-sm"
                  />
                </div>
                {loginErrors.email && (
                  <p className="text-xs text-rose-400">{loginErrors.email.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Senha
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="password"
                    {...loginRegister('senha')}
                    placeholder="••••••••"
                    className="glass-input pl-10 w-full text-sm"
                  />
                </div>
                {loginErrors.senha && (
                  <p className="text-xs text-rose-400">{loginErrors.senha.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full text-sm py-3 mt-2"
              >
                <span>Acessar Plataforma</span>
                <ArrowRight size={16} />
              </button>
            </form>
          ) : (
            /* FORMULÁRIO DE CADASTRO */
            <form onSubmit={handleRegisterSubmit(onRegister)} className="space-y-4">
              {/* Seleção de Perfil: Candidato ou Recrutador */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Qual é o seu perfil? *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRole('ROLE_CANDIDATE')}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      selectedRole === 'ROLE_CANDIDATE'
                        ? 'bg-brand-500/15 border-brand-500/60 shadow-glow text-white'
                        : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <UserCircle size={20} className={selectedRole === 'ROLE_CANDIDATE' ? 'text-brand-400' : 'text-slate-500'} />
                    <div className="mt-2">
                      <span className="text-xs font-bold block">Candidato</span>
                      <span className="text-[10px] text-slate-400">Buscar vagas & enviar CV</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedRole('ROLE_RECRUITER')}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      selectedRole === 'ROLE_RECRUITER'
                        ? 'bg-indigo-500/15 border-indigo-500/60 shadow-glow text-white'
                        : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <LayoutDashboard size={20} className={selectedRole === 'ROLE_RECRUITER' ? 'text-indigo-400' : 'text-slate-500'} />
                    <div className="mt-2">
                      <span className="text-xs font-bold block">Recrutador</span>
                      <span className="text-[10px] text-slate-400">Criar vagas & triagem</span>
                    </div>
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Nome Completo
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    {...regRegister('nome')}
                    placeholder="Seu nome"
                    className="glass-input pl-10 w-full text-sm"
                  />
                </div>
                {regErrors.nome && (
                  <p className="text-xs text-rose-400">{regErrors.nome.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  E-mail
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    {...regRegister('email')}
                    placeholder="seu.email@exemplo.com"
                    className="glass-input pl-10 w-full text-sm"
                  />
                </div>
                {regErrors.email && (
                  <p className="text-xs text-rose-400">{regErrors.email.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Senha
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="password"
                    {...regRegister('senha')}
                    placeholder="Mínimo 4 caracteres"
                    className="glass-input pl-10 w-full text-sm"
                  />
                </div>
                {regErrors.senha && (
                  <p className="text-xs text-rose-400">{regErrors.senha.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full text-sm py-3 mt-2"
              >
                <span>Concluir Cadastro</span>
                <ArrowRight size={16} />
              </button>
            </form>
          )}

        </div>

        {/* LGPD & Segurança Badge */}
        <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
          <ShieldCheck size={14} className="text-emerald-400" />
          <span>Segurança com JWT, RBAC e Conformidade com a LGPD</span>
        </div>
      </div>
    </div>
  );
};
