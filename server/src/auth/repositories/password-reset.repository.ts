import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { IPasswordReset, IPasswordResetRepository } from '../interfaces/user.interface';

@Injectable()
export class PasswordResetRepository implements IPasswordResetRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(resetData: Partial<IPasswordReset>): Promise<IPasswordReset> {
    const query = `
      INSERT INTO password_resets (user_id, reset_token, expires_at, used)
      VALUES ($1, $2, $3, $4)
      RETURNING id, user_id, reset_token, expires_at, used, created_at
    `;
    
    const values = [
      resetData.user_id,
      resetData.reset_token,
      resetData.expires_at,
      resetData.used || false
    ];
    
    const result = await this.databaseService.query(query, values);
    return result.rows[0];
  }

  async findByToken(token: string): Promise<IPasswordReset | null> {
    const query = `
      SELECT pr.id, pr.user_id, pr.reset_token, pr.expires_at, pr.used, pr.created_at,
             u.email, u.first_name, u.last_name
      FROM password_resets pr
      JOIN users u ON pr.user_id = u.id
      WHERE pr.reset_token = $1
    `;
    
    const result = await this.databaseService.query(query, [token]);
    return result.rows[0] || null;
  }

  async markAsUsed(id: number): Promise<void> {
    const query = `
      UPDATE password_resets 
      SET used = true 
      WHERE id = $1
    `;
    await this.databaseService.query(query, [id]);
  }

  async deleteByUserId(userId: number): Promise<void> {
    const query = 'DELETE FROM password_resets WHERE user_id = $1';
    await this.databaseService.query(query, [userId]);
  }

  async deleteExpiredTokens(): Promise<void> {
    const query = 'DELETE FROM password_resets WHERE expires_at < CURRENT_TIMESTAMP';
    await this.databaseService.query(query);
  }
}
