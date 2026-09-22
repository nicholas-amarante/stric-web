import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/common/Navbar';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { CandidateHomePage } from './pages/CandidateHomePage';
import { RecruiterDashboardPage } from './pages/RecruiterDashboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { Bot, ShieldCheck, Heart } from 'lucide-react';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
        {/* Navbar Global com Toggle de Tema */}
        <Navbar />

        {/* Conteúdo Principal */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
          <Routes>
            {/* Rotas Públicas / Candidato */}
            <Route path="/" element={<CandidateHomePage />} />
            <Route path="/vagas" element={<CandidateHomePage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Rota Protegida: Informações Pessoais / Perfil */}
            <Route
              path="/perfil"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            {/* Rota Protegida: Apenas Recrutadores (ROLE_RECRUITER) */}
            <Route
              path="/recrutador"
              element={
                <ProtectedRoute allowedRoles={['ROLE_RECRUITER']}>
                  <RecruiterDashboardPage />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Footer com conformidade LGPD adaptável aos temas */}
        <footer className="border-t border-slate-200 dark:border-slate-900 bg-white/70 dark:bg-slate-950/60 py-8 mt-16 text-xs text-slate-500 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-brand-600/20 text-brand-600 dark:text-brand-400 flex items-center justify-center">
                <Bot size={14} />
              </div>
              <span className="font-semibold text-slate-700 dark:text-slate-400">STRIC</span>
              <span>— Sistema de Triagem e Resumo Inteligente de Currículos</span>
            </div>

            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                <ShieldCheck size={14} className="text-emerald-500 dark:text-emerald-400" />
                Conformidade LGPD & RBAC
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                Construído com <Heart size={12} className="text-rose-500 fill-rose-500" /> para Recrutamento Ágil
              </span>
            </div>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
};

export default App;