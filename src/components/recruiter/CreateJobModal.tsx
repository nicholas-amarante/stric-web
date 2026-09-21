import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Vaga, CreateJobInput } from '../../types';
import { vagaService } from '../../services/vagaService';
import { TagInput } from '../common/TagInput';
import { X, Briefcase, Plus, Loader2 } from 'lucide-react';

const createJobSchema = z.object({
  titulo: z.string().min(5, 'O título deve ter pelo menos 5 caracteres.'),
  descricao: z.string().min(20, 'A descrição deve ter pelo menos 20 caracteres.'),
  tempoExperienciaAnos: z.coerce.number().min(0, 'Informe os anos de experiência (mínimo 0).'),
});

type FormData = z.infer<typeof createJobSchema>;

interface CreateJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJobCreated: (vaga: Vaga) => void;
}

export const CreateJobModal: React.FC<CreateJobModalProps> = ({
  isOpen,
  onClose,
  onJobCreated
}) => {
  const [requisitosObrigatorios, setRequisitosObrigatorios] = useState<string[]>([
    'Java 21 / Spring Boot',
    'React com TypeScript'
  ]);
  const [requisitosDesejaveis, setRequisitosDesejaveis] = useState<string[]>([
    'Tailwind CSS',
    'Docker'
  ]);
  const [reqError, setReqError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(createJobSchema),
    defaultValues: {
      titulo: '',
      descricao: '',
      tempoExperienciaAnos: 2,
    }
  });

  if (!isOpen) return null;

  const onSubmit = async (data: FormData) => {
    if (requisitosObrigatorios.length === 0) {
      setReqError('Adicione pelo menos 1 requisito obrigatório para orientar a IA.');
      return;
    }
    setReqError(null);
    setIsSubmitting(true);

    try {
      const payload: CreateJobInput = {
        titulo: data.titulo,
        descricao: data.descricao,
        tempoExperienciaAnos: data.tempoExperienciaAnos,
        requisitosObrigatorios,
        requisitosDesejaveis,
      };

      const novaVaga = await vagaService.criarVaga(payload);
      onJobCreated(novaVaga);
      reset();
      onClose();
    } catch (error) {
      console.error('Erro ao criar vaga:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl border border-slate-700/80 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20">
              <Briefcase size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Criar Nova Vaga</h2>
              <p className="text-xs text-slate-400">Defina os parâmetros que a IA usará na triagem</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 overflow-y-auto space-y-5">
          {/* Título da vaga */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Título da Posição *
            </label>
            <input
              type="text"
              placeholder="Ex: Engenheiro de Software Back-End Sênior"
              {...register('titulo')}
              className="glass-input w-full text-sm"
            />
            {errors.titulo && (
              <p className="text-xs text-rose-400 mt-1">{errors.titulo.message}</p>
            )}
          </div>

          {/* Tempo mínimo de experiência */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Tempo Mínimo de Experiência (em anos) *
            </label>
            <input
              type="number"
              min="0"
              max="30"
              {...register('tempoExperienciaAnos')}
              className="glass-input w-full text-sm"
            />
            {errors.tempoExperienciaAnos && (
              <p className="text-xs text-rose-400 mt-1">{errors.tempoExperienciaAnos.message}</p>
            )}
          </div>

          {/* Descrição detalhada */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Descrição Detalhada da Vaga *
            </label>
            <textarea
              rows={4}
              placeholder="Descreva as responsabilidades, contexto da equipe e desafios da posição..."
              {...register('descricao')}
              className="glass-input w-full text-sm resize-none"
            />
            {errors.descricao && (
              <p className="text-xs text-rose-400 mt-1">{errors.descricao.message}</p>
            )}
          </div>

          {/* Requisitos Obrigatórios (Tags) */}
          <TagInput
            label="Requisitos Obrigatórios (Avaliação Mandatória pela IA) *"
            tags={requisitosObrigatorios}
            onChange={(tags) => {
              setRequisitosObrigatorios(tags);
              if (tags.length > 0) setReqError(null);
            }}
            placeholder="Digite o requisito e aperte Enter..."
            badgeVariant="primary"
            error={reqError || undefined}
          />

          {/* Requisitos Desejáveis (Tags) */}
          <TagInput
            label="Requisitos Desejáveis (Diferenciais para o Score)"
            tags={requisitosDesejaveis}
            onChange={setRequisitosDesejaveis}
            placeholder="Ex: AWS, Docker, Spring AI..."
            badgeVariant="secondary"
          />

          {/* Footer actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary text-xs"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary text-xs"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Salvando Vaga...
                </>
              ) : (
                <>
                  <Plus size={15} />
                  Publicar Vaga
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
