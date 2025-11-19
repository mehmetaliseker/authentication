import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { UserLoginLog, CreateUserLoginLogDto, LoginStatsDto } from '../interfaces/user-login-log.interface';

@Injectable()
export class UserLoginLogRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createDto: CreateUserLoginLogDto): Promise<UserLoginLog> {
    const query = `
      INSERT INTO user_login_logs (
        user_id, login_time, login_method, success
      ) VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    
    const values = [
      createDto.user_id,
      createDto.login_time || new Date(),
      createDto.login_method || 'email',
      createDto.success !== undefined ? createDto.success : true
    ];

    const result = await this.databaseService.query(query, values);
    return result.rows[0];
  }

  async findByUserId(userId: number, limit: number = 100): Promise<UserLoginLog[]> {
    const query = `
      SELECT * FROM user_login_logs 
      WHERE user_id = $1 
      ORDER BY login_time DESC 
      LIMIT $2
    `;
    
    const result = await this.databaseService.query(query, [userId, limit]);
    return result.rows;
  }

  async getLoginStats(userId: number, period: 'weekly' | 'monthly' | '6months' | 'yearly'): Promise<LoginStatsDto> {
    let dateFilter: string;
    let groupBy: string;
    let limitClause: string = '';
    
    switch (period) {
      case 'weekly':
        // Son 4 gün
        dateFilter = "login_time >= NOW() - INTERVAL '4 days'";
        groupBy = "DATE_TRUNC('day', login_time)";
        limitClause = "LIMIT 4";
        break;
      case 'monthly':
        // Son 4 hafta
        dateFilter = "login_time >= NOW() - INTERVAL '4 weeks'";
        groupBy = "DATE_TRUNC('week', login_time)";
        limitClause = "LIMIT 4";
        break;
      case '6months':
        // Son 4 ay
        dateFilter = "login_time >= NOW() - INTERVAL '4 months'";
        groupBy = "DATE_TRUNC('month', login_time)";
        limitClause = "LIMIT 4";
        break;
      case 'yearly':
        // Son 4 ay (yıllık da 4 ay göster)
        dateFilter = "login_time >= NOW() - INTERVAL '4 months'";
        groupBy = "DATE_TRUNC('month', login_time)";
        limitClause = "LIMIT 4";
        break;
    }

    const query = `
      SELECT 
        ${groupBy} as period,
        COUNT(*) as count
      FROM user_login_logs 
      WHERE user_id = $1 
        AND success = true 
        AND ${dateFilter}
      GROUP BY ${groupBy}
      ORDER BY period DESC
      ${limitClause}
    `;

    const result = await this.databaseService.query(query, [userId]);
    
    // Sonuçları ters çevir (en yeni tarih son sırada gelsin)
    const sortedRows = result.rows.reverse();
    
    return {
      period,
      data: sortedRows.map(row => ({
        period: row.period.toISOString(),
        count: parseInt(row.count)
      }))
    };
  }

  async getTotalLogins(userId: number): Promise<number> {
    const query = `
      SELECT COUNT(*) as total 
      FROM user_login_logs 
      WHERE user_id = $1 AND success = true
    `;
    
    const result = await this.databaseService.query(query, [userId]);
    return parseInt(result.rows[0].total);
  }

  async getLastLogin(userId: number): Promise<UserLoginLog | null> {
    const query = `
      SELECT * FROM user_login_logs 
      WHERE user_id = $1 AND success = true 
      ORDER BY login_time DESC 
      LIMIT 1
    `;
    
    const result = await this.databaseService.query(query, [userId]);
    return result.rows[0] || null;
  }

}
