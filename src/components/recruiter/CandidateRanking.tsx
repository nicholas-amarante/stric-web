import React, { useState } from 'react';
import { Candidatura } from '../../types';
import { CandidateCard } from './CandidateCard';
import { Users, Sparkles, Filter } from 'lucide-react';

interface CandidateRankingProps {
  candidaturas: Candidatura[];
  onCandidaturaUpdated: (candidatura: Candidatura) => void;
}

export const CandidateRanking: React.FC<CandidateRankingProps> = ({
  candidaturas,
  onCandidaturaUpdated
}) => {
  const [filterScore, setFilterScore] = useState<'ALL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INTERVIEW'>('ALL');

  // Ordenação decrescente obrigatória por score_aderencia
  const sortedCandidaturas = [...candidaturas].sort((a, b) => {
    const scoreA = a.analiseIA?.scoreAderencia ?? 0;
    const scoreB = b.analiseIA?.scoreAderencia ?? 0;
    return scoreB - scoreA;
  });

  // Métricas do ranking
  const total = sortedCandidaturas.length;
  const highCount = sortedCandidaturas.filter(c => (c.analiseIA?.scoreAderencia ?? 0) >= 70).length;
  const mediumCount = sortedCandidaturas.filter(c => {
    const s = c.analiseIA?.scoreAderencia ?? 0;
    return s >= 50 && s < 70;
  }).length;
  const lowCount = sortedCandidaturas.filter(c => (c.analiseIA?.scoreAderencia ?? 0) < 50).length;
  const interviewCount = sortedCandidaturas.filter(c => c.status === 'SELECIONADO_ENTREVISTA').length;

  // Filtragem conforme seleção do recrutador
  const filteredCandidaturas = sortedCandidaturas.filter(c => {
    const score = c.analiseIA?.scoreAderencia ?? 0;
    if (filterScore === 'HIGH') return score >= 70;
    if (filterScore === 'MEDIUM') return score >= 50 && score < 70;
    if (filterScore === 'LOW') return score < 50;
    if (filterScore === 'INTERVIEW') return c.status === 'SELECIONADO_ENTREVISTA';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Barra de Métricas e Filtros Rápidos */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {/* Total */}
        <button
          onClick={() => setFilterScore('ALL')}
          className={`p-3.5 rounded-2xl border text-left transition-all ${
            filterScore === 'ALL'
              ? 'bg-brand-500/15 border-brand-500/50 shadow-glow'
              : 'glass-panel hover:bg-slate-900 border-slate-800'
          }`}
        >
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Total Triados
          </span>
          <span className="text-2xl font-extrabold text-white mt-1 block">{total}</span>
        </button>

        {/* Alta Aderência (>=70%) */}
        <button
          onClick={() => setFilterScore('HIGH')}
          className={`p-3.5 rounded-2xl border text-left transition-all ${
            filterScore === 'HIGH'
              ? 'bg-emerald-500/20 border-emerald-500/50 shadow-glow-emerald'
              : 'glass-panel hover:bg-slate-900 border-slate-800'
          }`}
        >
          <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider block">
            ≥ 70% Alta
          </span>
          <span className="text-2xl font-extrabold text-emerald-300 mt-1 block">{highCount}</span>
        </button>

        {/* Média Aderência (50-69%) */}
        <button
          onClick={() => setFilterScore('MEDIUM')}
          className={`p-3.5 rounded-2xl border text-left transition-all ${
            filterScore === 'MEDIUM'
              ? 'bg-amber-500/20 border-amber-500/50 shadow-glow-amber'
              : 'glass-panel hover:bg-slate-900 border-slate-800'
          }`}
        >
          <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider block">
            50-69% Média
          </span>
          <span className="text-2xl font-extrabold text-amber-300 mt-1 block">{mediumCount}</span>
        </button>

        {/* Baixa Aderência (<50%) */}
        <button
          onClick={() => setFilterScore('LOW')}
          className={`p-3.5 rounded-2xl border text-left transition-all ${
            filterScore === 'LOW'
              ? 'bg-rose-500/20 border-rose-500/50 shadow-glow-rose'
              : 'glass-panel hover:bg-slate-900 border-slate-800'
          }`}
        >
          <span className="text-[11px] font-semibold text-rose-400 uppercase tracking-wider block">
            &lt; 50% Baixa
          </span>
          <span className="text-2xl font-extrabold text-rose-300 mt-1 block">{lowCount}</span>
        </button>

        {/* Selecionados para Entrevista */}
        <button
          onClick={() => setFilterScore('INTERVIEW')}
          className={`col-span-2 sm:col-span-1 p-3.5 rounded-2xl border text-left transition-all ${
            filterScore === 'INTERVIEW'
              ? 'bg-indigo-500/20 border-indigo-500/50 shadow-glow'
              : 'glass-panel hover:bg-slate-900 border-slate-800'
          }`}
        >
          <span className="text-[11px] font-semibold text-indigo-300 uppercase tracking-wider block">
            Entrevistas
          </span>
          <span className="text-2xl font-extrabold text-indigo-200 mt-1 block">{interviewCount}</span>
        </button>
      </div>

      {/* Header do Ranking */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-brand-400" />
          <h3 className="text-base font-bold text-white">
            Ranking de Compatibilidade por IA
          </h3>
          <span className="text-xs text-slate-400 ml-1">
            (Ordenado por maior score de aderência)
          </span>
        </div>

        <div className="text-xs text-slate-400 flex items-center gap-1.5">
          <Filter size={13} />
          <span>Exibindo: <strong>{filteredCandidaturas.length}</strong> de {total}</span>
        </div>
      </div>

      {/* Lista de Candidatos Ordenados */}
      {filteredCandidaturas.length > 0 ? (
        <div className="space-y-4">
          {filteredCandidaturas.map((candidatura) => (
            <CandidateCard
              key={candidatura.id}
              candidatura={candidatura}
              onStatusUpdated={onCandidaturaUpdated}
            />
          ))}
        </div>
      ) : (
        <div className="glass-panel p-12 rounded-2xl text-center space-y-3">
          <Users size={32} className="text-slate-500 mx-auto" />
          <h4 className="text-base font-bold text-white">Nenhum candidato nesta faixa</h4>
          <p className="text-xs text-slate-400">
            Não foram encontradas candidaturas para o filtro selecionado.
          </p>
        </div>
      )}
    </div>
  );
};
