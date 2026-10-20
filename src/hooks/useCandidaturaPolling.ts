import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { candidaturaService } from '../services/candidaturaService';
import { Candidatura } from '../types';

export function useCandidaturaPolling(candidaturaId: string | null) {
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isTimeout, setIsTimeout] = useState<boolean>(false);

  // Reinicia o cronômetro ao receber um novo candidaturaId
  useEffect(() => {
    if (candidaturaId) {
      setStartTime(Date.now());
      setIsTimeout(false);
    } else {
      setStartTime(null);
      setIsTimeout(false);
    }
  }, [candidaturaId]);

  const query = useQuery<Candidatura, Error>({
    queryKey: ['candidatura', candidaturaId],
    queryFn: () => {
      if (!candidaturaId) throw new Error('ID de candidatura inválido.');
      return candidaturaService.consultarCandidatura(candidaturaId);
    },
    enabled: !!candidaturaId && !isTimeout,
    retry: 2,
    // Polling inteligente: consulta a cada 3000ms enquanto em EM_ANALISE (máx 3 minutos)
    refetchInterval: (queryState) => {
      const data = queryState.state.data;
      if (isTimeout) return false;
      if (startTime && Date.now() - startTime > 180000) {
        setIsTimeout(true);
        return false;
      }
      if (!data) return 3000;
      return data.status === 'EM_ANALISE' ? 3000 : false;
    },
    refetchIntervalInBackground: true,
  });

  const isPolling = !!candidaturaId && query.data?.status === 'EM_ANALISE' && !isTimeout;
  const isConcluido = query.data?.status === 'CONCLUIDO' || query.data?.status === 'SELECIONADO_ENTREVISTA';
  const isErro = query.data?.status === 'ERRO_PROCESSAMENTO' || isTimeout || query.isError;

  return {
    candidatura: query.data,
    isLoading: query.isLoading,
    isPolling,
    isConcluido,
    isErro,
    error: isTimeout ? new Error('O processamento da IA está demorando mais do que o esperado. Você pode acompanhar o status pela página Minhas Candidaturas.') : query.error,
    refetch: query.refetch,
  };
}
