import React from 'react';
import { Vaga, Candidatura } from '../../types';
import { Clock, CheckCircle2, Star, ArrowRight } from 'lucide-react';

interface JobCardProps {
  vaga: Vaga;
  onApply: (vaga: Vaga) => void;
  appliedApplications?: Candidatura[];
}

export const JobCard: React.FC<JobCardProps> = ({ vaga, onApply, appliedApplications = [] }) => {
  const hasApplied = appliedApplications.length > 0;
  const latestApplication = hasApplied ? appliedApplications[0] : null;

  return (
    <div className="glass-card p-6 flex flex-col justify-between border border-slate-200 dark:border-slate-800 hover:border-blue-400 hover:shadow-md transition-all duration-300 group">
      <div>
        {/* Header: Title & Experience Badge */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
            {vaga.titulo}
          </h3>
          <span className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 shadow-sm">
            <Clock size={13} className="text-blue-600" />
            {(() => {
              const exp = vaga.tempoMinimoExperienciaAnos ?? vaga.tempoExperienciaAnos ?? 0;
              return <>Min. {exp} {exp === 1 ? 'ano' : 'anos'}</>;
            })()}
          </span>
        </div>

        {/* Mensagem informativa se já foi feita candidatura anterior */}
        {hasApplied && (
          <div className="mb-4 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300 animate-fadeIn">
            <div className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>
                Você já se candidatou a esta vaga ({appliedApplications.length} {appliedApplications.length === 1 ? 'candidatura registrada' : 'candidaturas registradas'})
              </span>
            </div>
            {latestApplication && (
              <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 shrink-0">
                {latestApplication.status === 'EM_ANALISE' && 'Em Análise'}
                {latestApplication.status === 'CONCLUIDO' && 'Concluída'}
                {latestApplication.status === 'SELECIONADO_ENTREVISTA' && 'Entrevista'}
                {latestApplication.status === 'REJEITADO' && 'Finalizada'}
                {latestApplication.status === 'ERRO_PROCESSAMENTO' && 'Erro'}
              </span>
            )}
          </div>
        )}

        {/* Description */}
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-5 line-clamp-3 leading-relaxed">
          {vaga.descricao}
        </p>

        {/* Requisitos Obrigatórios */}
        <div className="mb-4">
          <div className="flex items-center gap-1.5 mb-2">
            <CheckCircle2 size={14} className="text-blue-600" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Requisitos Obrigatórios
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {vaga.requisitosObrigatorios.map((req, index) => (
              <span
                key={index}
                className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
              >
                {req}
              </span>
            ))}
          </div>
        </div>

        {/* Requisitos Desejáveis */}
        {vaga.requisitosDesejaveis && vaga.requisitosDesejaveis.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-1.5 mb-2">
              <Star size={14} className="text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Desejáveis
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {vaga.requisitosDesejaveis.map((req, index) => (
                <span
                  key={index}
                  className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20"
                >
                  {req}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer action */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between mt-auto">
        <span className="text-xs text-slate-500">
          Status: <span className="text-emerald-600 dark:text-emerald-400 font-medium">Inscrições Abertas</span>
        </span>

        <button
          type="button"
          onClick={() => onApply(vaga)}
          className="btn-primary text-xs py-2 px-4 group/btn"
        >
          <span>{hasApplied ? 'Nova Candidatura' : 'Candidatar-se'}</span>
          <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
