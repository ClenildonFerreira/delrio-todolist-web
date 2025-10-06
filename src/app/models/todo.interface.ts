export interface TodoDTO {
  id?: number;
  title: string;
  description?: string;
  status: boolean;
  priority: number;
  createdAt?: Date;
}

export interface CreateTodoDTO {
  title: string;
  description?: string;
  status?: boolean;
  priority?: number;
}