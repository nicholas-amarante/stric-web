import React, { useState, useRef, ChangeEvent, DragEvent } from 'react';
import { Vaga, Candidatura } from '../../types';
import { candidaturaService } from '../../services/candidaturaService';
import { useCandidaturaPolling } from '../../hooks/useCandidaturaPolling';
import { BadgeScore } from '../common/BadgeScore';
import { 
  X, 
  UploadCloud, 
  FileText, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles, 
  RefreshCw, 
  Clock, 
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

interface ApplicationModalProps {
  vaga: Vaga | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (candidatura: Candidatura) => void;
}

export const ApplicationModal: React.FC<ApplicationModalProps> = ({
  vaga,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [candidaturaId, setCandidaturaId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Hook com TanStack Query para polling automático a cada 3 segundos
  const { 
    candidatura, 
    isPolling, 
    isConcluido, 
    isErro, 
    error: pollingError 
  } = useCandidaturaPolling(candidaturaId);

  if (!isOpen || !vaga) return null;

  // Validação Client-side rigorosa: Apenas .pdf e tamanho <= 5MB
  const validateFile = (file: File): boolean => {
    setFileError(null);

    // 1. Validação de extensão
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setFileError('Formato inválido. Por favor, envie apenas arquivos no formato PDF (.pdf).');
      return false;
    }

    // 2. Validação de tamanho (5MB)
    const MAX_SIZE_BYTES = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE_BYTES) {
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      setFileError(`Arquivo muito grande (${fileSizeMB} MB). O tamanho máximo permitido é de 5MB.`);
      return false;
    }

    return true;
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (validateFile(file)) {
        setSelectedFile(file);
      } else {
        setSelectedFile(null);
      }
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (validateFile(file)) {
        setSelectedFile(file);
      } else {
        setSelectedFile(null);
      }
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile || !vaga) return;

    setIsSubmitting(true);
    setFileError(null);

    try {
      // Dispara envio via multipart/form-data
      // Backend responde com HTTP 202 com status: 'EM_ANALISE'
      const response = await candidaturaService.enviarCandidatura(vaga.id, selectedFile);
      
      // Inicia o Polling automático via TanStack Query
      setCandidaturaId(response.id);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha ao enviar currículo.';
      setFileError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setFileError(null);
    setCandidaturaId(null);
    setIsSubmitting(false);
  };

  const handleFinish = () => {
    if (candidatura && onSuccess) {
      onSuccess(candidatura);
    }
    handleReset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl border border-slate-700/80 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-400">
              Candidatura Online
            </span>
            <h2 className="text-lg font-bold text-white truncate max-w-md">
              {vaga.titulo}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* ESTADO 1: Form de Upload do Arquivo */}
          {!candidaturaId && (
            <div className="space-y-5">
              <div className="text-sm text-slate-300">
                Envie seu currículo atualizado em formato <strong className="text-white">PDF (máx. 5MB)</strong>. 
                Nossa Inteligência Artificial analisará a compatibilidade com a vaga em poucos segundos.
              </div>

              {/* Drag and drop zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 ${
                  isDragging
                    ? 'border-brand-400 bg-brand-500/10 scale-[1.01]'
                    : selectedFile
                    ? 'border-emerald-500/50 bg-emerald-500/5'
                    : 'border-slate-700 hover:border-brand-500/50 hover:bg-slate-900/60 bg-slate-950/40'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {selectedFile ? (
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 shadow-glow-emerald">
                      <FileText size={28} />
                    </div>
                    <p className="font-semibold text-white text-sm truncate max-w-xs">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-slate-400">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • PDF válido
                    </p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFile(null);
                      }}
                      className="text-xs text-rose-400 hover:text-rose-300 underline pt-1"
                    >
                      Trocar arquivo
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-brand-500/10 text-brand-400 flex items-center justify-center border border-brand-500/20">
                      <UploadCloud size={28} />
                    </div>
                    <div>
                      <p className="font-medium text-white text-sm">
                        Clique para selecionar ou arraste o arquivo aqui
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        Apenas arquivos PDF (máximo 5MB)
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Mensagem de Erro de Validação */}
              {fileError && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-rose-300 text-xs">
                  <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-400" />
                  <span>{fileError}</span>
                </div>
              )}

              {/* Checklist de requisitos resumidos */}
              <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800 space-y-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Requisitos Principais Avaliados pela IA:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {vaga.requisitosObrigatorios.map((req, idx) => (
                    <span key={idx} className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {req}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ESTADO 2: POLLING ATIVO (HTTP 202 recebido, status: EM_ANALISE) */}
          {candidaturaId && isPolling && (
            <div className="py-8 flex flex-col items-center text-center space-y-6 animate-fadeIn">
              <div className="relative">
                {/* Outer pulsing ring */}
                <div className="w-24 h-24 rounded-full bg-brand-500/20 animate-ping absolute inset-0"></div>
                {/* Main animated icon container */}
                <div className="relative w-24 h-24 rounded-full bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center shadow-glow">
                  <Sparkles size={38} className="text-white animate-spin-slow" />
                </div>
              </div>

              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/15 text-brand-300 border border-brand-500/30 mb-2">
                  <RefreshCw size={12} className="animate-spin" />
                  Polling Ativo (Atualizando a cada 3 segundos)
                </div>
                <h3 className="text-xl font-bold text-white">
                  Inteligência Artificial Analisando Currículo
                </h3>
                <p className="text-sm text-slate-400 max-w-sm mt-1">
                  Extraindo competências, comparando requisitos e calculando compatibilidade com a vaga...
                </p>
              </div>

              {/* Etapas de Análise */}
              <div className="w-full max-w-sm bg-slate-900/80 rounded-xl p-4 border border-slate-800 text-left space-y-2.5 text-xs">
                <div className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle2 size={14} />
                  <span>Upload recebido com sucesso (HTTP 202 Accepted)</span>
                </div>
                <div className="flex items-center gap-2 text-brand-300">
                  <RefreshCw size={14} className="animate-spin" />
                  <span>Extração segura de texto e validação anti-injection</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Clock size={14} />
                  <span>Cálculo do Score de Aderência e Resumo Executivo</span>
                </div>
              </div>
            </div>
          )}

          {/* ESTADO 3: CONCLUÍDO (Status: CONCLUIDO) */}
          {candidaturaId && isConcluido && candidatura?.analiseIA && (
            <div className="space-y-6 animate-fadeIn">
              {/* Header do Resultado */}
              <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-glow-emerald mx-auto">
                  <CheckCircle2 size={26} />
                </div>
                <h3 className="text-xl font-bold text-white">
                  Triagem Concluída com Sucesso!
                </h3>
                <p className="text-xs text-slate-400">
                  Confira a avaliação automática gerada pela nossa IA para o seu perfil.
                </p>
              </div>

              {/* Score de Aderência em Destaque */}
              <div className="bg-slate-900/80 rounded-2xl p-5 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Compatibilidade com a Vaga
                  </span>
                  <h4 className="text-sm font-medium text-slate-200 mt-0.5">
                    Score de Aderência Calculado
                  </h4>
                </div>
                <BadgeScore score={candidatura.analiseIA.scoreAderencia} size="lg" />
              </div>

              {/* Resumo Executivo */}
              <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800/80 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-300">
                  <Sparkles size={13} />
                  Resumo Executivo da IA
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {candidatura.analiseIA.resumoExecutivo}
                </p>
              </div>

              {/* Requisitos Atendidos */}
              {candidatura.analiseIA.requisitosAtendidos?.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400">
                    <CheckCircle2 size={13} />
                    Requisitos Atendidos
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {candidatura.analiseIA.requisitosAtendidos.map((req, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                      >
                        {req}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Pontos de Atenção */}
              {candidatura.analiseIA.pontosAtencao?.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400">
                    <AlertCircle size={13} />
                    Pontos de Atenção
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {candidatura.analiseIA.pontosAtencao.map((ponto, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20"
                      >
                        {ponto}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ESTADO 4: ERRO DE PROCESSAMENTO */}
          {(isErro || pollingError) && (
            <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-center space-y-3">
              <ShieldAlert size={36} className="text-rose-400 mx-auto" />
              <h4 className="text-base font-bold text-white">Falha no Processamento</h4>
              <p className="text-xs text-rose-300">
                Ocorreu uma inconsistência durante a extração ou análise do currículo. Verifique se o arquivo não possui senhas ou corrupção de cabeçalho.
              </p>
              <button
                type="button"
                onClick={handleReset}
                className="btn-secondary text-xs mt-2"
              >
                Tentar novamente
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-end gap-3">
          {!candidaturaId && (
            <>
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary text-xs"
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!selectedFile || isSubmitting}
                className="btn-primary text-xs"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    Enviando (multipart)...
                  </>
                ) : (
                  <>
                    <span>Enviar Currículo</span>
                    <ChevronRight size={14} />
                  </>
                )}
              </button>
            </>
          )}

          {candidaturaId && isConcluido && (
            <button
              type="button"
              onClick={handleFinish}
              className="btn-primary text-xs w-full sm:w-auto"
            >
              Concluir e Voltar às Vagas
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
