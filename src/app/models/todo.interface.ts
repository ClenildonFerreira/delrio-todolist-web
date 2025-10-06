export type StatusTarefa = 'ABERTA' | 'EM_ANDAMENTO' | 'CONCLUIDA';

export interface TodoDTO {
  id?: number;
  title: string;
  description?: string;
  status?: StatusTarefa;
  priority?: number;
  createdAt?: string;
}
export interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}