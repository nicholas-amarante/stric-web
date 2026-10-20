import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { candidaturaService } from '../services/candidaturaService';
import { Candidatura, StatusCandidatura } from '../types';
import { BadgeScore } from '../components/common/BadgeScore';
import { 
  FileText, 
  Briefcase, 
  Calendar, 
  Download, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ArrowRight,
  RefreshCw,
  Star,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

export const MyApplicationsPage: React.FC = () => {

  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const {
    data: candidaturas,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery<Candidatura[]>({
    queryKey: ['minhas-candidaturas'],
    queryFn: () => candidaturaService.listarMinhasCandidaturas(),
  });

  // Mapa para contar total de submissoes por vaga
  const vagaSubmissionsCount = React.useMemo(() => {
    const counts = new Map<string, number>();
    if (candidaturas && Array.isArray(candidaturas)) {
      candidaturas.forEach((c) => {
        const key = c.vaga?.id || c.vagaId || c.vaga?.titulo || c.vagaTitulo || 'vaga';
        counts.set(key, (counts.get(key) || 0) + 1);
      });
    }
    return counts;
  }, [candidaturas]);

  const handleDownload = async (candidaturaId: string, nomeArquivo?: string) => {
    try {
      setDownloadingId(candidaturaId);
      await candidaturaService.baixarCurriculo(candidaturaId, nomeArquivo);
    } catch (err) {
      console.error('Falha ao baixar currículo:', err);
      alert('Não foi possível realizar o download do currículo no momento.');
    } finally {
      setDownloadingId(null);
    }
  };

  const getStatusBadge = (status: StatusCandidatura) => {
    switch (status) {
      case 'EM_ANALISE':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/30">
            <RefreshCw size={12} className="animate-spin text-blue-600 dark:text-blue-400" />
            <span>Em Análise pela IA</span>
          </span>
        );
      case 'CONCLUIDO':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
            <CheckCircle2 size={13} className="text-emerald-600 dark:text-emerald-400" />
            <span>Triagem Concluída</span>
          </span>
        );
      case 'SELECIONADO_ENTREVISTA':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-500/40 shadow-sm animate-pulse">
            <Star size={13} className="text-indigo-600 dark:text-indigo-400 fill-indigo-500" />
            <span>Selecionado para Entrevista!</span>
          </span>
        );
      case 'REJEITADO':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-500/10 text-slate-700 dark:text-slate-300 border border-slate-500/30">
            <Clock size={13} className="text-slate-500" />
            <span>Processo Finalizado</span>
          </span>
        );
      case 'ERRO_PROCESSAMENTO':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/30">
            <AlertTriangle size={13} className="text-rose-600 dark:text-rose-400" />
            <span>Falha no Processamento</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            {status}
          </span>
        );
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Data não informada';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="py-8 space-y-8 animate-fadeIn">
      {/* Header Corporativo */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20 mb-3">
            <ShieldCheck size={14} className="text-blue-600" />
            <span>Área do Candidato</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Minhas Candidaturas
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Acompanhe o status em tempo real, os relatórios de compatibilidade técnica e as avaliações geradas por IA para as vagas às quais você se candidatou.
          </p>
        </div>

        <Link
          to="/vagas"
          className="btn-primary text-xs py-2.5 px-4 self-start md:self-auto shrink-0 inline-flex items-center gap-2"
        >
          <Briefcase size={16} />
          <span>Ver Mais Vagas</span>
        </Link>
      </div>

      {/* Estados da Página */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="glass-panel p-6 rounded-2xl animate-pulse space-y-4">
              <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
              <div className="h-4 bg-slate-200/60 dark:bg-slate-800/60 rounded w-1/4"></div>
              <div className="h-16 bg-slate-200/40 dark:bg-slate-800/40 rounded w-full"></div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="glass-panel p-8 rounded-2xl text-center space-y-4 border border-rose-500/20">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
            <AlertCircle size={24} />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Falha ao carregar suas candidaturas
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {(error as Error)?.message || 'Ocorreu um erro ao conectar com o servidor.'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            className="btn-primary text-xs py-2 px-4 inline-flex items-center gap-1.5"
          >
            <RefreshCw size={14} />
            <span>Tentar Novamente</span>
          </button>
        </div>
      ) : candidaturas && candidaturas.length > 0 ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
            <span>
              Total de candidaturas enviadas: <strong className="text-slate-900 dark:text-white">{candidaturas.length}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {candidaturas.map((cand) => {
              const tituloVaga = cand.vaga?.titulo || cand.vagaTitulo || 'Vaga de Emprego';
              const nomeArquivo = cand.nomeOriginalArquivo || cand.arquivoNomeOriginal || 'curriculo.pdf';
              const score = cand.analiseIA?.scoreAderencia ?? cand.scoreAderencia;
              const resumo = cand.analiseIA?.resumoExecutivo || cand.resumoExecutivo;
              const reqAtendidos = cand.analiseIA?.requisitosAtendidos || cand.requisitosAtendidos || [];
              const pontosAtencao = cand.analiseIA?.pontosAtencao || cand.pontosAtencao || [];
              const vagaKey = cand.vaga?.id || cand.vagaId || cand.vaga?.titulo || cand.vagaTitulo || 'vaga';
              const totalParaEstaVaga = vagaSubmissionsCount.get(vagaKey) || 1;

              return (
                <div
                  key={cand.id}
                  className="glass-card p-6 sm:p-7 rounded-2xl border border-slate-200/90 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500/50 hover:shadow-lg transition-all duration-300 space-y-6"
                >
                  {/* Cabeçalho do Card */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800/80">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <Briefcase size={16} className="text-blue-600 dark:text-blue-400 shrink-0" />
                        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                          {tituloVaga}
                        </h2>
                        {totalParaEstaVaga > 1 && (
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
                            Submissão individual ({totalParaEstaVaga} no total)
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <Calendar size={13} className="text-slate-400" />
                          Submetido em: <strong className="font-semibold text-slate-700 dark:text-slate-300">{formatDate(cand.dataSubmissao)}</strong>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-mono text-[11px]">
                          <FileText size={13} className="text-slate-400" />
                          {nomeArquivo}
                        </span>
                      </div>
                    </div>

                    <div className="self-start sm:self-auto shrink-0">
                      {getStatusBadge(cand.status)}
                    </div>
                  </div>

                  {/* Detalhes da Triagem por IA (quando concluído) */}
                  {cand.status === 'CONCLUIDO' || cand.status === 'SELECIONADO_ENTREVISTA' ? (
                    <div className="space-y-4">
                      {/* Score e Resumo */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {score !== undefined && score !== null && (
                          <div className="bg-slate-50 dark:bg-slate-900/80 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col justify-center items-center text-center space-y-2">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                              Compatibilidade IA
                            </span>
                            <BadgeScore score={score} size="lg" />
                          </div>
                        )}

                        <div className={score !== undefined && score !== null ? 'md:col-span-3' : 'md:col-span-4'}>
                          {resumo ? (
                            <div className="bg-blue-50/50 dark:bg-blue-950/20 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30 space-y-1.5 h-full">
                              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">
                                <Sparkles size={13} />
                                <span>Resumo Executivo da IA</span>
                              </div>
                              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                                {resumo}
                              </p>
                            </div>
                          ) : (
                            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-500">
                              Análise concluída com sucesso.
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Requisitos Atendidos & Pontos de Atenção */}
                      {(reqAtendidos.length > 0 || pontosAtencao.length > 0) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                          {reqAtendidos.length > 0 && (
                            <div className="space-y-1.5">
                              <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                                <CheckCircle2 size={12} />
                                Requisitos Atendidos ({reqAtendidos.length})
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {reqAtendidos.map((req, i) => (
                                  <span
                                    key={i}
                                    className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20"
                                  >
                                    {req}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {pontosAtencao.length > 0 && (
                            <div className="space-y-1.5">
                              <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1">
                                <AlertCircle size={12} />
                                Pontos de Atenção ({pontosAtencao.length})
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {pontosAtencao.map((ponto, i) => (
                                  <span
                                    key={i}
                                    className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/20"
                                  >
                                    {ponto}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : cand.status === 'EM_ANALISE' ? (
                    <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-3">
                      <RefreshCw size={18} className="animate-spin text-blue-600 shrink-0" />
                      <div className="text-xs">
                        <p className="font-semibold text-slate-800 dark:text-slate-200">
                          A IA está avaliando seu currículo em segundo plano
                        </p>
                        <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                          A extração de competências e o cálculo de aderência técnica levam geralmente de alguns segundos a um minuto.
                        </p>
                      </div>
                    </div>
                  ) : null}

                  {/* Rodapé com Download e Alertas */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="text-xs">
                      {cand.status === 'SELECIONADO_ENTREVISTA' && (
                        <span className="font-medium text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
                          <Star size={14} className="fill-indigo-500 text-indigo-600" />
                          Parabéns! Seus dados de contato foram liberados para o recrutador agendar a entrevista.
                        </span>
                      )}
                      {cand.status === 'EM_ANALISE' && (
                        <span className="text-slate-500">
                          Status: Processando pipeline assíncrono.
                        </span>
                      )}
                      {cand.status === 'CONCLUIDO' && (
                        <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                          Triagem concluída com sucesso. Aguardando decisão do recrutador.
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDownload(cand.id, nomeArquivo)}
                      disabled={downloadingId === cand.id}
                      className="btn-secondary text-xs py-2 px-3.5 inline-flex items-center gap-2 self-start sm:self-auto shrink-0"
                      title="Baixar cópia original do PDF enviado"
                    >
                      {downloadingId === cand.id ? (
                        <RefreshCw size={14} className="animate-spin" />
                      ) : (
                        <Download size={14} />
                      )}
                      <span>Baixar PDF Enviado</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Estado Vazio */
        <div className="glass-panel p-12 rounded-2xl text-center space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center mx-auto text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-800 shadow-sm">
            <FileText size={32} />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Nenhuma candidatura enviada ainda
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Você ainda não se candidatou a nenhuma vaga. Explore as oportunidades disponíveis e envie seu currículo para receber a avaliação imediata de IA.
            </p>
          </div>
          <div className="pt-2">
            <Link to="/vagas" className="btn-primary text-xs py-2.5 px-4 inline-flex items-center gap-1.5">
              <span>Explorar Vagas Abertas</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyApplicationsPage;
