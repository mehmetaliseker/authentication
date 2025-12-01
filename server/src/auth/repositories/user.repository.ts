import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { IUser, IUserRepository } from '../interfaces/user.interface';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly databaseService: DatabaseService) { }

  async findByEmail(email: string): Promise<IUser | null> {
    const query = `
      SELECT id, first_name, last_name, email, password_hash, birth_date, country, is_verified, 
             verification_token, failed_attempts, account_locked, 
             last_login, last_active, locked_until, firebase_uid, created_at, updated_at
      FROM users 
      WHERE email = $1
    `;

    const result = await this.databaseService.query(query, [email]);
    return result.rows[0] || null;
  }

  async findById(id: number): Promise<IUser | null> {
    const query = `
      SELECT id, first_name, last_name, email, password_hash, birth_date, country, is_verified, 
             verification_token, failed_attempts, account_locked, 
             last_login, last_active, locked_until, firebase_uid, created_at, updated_at
      FROM users 
      WHERE id = $1
    `;

    const result = await this.databaseService.query(query, [id]);
    return result.rows[0] || null;
  }

  async create(userData: Partial<IUser>): Promise<IUser> {
    const query = `
      INSERT INTO users (first_name, last_name, email, password_hash, birth_date, country, is_verified, verification_token, firebase_uid)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id, first_name, last_name, email, password_hash, birth_date, country, is_verified, 
                verification_token, failed_attempts, account_locked, 
                last_login, last_active, locked_until, firebase_uid, created_at, updated_at
    `;

    const values = [
      userData.first_name || '',
      userData.last_name || '',
      userData.email,
      userData.password_hash !== undefined ? userData.password_hash : null,
      userData.birth_date || null,
      userData.country || null,
      userData.is_verified || false,
      userData.verification_token || null,
      userData.firebase_uid || null
    ];

    const result = await this.databaseService.query(query, values);
    return result.rows[0];
  }

  async update(id: number, userData: Partial<IUser>): Promise<IUser> {
    const fields: string[] = [];
    const values: (string | number | boolean | Date | null)[] = [];
    let paramIndex = 1;

    Object.keys(userData).forEach((key) => {
      const value = userData[key as keyof IUser];
      if (value !== undefined) {
        fields.push(`${key} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
    });

    if (fields.length === 0) {
      throw new Error('Güncellenecek alan bulunamadı');
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `
      UPDATE users 
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING id, first_name, last_name, email, password_hash, birth_date, country, is_verified, 
                verification_token, failed_attempts, account_locked, 
                last_login, last_active, locked_until, firebase_uid, created_at, updated_at
    `;

    const result = await this.databaseService.query(query, values);
    return result.rows[0];
  }


  async delete(id: number): Promise<boolean> {
    const query = 'DELETE FROM users WHERE id = $1';
    const result = await this.databaseService.query(query, [id]);
    return result.rowCount > 0;
  }

  async updateLastLogin(id: number): Promise<void> {
    const query = `
      UPDATE users 
      SET last_login = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
    `;
    await this.databaseService.query(query, [id]);
  }

  async updateLastActive(id: number): Promise<void> {
    const query = `
      UPDATE users 
      SET last_active = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
    `;
    await this.databaseService.query(query, [id]);
  }

  async updateFailedAttempts(id: number, attempts: number, locked?: boolean, lockedUntil?: Date): Promise<void> {
    const query = `
      UPDATE users 
      SET failed_attempts = $2, account_locked = $3, locked_until = $4, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
    `;
    await this.databaseService.query(query, [id, attempts, locked || false, lockedUntil || null]);
  }

  async getPasswordHistory(userId: number): Promise<string[]> {
    const query = `
      SELECT password_hash 
      FROM password_history 
      WHERE user_id = $1 
      ORDER BY created_at DESC 
      LIMIT 3
    `;

    const result = await this.databaseService.query(query, [userId]);
    return result.rows.map(row => row.password_hash);
  }

  async addPasswordToHistory(userId: number, passwordHash: string): Promise<void> {
    const query = `
      INSERT INTO password_history (user_id, password_hash, created_at)
      VALUES ($1, $2, CURRENT_TIMESTAMP)
    `;
    await this.databaseService.query(query, [userId, passwordHash]);
  }
}
