import React, { useState } from 'react';
import { Vaga, Candidatura } from '../../types';
import { JobCard } from './JobCard';
import { ApplicationModal } from './ApplicationModal';
import { Search, Filter, Briefcase, CheckCircle2 } from 'lucide-react';

interface JobListProps {
  vagas: Vaga[];
  isLoading: boolean;
}

export const JobList: React.FC<JobListProps> = ({ vagas, isLoading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [experienceFilter, setExperienceFilter] = useState<number | 'ALL'>('ALL');
  const [selectedJobForModal, setSelectedJobForModal] = useState<Vaga | null>(null);
  const [successNotification, setSuccessNotification] = useState<string | null>(null);

  // Filtragem de vagas
  const filteredVagas = vagas.filter((vaga) => {
    const matchesSearch = 
      vaga.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vaga.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vaga.requisitosObrigatorios.some(r => r.toLowerCase().includes(searchTerm.toLowerCase())) ||
      vaga.requisitosDesejaveis?.some(r => r.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesExp = 
      experienceFilter === 'ALL' || vaga.tempoExperienciaAnos <= experienceFilter;

    return matchesSearch && matchesExp;
  });

  const handleApplicationSuccess = (candidatura: Candidatura) => {
    setSuccessNotification(`Candidatura para "${selectedJobForModal?.titulo}" enviada com sucesso! Score IA: ${candidatura.analiseIA?.scoreAderencia || 0}%.`);
    setTimeout(() => setSuccessNotification(null), 6000);
  };

  return (
    <div className="space-y-8">
      {/* Toast Notification de Sucesso */}
      {successNotification && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 shadow-xl backdrop-blur-md flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 size={20} className="text-emerald-500 dark:text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-medium">{successNotification}</span>
        </div>
      )}

      {/* Barra de Filtros e Busca */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Input de Busca */}
        <div className="relative w-full md:w-96">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por cargo, tecnologia ou requisito..."
            className="glass-input pl-10 w-full text-sm"
          />
        </div>

        {/* Filtro de Experiência */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
            <Filter size={14} />
            <span>Experiência Máx.:</span>
          </div>
          <select
            value={experienceFilter}
            onChange={(e) => setExperienceFilter(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
            className="glass-input text-xs py-2 pr-8 bg-white dark:bg-slate-900"
          >
            <option value="ALL">Todas as experiências</option>
            <option value={1}>Até 1 ano (Júnior)</option>
            <option value={3}>Até 3 anos (Pleno)</option>
            <option value={5}>Até 5 anos (Sênior)</option>
            <option value={10}>5+ anos (Especialista/Lead)</option>
          </select>
        </div>
      </div>

      {/* Grid de Vagas */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="glass-panel p-6 rounded-2xl h-80 animate-pulse flex flex-col justify-between">
              <div className="space-y-3">
                <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-md w-3/4"></div>
                <div className="h-4 bg-slate-200/60 dark:bg-slate-800/60 rounded-md w-1/2"></div>
                <div className="h-16 bg-slate-200/40 dark:bg-slate-800/40 rounded-md w-full mt-4"></div>
              </div>
              <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl w-full"></div>
            </div>
          ))}
        </div>
      ) : filteredVagas.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVagas.map((vaga) => (
            <JobCard
              key={vaga.id}
              vaga={vaga}
              onApply={(v) => setSelectedJobForModal(v)}
            />
          ))}
        </div>
      ) : (
        <div className="glass-panel p-12 rounded-2xl text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center mx-auto text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-800 shadow-sm">
            <Briefcase size={32} />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">Nenhuma vaga encontrada</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
              Tente ajustar os termos de pesquisa ou remover os filtros de experiência selecionados.
            </p>
          </div>
        </div>
      )}

      {/* Modal de Candidatura com Polling */}
      <ApplicationModal
        vaga={selectedJobForModal}
        isOpen={!!selectedJobForModal}
        onClose={() => setSelectedJobForModal(null)}
        onSuccess={handleApplicationSuccess}
      />
    </div>
  );
};