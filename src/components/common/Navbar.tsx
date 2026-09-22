import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  Bot, 
  Briefcase, 
  LayoutDashboard, 
  LogOut, 
  Sparkles,
  User,
  Sun,
  Moon
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isRecruiter, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-brand-500/25 group-hover:scale-105 transition-transform">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-slate-900 via-brand-600 to-indigo-600 dark:from-white dark:via-slate-100 dark:to-brand-300 bg-clip-text text-transparent">
                  STRIC
                </span>
                <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-brand-500/15 dark:bg-brand-500/20 text-brand-600 dark:text-brand-300 border border-brand-500/30">
                  <Sparkles size={10} /> IA
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 -mt-0.5 hidden sm:block">
                Triagem Inteligente de Currículos
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/vagas"
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isActive('/vagas') || isActive('/')
                  ? 'bg-slate-100 dark:bg-slate-850 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700/60'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900'
              }`}
            >
              <Briefcase size={16} />
              Vagas Abertas
            </Link>

            {isRecruiter && (
              <Link
                to="/recrutador"
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/recrutador')
                    ? 'bg-brand-500/10 dark:bg-brand-500/20 text-brand-700 dark:text-brand-200 border border-brand-500/30'
                    : 'text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-300 hover:bg-slate-100 dark:hover:bg-slate-900'
                }`}
              >
                <LayoutDashboard size={16} />
                Painel do Recrutador
              </Link>
            )}
          </nav>
        </div>

        {/* Right side: Theme Toggle, User Profile & Actions */}
        <div className="flex items-center gap-3">
          {/* Botão de Alternância de Tema (Claro / Escuro) no topo da tela */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900/90 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-all shadow-sm flex items-center justify-center"
            title={isDark ? "Mudar para Tema Claro" : "Mudar para Tema Escuro"}
            aria-label="Alternar tema"
          >
            {isDark ? (
              <Sun size={17} className="text-amber-400 hover:rotate-45 transition-transform duration-300" />
            ) : (
              <Moon size={17} className="text-indigo-600 hover:-rotate-12 transition-transform duration-300" />
            )}
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              {/* User info - clicável para acessar o perfil */}
              <Link
                to="/perfil"
                className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900/90 border border-transparent hover:border-slate-200 dark:hover:border-slate-800 transition-all group cursor-pointer"
                title="Meu Perfil - Alterar informações pessoais"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 group-hover:border-brand-500/50 flex items-center justify-center text-slate-600 dark:text-slate-300 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors shadow-sm">
                  <User size={16} />
                </div>
                <div className="hidden sm:block text-right">
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors leading-tight">
                    {user.nome}
                  </p>
                  <span className={`inline-block text-[10px] font-medium uppercase tracking-wider ${
                    isRecruiter ? 'text-indigo-600 dark:text-indigo-400' : 'text-emerald-600 dark:text-emerald-400'
                  }`}>
                    {isRecruiter ? 'Recrutador' : 'Candidato'}
                  </span>
                </div>
              </Link>

              {/* Logout button */}
              <button
                onClick={handleLogout}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900/80 hover:bg-rose-500/10 border border-slate-200 dark:border-slate-800 hover:border-rose-500/30 text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-300 transition-colors shadow-sm"
                title="Sair da conta"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : location.pathname !== '/login' ? (
            <Link to="/login" className="btn-primary text-xs py-2 px-4">
              Entrar
            </Link>
          ) : null}
        </div>
      </div>
    </header>
  );
};