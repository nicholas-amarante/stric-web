import React, { useState, useEffect } from 'react';
import { Vaga, Candidatura } from '../../types';
import { vagaService } from '../../services/vagaService';
import { CandidateRanking } from './CandidateRanking';
import { CreateJobModal } from './CreateJobModal';
import { 
  Plus, 
  Briefcase, 
  Users, 
  Sparkles, 
  Clock, 
  Layers, 
  ChevronRight,
  TrendingUp
} from 'lucide-react';

interface RecruiterDashboardProps {
  initialVagas: Vaga[];
}

export const RecruiterDashboard: React.FC<RecruiterDashboardProps> = ({ 
  initialVagas 
}) => {
  const [vagas, setVagas] = useState<Vaga[]>(initialVagas);
  const [selectedVagaId, setSelectedVagaId] = useState<string>(
    initialVagas.length > 0 ? initialVagas[0].id : ''
  );
  const [candidaturas, setCandidaturas] = useState<Candidatura[]>([]);
  const [isLoadingCandidaturas, setIsLoadingCandidaturas] = useState<boolean>(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

  // Vaga atualmente selecionada
  const selectedVaga = vagas.find(v => v.id === selectedVagaId);

  // Carrega candidatos sempre que a vaga selecionada muda
  useEffect(() => {
    if (!selectedVagaId) return;

    let isMounted = true;
    setIsLoadingCandidaturas(true);

    vagaService.listarCandidaturasPorVaga(selectedVagaId)
      .then((data) => {
        if (isMounted) {
          setCandidaturas(data);
        }
      })
      .catch((err) => {
        console.error('Erro ao carregar candidatos da vaga:', err);
      })
      .finally(() => {
        if (isMounted) {
          setIsLoadingCandidaturas(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [selectedVagaId]);

  const handleJobCreated = (novaVaga: Vaga) => {
    setVagas([novaVaga, ...vagas]);
    setSelectedVagaId(novaVaga.id);
  };

  const handleCandidaturaUpdated = (candidaturaAtualizada: Candidatura) => {
    setCandidaturas(prev => 
      prev.map(c => c.id === candidaturaAtualizada.id ? candidaturaAtualizada : c)
    );
  };

  return (
    <div className="space-y-8">
      {/* Top Banner: Métricas Gerais & Botão Criar Vaga */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl relative overflow-hidden border border-slate-200/80 dark:border-slate-800">
        <div className="absolute right-0 top-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/15 text-brand-600 dark:text-brand-300 border border-brand-500/30 mb-3">
              <Sparkles size={13} />
              Painel de Triagem Automatizada
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Gestão de Vagas & Triagem com IA
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-xl leading-relaxed">
              Acompanhe o ranking de compatibilidade dos currículos submetidos, visualize resumos executivos e selecione os melhores talentos em conformidade com a LGPD.
            </p>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="btn-primary text-sm py-3 px-6 shadow-glow shrink-0"
          >
            <Plus size={18} />
            <span>Criar Nova Vaga</span>
          </button>
        </div>

        {/* Resumo de Indicadores Rápidos */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-slate-200 dark:border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-brand-600 dark:text-brand-400 border border-slate-200 dark:border-slate-700 shadow-sm">
              <Briefcase size={20} />
            </div>
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Vagas Abertas</span>
              <p className="text-lg font-bold text-slate-900 dark:text-white">{vagas.length}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-emerald-600 dark:text-emerald-400 border border-slate-200 dark:border-slate-700 shadow-sm">
              <Users size={20} />
            </div>
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Candidatos nesta Vaga</span>
              <p className="text-lg font-bold text-slate-900 dark:text-white">{candidaturas.length}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-indigo-600 dark:text-indigo-400 border border-slate-200 dark:border-slate-700 shadow-sm">
              <TrendingUp size={20} />
            </div>
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Aderência Média</span>
              <p className="text-lg font-bold text-slate-900 dark:text-white">
                {candidaturas.length > 0
                  ? Math.round(
                      candidaturas.reduce((acc, curr) => acc + (curr.analiseIA?.scoreAderencia || 0), 0) /
                        candidaturas.length
                    )
                  : 0}
                %
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Seletor de Vagas em Formato de Abas / Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            <Layers size={14} />
            <span>Selecione a Vaga para Visualizar Candidatos:</span>
          </div>
          <span className="text-xs text-slate-500">
            {vagas.length} {vagas.length === 1 ? 'vaga cadastrada' : 'vagas cadastradas'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {vagas.map((v) => {
            const isSelected = v.id === selectedVagaId;
            return (
              <button
                key={v.id}
                onClick={() => setSelectedVagaId(v.id)}
                className={`p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white dark:bg-slate-900 border-brand-500/60 shadow-md dark:shadow-glow'
                    : 'glass-card border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-brand-500/10 text-brand-700 dark:text-brand-300 border border-brand-500/20">
                      Vaga Ativa
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Clock size={11} /> {v.tempoExperienciaAnos} {v.tempoExperienciaAnos === 1 ? 'ano' : 'anos'}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">
                    {v.titulo}
                  </h4>
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-200 dark:border-slate-800/80 text-xs">
                  <span className="text-slate-500 dark:text-slate-400">
                    {v.requisitosObrigatorios.length} requisitos exigidos
                  </span>
                  <ChevronRight size={14} className={isSelected ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400 dark:text-slate-600'} />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Detalhes da Vaga Selecionada */}
      {selectedVaga && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
                Critérios de Avaliação Ativos
              </span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {selectedVaga.titulo}
              </h2>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 self-start sm:self-auto shadow-sm">
              Experiência mínima exigida: <strong>{selectedVaga.tempoExperienciaAnos} anos</strong>
            </span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {selectedVaga.descricao}
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <div>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5">
                Requisitos Obrigatórios:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedVaga.requisitosObrigatorios.map((req, idx) => (
                  <span key={idx} className="text-xs px-2.5 py-0.5 rounded-md bg-brand-500/10 text-brand-700 dark:text-brand-300 border border-brand-500/20">
                    {req}
                  </span>
                ))}
              </div>
            </div>

            {selectedVaga.requisitosDesejaveis && selectedVaga.requisitosDesejaveis.length > 0 && (
              <div>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5">
                  Requisitos Desejáveis:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedVaga.requisitosDesejaveis.map((req, idx) => (
                    <span key={idx} className="text-xs px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                      {req}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Ranking de Candidatos */}
      {isLoadingCandidaturas ? (
        <div className="glass-panel p-12 rounded-2xl flex flex-col items-center justify-center space-y-3">
          <div className="w-10 h-10 border-4 border-brand-500/30 border-t-brand-500 rounded-full animate-spin"></div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Carregando candidatos e análises da IA...</p>
        </div>
      ) : (
        <CandidateRanking
          candidaturas={candidaturas}
          onCandidaturaUpdated={handleCandidaturaUpdated}
        />
      )}

      {/* Modal Criar Vaga */}
      <CreateJobModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onJobCreated={handleJobCreated}
      />
    </div>
  );
};