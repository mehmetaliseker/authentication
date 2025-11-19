import { Injectable } from '@nestjs/common';
import { Pool, PoolClient } from 'pg';

export interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

@Injectable()
export class DatabaseService {
  private pool: Pool;

  constructor() {
    const host = process.env.DB_HOST;
    const port = process.env.DB_PORT;
    const username = process.env.DB_USERNAME;
    const password = process.env.DB_PASSWORD;
    const database = process.env.DB_NAME || process.env.DB_DATABASE;

    if (!host || !port || !username || !password || !database) {
      throw new Error('Veritabanı yapılandırma bilgileri eksik. Lütfen .env dosyasını kontrol edin.');
    }

    const config: DatabaseConfig = {
      host,
      port: parseInt(port),
      username,
      password,
      database
    };

    console.log(' Veritabanı bağlantısı kuruluyor...');

    this.pool = new Pool({
      host: config.host,
      port: config.port,
      user: config.username,
      password: config.password,
      database: config.database,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
  }

  async query(text: string, params?: any[]): Promise<any> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(text, params);
      return result;
    } finally {
      client.release();
    }
  }

  async getClient(): Promise<PoolClient> {
    return await this.pool.connect();
  }

  async transaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}
