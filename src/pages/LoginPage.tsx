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
  ShieldCheck, 
  UserCircle, 
  LayoutDashboard,
  CheckCircle2
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

  const {
    register: loginRegister,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors }
  } = useForm<LoginInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', senha: '' }
  });

  const {
    register: regRegister,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: regErrors }
  } = useForm<RegisterInputs>({
    resolver: zodResolver(registerSchema),
    defaultValues: { nome: '', email: '', senha: '', role: 'ROLE_CANDIDATE' }
  });

  const onLogin = async (data: LoginInputs) => {
    setAuthError(null);
    try {
      const loggedUser = await login(data.email, data.senha);
      navigate(loggedUser.role === 'ROLE_RECRUITER' ? '/recrutador' : '/vagas');
    } catch (error: any) {
      setAuthError(error.response?.data?.message || error.message || 'E-mail ou senha incorretos.');
    }
  };

  const onRegister = async (data: RegisterInputs) => {
    setAuthError(null);
    try {
      const registeredUser = await registerUser(data.nome, data.email, data.senha, selectedRole);
      navigate(registeredUser.role === 'ROLE_RECRUITER' ? '/recrutador' : '/vagas');
    } catch (error: any) {
      setAuthError(error.response?.data?.message || error.message || 'Erro ao realizar cadastro.');
    }
  };

  return (
    <div className="min-h-screen flex bg-white text-slate-900">
      
      {/* Lado Esquerdo: Formulário */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-12">
        <div className="max-w-md w-full mx-auto space-y-8">
          
          {/* Cabeçalho */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center justify-center p-3 rounded-xl bg-blue-600 text-white mb-6">
              <Bot size={28} />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              {isRegistering ? 'Crie sua conta' : 'Bem-vindo de volta'}
            </h1>
            <p className="text-slate-500 mt-2">
              {isRegistering 
                ? 'Junte-se a milhares de profissionais e empresas.' 
                : 'Faça login para acessar sua conta na plataforma.'}
            </p>
          </div>

          {/* Toggle Login/Cadastro */}
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setIsRegistering(false)}
              className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
                !isRegistering ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Entrar
            </button>
            <button
              onClick={() => setIsRegistering(true)}
              className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
                isRegistering ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Cadastrar
            </button>
          </div>

          {authError && (
            <div className="p-3 rounded-md bg-red-50 border border-red-200 text-red-600 text-sm">
              {authError}
            </div>
          )}

          {/* Formulário de Login */}
          {!isRegistering ? (
            <form onSubmit={handleLoginSubmit(onLogin)} className="space-y-5">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">Endereço de E-mail</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    {...loginRegister('email')}
                    placeholder="seu.email@exemplo.com"
                    className="glass-input w-full pl-10"
                  />
                </div>
                {loginErrors.email && <p className="text-xs text-red-500">{loginErrors.email.message}</p>}
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-slate-700">Senha</label>
                  <a href="#" className="text-xs font-semibold text-blue-600 hover:text-blue-700">Esqueceu a senha?</a>
                </div>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    {...loginRegister('senha')}
                    placeholder="••••••••"
                    className="glass-input w-full pl-10"
                  />
                </div>
                {loginErrors.senha && <p className="text-xs text-red-500">{loginErrors.senha.message}</p>}
              </div>

              <button type="submit" disabled={isLoading} className="btn-primary w-full py-2.5 mt-2">
                Entrar
              </button>
            </form>
          ) : (
            /* Formulário de Cadastro */
            <form onSubmit={handleRegisterSubmit(onRegister)} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Qual é o seu perfil?</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedRole('ROLE_CANDIDATE')}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      selectedRole === 'ROLE_CANDIDATE'
                        ? 'bg-blue-50 border-blue-600 text-blue-700 ring-1 ring-blue-600'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-blue-400'
                    }`}
                  >
                    <UserCircle size={24} className={selectedRole === 'ROLE_CANDIDATE' ? 'text-blue-600' : 'text-slate-400'} />
                    <span className="block font-semibold mt-2">Candidato</span>
                    <span className="text-xs mt-1 block opacity-80">Buscar vagas</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRole('ROLE_RECRUITER')}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      selectedRole === 'ROLE_RECRUITER'
                        ? 'bg-blue-50 border-blue-600 text-blue-700 ring-1 ring-blue-600'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-blue-400'
                    }`}
                  >
                    <LayoutDashboard size={24} className={selectedRole === 'ROLE_RECRUITER' ? 'text-blue-600' : 'text-slate-400'} />
                    <span className="block font-semibold mt-2">Recrutador</span>
                    <span className="text-xs mt-1 block opacity-80">Publicar vagas</span>
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">Nome Completo</label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    {...regRegister('nome')}
                    placeholder="Seu nome"
                    className="glass-input w-full pl-10"
                  />
                </div>
                {regErrors.nome && <p className="text-xs text-red-500">{regErrors.nome.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">Endereço de E-mail</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    {...regRegister('email')}
                    placeholder="seu.email@exemplo.com"
                    className="glass-input w-full pl-10"
                  />
                </div>
                {regErrors.email && <p className="text-xs text-red-500">{regErrors.email.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">Senha</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    {...regRegister('senha')}
                    placeholder="Mínimo 4 caracteres"
                    className="glass-input w-full pl-10"
                  />
                </div>
                {regErrors.senha && <p className="text-xs text-red-500">{regErrors.senha.message}</p>}
              </div>

              <button type="submit" disabled={isLoading} className="btn-primary w-full py-2.5 mt-2">
                Criar Conta
              </button>
            </form>
          )}

          {/* Footer LGPD */}
          <div className="flex items-center justify-center gap-2 text-xs text-slate-500 mt-8">
            <ShieldCheck size={14} className="text-emerald-600" />
            <span>Conformidade com a LGPD e Segurança JWT</span>
          </div>

        </div>
      </div>

      {/* Lado Direito: Branding */}
      <div className="hidden lg:flex w-1/2 bg-[#f0f5fa] items-center justify-center p-12">
        <div className="max-w-lg space-y-8">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <CheckCircle2 size={32} className="text-blue-600 mb-4" />
              <h3 className="font-bold text-slate-900">Triagem Ágil</h3>
              <p className="text-sm text-slate-600 mt-2">Acelere suas contratações com inteligência e precisão baseada em dados reais.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mt-8">
              <Bot size={32} className="text-blue-600 mb-4" />
              <h3 className="font-bold text-slate-900">Análise de IA</h3>
              <p className="text-sm text-slate-600 mt-2">Extração automática de habilidades diretamente dos currículos enviados.</p>
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Simplifique o Recrutamento.
            </h2>
            <p className="text-slate-600 mt-4 leading-relaxed">
              Nossa plataforma conecta talentos excepcionais a empresas inovadoras, eliminando a fricção do processo seletivo tradicional.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
