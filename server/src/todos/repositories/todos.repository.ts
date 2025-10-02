import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { Todo, CreateTodoDto, UpdateTodoDto, TodoFilter } from '../interfaces/todo.interface';

@Injectable()
export class TodosRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(userId: number, createTodoDto: CreateTodoDto): Promise<Todo> {
    const query = `
      INSERT INTO todos (user_id, title, description)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const values = [userId, createTodoDto.title, createTodoDto.description || null];
    
    const result = await this.databaseService.query(query, values);
    return result.rows[0];
  }

  async findAll(filter: TodoFilter): Promise<Todo[]> {
    let query = 'SELECT * FROM todos WHERE user_id = $1';
    const values: any[] = [filter.user_id];
    let paramIndex = 2;

    if (filter.status && filter.status !== 'all') {
      query += ` AND status = $${paramIndex}`;
      values.push(filter.status);
      paramIndex++;
    }

    query += ' ORDER BY created_at DESC';

    const result = await this.databaseService.query(query, values);
    return result.rows;
  }

  async findOne(id: number, userId: number): Promise<Todo | null> {
    const query = 'SELECT * FROM todos WHERE id = $1 AND user_id = $2';
    const result = await this.databaseService.query(query, [id, userId]);
    return result.rows[0] || null;
  }

  async update(id: number, userId: number, updateTodoDto: UpdateTodoDto): Promise<Todo | null> {
    console.log('[TodosRepository.update] input:', { id, userId, update: updateTodoDto });
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (updateTodoDto.title !== undefined) {
      fields.push(`title = $${paramIndex}`);
      values.push(updateTodoDto.title);
      paramIndex++;
    }

    if (updateTodoDto.description !== undefined) {
      fields.push(`description = $${paramIndex}`);
      values.push(updateTodoDto.description);
      paramIndex++;
    }

    if (updateTodoDto.status !== undefined) {
      fields.push(`status = $${paramIndex}`);
      values.push(updateTodoDto.status);
      paramIndex++;

      // Status completed ise completed_at'i güncelle
      if (updateTodoDto.status === 'completed') {
        fields.push(`completed_at = CURRENT_TIMESTAMP`);
      } else if (updateTodoDto.status === 'deleted') {
        fields.push(`deleted_at = CURRENT_TIMESTAMP`);
      } else if (updateTodoDto.status === 'pending') {
        // pending'e geri alındığında zaman damgalarını temizle
        fields.push(`completed_at = NULL`);
        fields.push(`deleted_at = NULL`);
      }
    }

    if (fields.length === 0) {
      return this.findOne(id, userId);
    }

    const query = `
      UPDATE todos 
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex} AND user_id = $${paramIndex + 1}
      RETURNING *
    `;
    values.push(id, userId);

    console.log('[TodosRepository.update] query:', query.replace(/\s+/g, ' ').trim());
    console.log('[TodosRepository.update] values:', values);
    const result = await this.databaseService.query(query, values);
    console.log('[TodosRepository.update] rowCount:', result.rowCount, 'updatedRow:', result.rows?.[0]);
    return result.rows[0] || null;
  }

  async remove(id: number, userId: number): Promise<boolean> {
    const query = 'DELETE FROM todos WHERE id = $1 AND user_id = $2';
    const result = await this.databaseService.query(query, [id, userId]);
    return result.rowCount > 0;
  }

  async softDelete(id: number, userId: number): Promise<Todo | null> {
    return this.update(id, userId, { 
      status: 'deleted'
    });
  }

  async markCompleted(id: number, userId: number): Promise<Todo | null> {
    return this.update(id, userId, { 
      status: 'completed'
    });
  }

  async getCompletedOlderThan(hours: number): Promise<Todo[]> {
    const query = `
      SELECT * FROM todos 
      WHERE status = 'completed' 
      AND completed_at < NOW() - INTERVAL '${hours} hours'
    `;
    const result = await this.databaseService.query(query);
    return result.rows;
  }

  async autoDeleteOldCompleted(): Promise<number> {
    const query = `
      UPDATE todos 
      SET status = 'deleted', deleted_at = CURRENT_TIMESTAMP
      WHERE status = 'completed' 
      AND completed_at < NOW() - INTERVAL '12 hours'
      AND status != 'deleted'
      RETURNING id
    `;
    const result = await this.databaseService.query(query);
    return result.rowCount;
  }
}