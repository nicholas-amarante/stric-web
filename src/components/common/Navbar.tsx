import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Bot, 
  Briefcase, 
  LayoutDashboard, 
  LogOut, 
  Sparkles,
  User
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isRecruiter, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-brand-500/25 group-hover:scale-105 transition-transform">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-brand-300 bg-clip-text text-transparent">
                  STRIC
                </span>
                <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30">
                  <Sparkles size={10} /> IA
                </span>
              </div>
              <p className="text-[10px] text-slate-400 -mt-0.5 hidden sm:block">
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
                  ? 'bg-slate-850 text-white border border-slate-700/60'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
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
                    ? 'bg-brand-500/20 text-brand-200 border border-brand-500/30'
                    : 'text-slate-400 hover:text-brand-300 hover:bg-slate-900'
                }`}
              >
                <LayoutDashboard size={16} />
                Painel do Recrutador
              </Link>
            )}
          </nav>
        </div>

        {/* Right side: User Profile & Actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              {/* User info - clicável para acessar o perfil */}
              <Link
                to="/perfil"
                className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-900/90 border border-transparent hover:border-slate-800 transition-all group cursor-pointer"
                title="Meu Perfil - Alterar informações pessoais"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 group-hover:border-brand-500/50 flex items-center justify-center text-slate-300 group-hover:text-brand-400 transition-colors shadow-sm">
                  <User size={16} />
                </div>
                <div className="hidden sm:block text-right">
                  <p className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors leading-tight">
                    {user.nome}
                  </p>
                  <span className={`inline-block text-[10px] font-medium uppercase tracking-wider ${
                    isRecruiter ? 'text-indigo-400' : 'text-emerald-400'
                  }`}>
                    {isRecruiter ? 'Recrutador' : 'Candidato'}
                  </span>
                </div>
              </Link>

              {/* Logout button */}
              <button
                onClick={handleLogout}
                className="p-2 rounded-xl bg-slate-900/80 hover:bg-rose-500/10 border border-slate-800 hover:border-rose-500/30 text-slate-400 hover:text-rose-300 transition-colors"
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

