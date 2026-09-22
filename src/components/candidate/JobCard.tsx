import React from 'react';
import { Vaga } from '../../types';
import { Clock, CheckCircle2, Star, ArrowRight } from 'lucide-react';

interface JobCardProps {
  vaga: Vaga;
  onApply: (vaga: Vaga) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ vaga, onApply }) => {
  return (
    <div className="glass-card p-6 flex flex-col justify-between border border-slate-200 dark:border-slate-800 hover:border-brand-500/50 hover:shadow-lg dark:hover:shadow-glow transition-all duration-300 group">
      <div>
        {/* Header: Title & Experience Badge */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-300 transition-colors">
            {vaga.titulo}
          </h3>
          <span className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 shadow-sm">
            <Clock size={13} className="text-brand-600 dark:text-brand-400" />
            Min. {vaga.tempoExperienciaAnos} {vaga.tempoExperienciaAnos === 1 ? 'ano' : 'anos'}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-5 line-clamp-3 leading-relaxed">
          {vaga.descricao}
        </p>

        {/* Requisitos Obrigatórios */}
        <div className="mb-4">
          <div className="flex items-center gap-1.5 mb-2">
            <CheckCircle2 size={14} className="text-brand-600 dark:text-brand-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Requisitos Obrigatórios
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {vaga.requisitosObrigatorios.map((req, index) => (
              <span
                key={index}
                className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-brand-500/10 text-brand-700 dark:text-brand-300 border border-brand-500/20"
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
          onClick={() => onApply(vaga)}
          className="btn-primary text-xs py-2 px-4 group/btn"
        >
          <span>Candidatar-se</span>
          <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};