import React, { useState } from 'react';
import { Candidatura } from '../../types';
import { candidaturaService } from '../../services/candidaturaService';
import { BadgeScore } from '../common/BadgeScore';
import { 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  Mail, 
  Phone, 
  Sparkles, 
  GraduationCap, 
  Briefcase, 
  Calendar, 
  Eye, 
  Lock, 
  Unlock, 
  CheckCheck,
  Loader2
} from 'lucide-react';

interface CandidateCardProps {
  candidatura: Candidatura;
  onStatusUpdated?: (candidaturaAtualizada: Candidatura) => void;
}

export const CandidateCard: React.FC<CandidateCardProps> = ({ 
  candidatura: initialCandidatura,
  onStatusUpdated 
}) => {
  const [candidatura, setCandidatura] = useState<Candidatura>(initialCandidatura);
  const [isSelecting, setIsSelecting] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const isInterviewSelected = candidatura.status === 'SELECIONADO_ENTREVISTA';
  const score = candidatura.analiseIA?.scoreAderencia ?? 0;

  // Lógica LGPD: Se o status for SELECIONADO_ENTREVISTA, os contatos foram revelados
  const emailExibido = isInterviewSelected 
    ? (candidatura.emailCompleto || candidatura.analiseIA?.dadosExtraidos.emailIdentificado || candidatura.candidatoEmailMascarado)
    : (candidatura.candidatoEmailMascarado || 'e****@*****.com');

  const telefoneExibido = isInterviewSelected 
    ? (candidatura.telefoneCompleto || candidatura.analiseIA?.dadosExtraidos.telefoneIdentificado || candidatura.candidatoTelefoneMascarado)
    : (candidatura.candidatoTelefoneMascarado || '(11) 9****-**00');

  // Ação "Selecionar para Entrevista" - Atualiza status e revela contatos
  const handleSelectForInterview = async () => {
    setIsSelecting(true);
    try {
      const updated = await candidaturaService.selecionarParaEntrevista(candidatura.id);
      setCandidatura(updated);
      if (onStatusUpdated) {
        onStatusUpdated(updated);
      }
    } catch (error) {
      console.error('Erro ao selecionar para entrevista:', error);
    } finally {
      setIsSelecting(false);
    }
  };

  const handleDownloadCV = async () => {
    setIsDownloading(true);
    try {
      await candidaturaService.baixarCurriculo(
        candidatura.id, 
        candidatura.arquivoNomeOriginal || `curriculo-${candidatura.candidatoNome}.pdf`
      );
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className={`glass-card p-6 border transition-all duration-300 ${
      isInterviewSelected 
        ? 'border-emerald-500/50 bg-emerald-50/40 dark:bg-slate-900/90 shadow-sm dark:shadow-glow-emerald' 
        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white/70 dark:bg-slate-900/70'
    }`}>
      {/* Top Bar: Candidato Nome, Status & Score Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center font-bold text-base text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 shadow-sm">
            {candidatura.candidatoNome?.charAt(0) || 'C'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                {candidatura.candidatoNome || 'Candidato'}
              </h4>
              {isInterviewSelected && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                  <CheckCheck size={12} />
                  Selecionado para Entrevista
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              <Calendar size={12} />
              <span>Inscrito em: {new Date(candidatura.dataSubmissao).toLocaleDateString('pt-BR')}</span>
            </div>
          </div>
        </div>

        {/* Badge Colorido de Score */}
        <div className="flex items-center gap-3">
          <BadgeScore score={score} size="lg" />
        </div>
      </div>

      {/* Seção Central: Resumo Executivo da IA & Dados Extraídos */}
      <div className="py-4 space-y-4">
        {/* Resumo Executivo da IA */}
        <div className="bg-slate-50 dark:bg-slate-950/60 rounded-xl p-4 border border-slate-200 dark:border-slate-800/80 space-y-1.5 shadow-sm">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-300">
            <Sparkles size={13} />
            Resumo Executivo da IA
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            {candidatura.analiseIA?.resumoExecutivo || 'Análise da IA pendente ou em processamento...'}
          </p>
        </div>

        {/* Dados Extraídos (Formação e Anos de Experiência) */}
        {candidatura.analiseIA?.dadosExtraidos && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800/60 text-slate-700 dark:text-slate-300">
              <GraduationCap size={15} className="text-brand-600 dark:text-brand-400 shrink-0" />
              <span className="truncate">
                {candidatura.analiseIA.dadosExtraidos.nivelFormacao || 'Formação não identificada'}
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800/60 text-slate-700 dark:text-slate-300">
              <Briefcase size={15} className="text-brand-600 dark:text-brand-400 shrink-0" />
              <span>
                {candidatura.analiseIA.dadosExtraidos.tempoExperienciaAnos} anos de experiência detectados
              </span>
            </div>
          </div>
        )}

        {/* Requisitos Atendidos (Badges Verdes) */}
        {candidatura.analiseIA?.requisitosAtendidos && candidatura.analiseIA.requisitosAtendidos.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1.5">
              <CheckCircle2 size={13} />
              Requisitos Atendidos
            </div>
            <div className="flex flex-wrap gap-1.5">
              {candidatura.analiseIA.requisitosAtendidos.map((req, i) => (
                <span
                  key={i}
                  className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20"
                >
                  {req}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Pontos de Atenção (Badges Âmbar/Vermelho) */}
        {candidatura.analiseIA?.pontosAtencao && candidatura.analiseIA.pontosAtencao.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-1.5">
              <AlertCircle size={13} />
              Pontos de Atenção / Lacunas Identificadas
            </div>
            <div className="flex flex-wrap gap-1.5">
              {candidatura.analiseIA.pontosAtencao.map((ponto, i) => (
                <span
                  key={i}
                  className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20"
                >
                  {ponto}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Seção LGPD & Ações */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Contatos Mascarados / Revelados */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            {isInterviewSelected ? (
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                <Unlock size={12} /> Contato Revelado (LGPD):
              </span>
            ) : (
              <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                <Lock size={12} /> Dados Mascarados (LGPD):
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className={`inline-flex items-center gap-1.5 font-mono ${
              isInterviewSelected ? 'text-slate-900 dark:text-white font-medium' : 'text-slate-500 dark:text-slate-400'
            }`}>
              <Mail size={12} className="text-slate-400 dark:text-slate-500" />
              {emailExibido}
            </span>
            <span className={`inline-flex items-center gap-1.5 font-mono ${
              isInterviewSelected ? 'text-slate-900 dark:text-white font-medium' : 'text-slate-500 dark:text-slate-400'
            }`}>
              <Phone size={12} className="text-slate-400 dark:text-slate-500" />
              {telefoneExibido}
            </span>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex items-center gap-2">
          {/* Download do PDF original */}
          <button
            onClick={handleDownloadCV}
            disabled={isDownloading}
            className="btn-secondary text-xs py-2 px-3"
            title="Baixar currículo original em PDF"
          >
            {isDownloading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Download size={14} />
            )}
            <span className="hidden sm:inline">Download PDF</span>
          </button>

          {/* Botão Selecionar para Entrevista */}
          {!isInterviewSelected ? (
            <button
              onClick={handleSelectForInterview}
              disabled={isSelecting}
              className="btn-primary text-xs py-2 px-3"
            >
              {isSelecting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Atualizando...
                </>
              ) : (
                <>
                  <Eye size={14} />
                  <span>Selecionar para Entrevista</span>
                </>
              )}
            </button>
          ) : (
            <span className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
              <CheckCheck size={14} />
              Entrevista Agendada
            </span>
          )}
        </div>
      </div>
    </div>
  );
};