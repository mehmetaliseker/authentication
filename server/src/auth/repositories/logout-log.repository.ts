import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { ILogoutLog, ILogoutLogRepository } from '../interfaces/user.interface';

@Injectable()
export class LogoutLogRepository implements ILogoutLogRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(logoutData: Partial<ILogoutLog>): Promise<ILogoutLog> {
    const query = `
      INSERT INTO logout_logs (user_id, logout_time, ip_address, user_agent, session_duration)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, user_id, logout_time, ip_address, user_agent, session_duration, created_at
    `;
    
    const values = [
      logoutData.user_id,
      logoutData.logout_time || new Date(),
      logoutData.ip_address || null,
      logoutData.user_agent || null,
      logoutData.session_duration || null
    ];
    
    const result = await this.databaseService.query(query, values);
    return result.rows[0];
  }

  async findByUserId(userId: number, limit: number = 10): Promise<ILogoutLog[]> {
    const query = `
      SELECT id, user_id, logout_time, ip_address, user_agent, session_duration, created_at
      FROM logout_logs 
      WHERE user_id = $1 
      ORDER BY logout_time DESC 
      LIMIT $2
    `;
    
    const result = await this.databaseService.query(query, [userId, limit]);
    return result.rows;
  }

  async getLastLoginTime(userId: number): Promise<Date | null> {
    const query = `
      SELECT last_login 
      FROM users 
      WHERE id = $1
    `;
    
    const result = await this.databaseService.query(query, [userId]);
    return result.rows[0]?.last_login || null;
  }
}
