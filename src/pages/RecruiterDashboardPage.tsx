import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { vagaService } from '../services/vagaService';
import { RecruiterDashboard } from '../components/recruiter/RecruiterDashboard';

export const RecruiterDashboardPage: React.FC = () => {
  const { data: vagas = [], isLoading } = useQuery({
    queryKey: ['vagas-recrutador'],
    queryFn: () => vagaService.listarMinhasVagas(),
  });

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <div className="w-10 h-10 border-4 border-brand-500/30 border-t-brand-500 rounded-full animate-spin"></div>
        <p className="text-xs text-slate-400">Carregando painel de vagas...</p>
      </div>
    );
  }

  return (
    <div className="py-6">
      <RecruiterDashboard initialVagas={vagas}/>
    </div>
  );
};
