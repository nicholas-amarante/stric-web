import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { vagaService } from '../../src/services/vagaService';
import { JobList } from '../components/candidate/JobList';
import { Sparkles, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

export const CandidateHomePage: React.FC = () => {
  const { data: vagas = [], isLoading } = useQuery({
    queryKey: ['vagas-abertas'],
    queryFn: () => vagaService.listarVagasAbertas(),
  });

  return (
    <div className="space-y-10 py-6">
      {/* Hero Banner */}
      <div className="glass-panel p-8 sm:p-12 rounded-3xl relative overflow-hidden border-slate-800">
        <div className="absolute right-0 top-0 w-96 h-96 bg-gradient-to-bl from-brand-600/20 via-indigo-600/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/15 text-brand-300 border border-brand-500/30">
            <Sparkles size={13} />
            Triagem Instantânea com Inteligência Artificial
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Encontre a vaga ideal e receba feedback em segundos.
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            Envie seu currículo em PDF e acompanhe a análise em tempo real. Nossa IA avalia seus pontos fortes, requisitos atendidos e calcula sua compatibilidade com transparência.
          </p>

          {/* Destaques */}
          <div className="flex flex-wrap gap-4 pt-4 text-xs font-medium text-slate-300">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span>Feedback transparente com Score</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap size={16} className="text-amber-400" />
              <span>Processamento assíncrono em segundos</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={16} className="text-brand-400" />
              <span>Privacidade e Proteção LGPD</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Vagas Abertas */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Oportunidades em Aberto
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Candidate-se enviando seu currículo em PDF (máx. 5MB)
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400">
            {vagas.length} {vagas.length === 1 ? 'vaga disponível' : 'vagas disponíveis'}
          </span>
        </div>

        <JobList vagas={vagas} isLoading={isLoading} />
      </section>
    </div>
  );
};
