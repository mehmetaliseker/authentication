import { Injectable } from '@nestjs/common';
import { TodosRepository } from '../repositories/todos.repository';
import { Todo, CreateTodoDto, UpdateTodoDto, TodoFilter } from '../interfaces/todo.interface';

@Injectable()
export class TodosService {
  constructor(private readonly todosRepository: TodosRepository) {}

  async create(userId: number, createTodoDto: CreateTodoDto): Promise<Todo> {
    return this.todosRepository.create(userId, createTodoDto);
  }

  async findAll(filter: TodoFilter): Promise<Todo[]> {
    return this.todosRepository.findAll(filter);
  }

  async findOne(id: number, userId: number): Promise<Todo | null> {
    return this.todosRepository.findOne(id, userId);
  }

  async update(id: number, userId: number, updateTodoDto: UpdateTodoDto): Promise<Todo | null> {
    return this.todosRepository.update(id, userId, updateTodoDto);
  }

  async remove(id: number, userId: number): Promise<boolean> {
    return this.todosRepository.remove(id, userId);
  }

  async toggleStatus(id: number, userId: number): Promise<Todo | null> {
    const todo = await this.todosRepository.findOne(id, userId);
    if (!todo) {
      return null;
    }

    const newStatus = todo.status === 'completed' ? 'pending' : 'completed';
    return this.todosRepository.update(id, userId, { status: newStatus });
  }

  async markCompleted(id: number, userId: number): Promise<Todo | null> {
    return this.todosRepository.markCompleted(id, userId);
  }

  async softDelete(id: number, userId: number): Promise<Todo | null> {
    return this.todosRepository.softDelete(id, userId);
  }

  async autoDeleteOldCompleted(): Promise<number> {
    return this.todosRepository.autoDeleteOldCompleted();
  }

  // Cron job için - 12 saat sonra completed olanları sil
  async cleanupOldCompleted(): Promise<void> {
    try {
      const deletedCount = await this.autoDeleteOldCompleted();
      console.log(`Cleaned up ${deletedCount} old completed todos`);
    } catch (error) {
      console.error('Error cleaning up old completed todos:', error);
    }
  }
}

