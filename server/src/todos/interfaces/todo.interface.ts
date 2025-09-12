export interface Todo {
  id: number;
  user_id: number;
  title: string;
  description?: string;
  status: 'pending' | 'completed' | 'deleted';
  created_at: Date;
  updated_at: Date;
  completed_at?: Date;
  deleted_at?: Date;
}

export interface CreateTodoDto {
  title: string;
  description?: string;
}

export interface UpdateTodoDto {
  title?: string;
  description?: string;
  status?: 'pending' | 'completed' | 'deleted';
}

export interface TodoFilter {
  status?: 'all' | 'pending' | 'completed' | 'deleted';
  user_id: number;
}

