import { useQuery } from '@tanstack/react-query';
import { candidaturaService } from '../services/candidaturaService';
import { Candidatura } from '../types';

export function useCandidaturaPolling(candidaturaId: string | null) {
  const query = useQuery<Candidatura, Error>({
    queryKey: ['candidatura', candidaturaId],
    queryFn: () => {
      if (!candidaturaId) throw new Error('ID de candidatura inválido.');
      return candidaturaService.consultarCandidatura(candidaturaId);
    },
    enabled: !!candidaturaId,
    // Polling inteligente: consulta a cada 3000ms (3 segundos) enquanto estiver em EM_ANALISE
    refetchInterval: (queryState) => {
      const data = queryState.state.data;
      if (!data) return 3000;
      return data.status === 'EM_ANALISE' ? 3000 : false;
    },
    refetchIntervalInBackground: true,
  });

  const isPolling = !!candidaturaId && query.data?.status === 'EM_ANALISE';
  const isConcluido = query.data?.status === 'CONCLUIDO' || query.data?.status === 'SELECIONADO_ENTREVISTA';
  const isErro = query.data?.status === 'ERRO_PROCESSAMENTO';

  return {
    candidatura: query.data,
    isLoading: query.isLoading,
    isPolling,
    isConcluido,
    isErro,
    error: query.error,
    refetch: query.refetch,
  };
}
