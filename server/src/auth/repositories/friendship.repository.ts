import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { Friendship, CreateFriendshipDto, UpdateFriendshipStatusDto, UserWithFriendshipStatus } from '../interfaces/friendship.interface';

@Injectable()
export class FriendshipRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createDto: CreateFriendshipDto): Promise<Friendship> {
    const query = `
      INSERT INTO friendships (requester_id, addressee_id, status)
      VALUES ($1, $2, 'pending')
      RETURNING *
    `;
    
    const values = [createDto.requester_id, createDto.addressee_id];
    const result = await this.databaseService.query(query, values);
    return result.rows[0];
  }

  async findById(id: number): Promise<Friendship | null> {
    const query = `
      SELECT * FROM friendships WHERE id = $1
    `;
    const result = await this.databaseService.query(query, [id]);
    return result.rows[0] || null;
  }

  async findByUserIds(requesterId: number, addresseeId: number): Promise<Friendship | null> {
    const query = `
      SELECT * FROM friendships 
      WHERE (requester_id = $1 AND addressee_id = $2)
         OR (requester_id = $2 AND addressee_id = $1)
      ORDER BY created_at DESC
      LIMIT 1
    `;
    const result = await this.databaseService.query(query, [requesterId, addresseeId]);
    return result.rows[0] || null;
  }

  async updateStatus(id: number, updateDto: UpdateFriendshipStatusDto): Promise<Friendship> {
    const query = `
      UPDATE friendships 
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `;
    const result = await this.databaseService.query(query, [updateDto.status, id]);
    return result.rows[0];
  }

  async delete(id: number): Promise<void> {
    const query = `DELETE FROM friendships WHERE id = $1`;
    await this.databaseService.query(query, [id]);
  }

  async getAllUsersWithFriendshipStatus(currentUserId: number): Promise<UserWithFriendshipStatus[]> {
    const query = `
      SELECT 
        u.id,
        u.first_name,
        u.last_name,
        u.email,
        u.last_active,
        f.id as friendship_id,
        f.requester_id,
        f.status,
        CASE 
          WHEN f.id IS NULL THEN 'none'
          WHEN f.requester_id = $1 AND f.status = 'pending' THEN 'pending_sent'
          WHEN f.addressee_id = $1 AND f.status = 'pending' THEN 'pending_received'
          WHEN f.status = 'accepted' THEN 'accepted'
          WHEN f.status = 'rejected' THEN 'rejected'
          WHEN f.status = 'cancelled' THEN 'cancelled'
        END as friendship_status
      FROM users u
      LEFT JOIN friendships f ON (
        (f.requester_id = u.id AND f.addressee_id = $1)
        OR (f.addressee_id = u.id AND f.requester_id = $1)
      )
      WHERE u.id != $1
      ORDER BY u.first_name, u.last_name
    `;
    
    const result = await this.databaseService.query(query, [currentUserId]);
    return result.rows.map((row: any) => ({
      id: row.id,
      first_name: row.first_name,
      last_name: row.last_name,
      email: row.email,
      last_active: row.last_active || undefined,
      friendship_status: row.friendship_status,
      friendship_id: row.friendship_id || undefined,
      requester_id: row.requester_id || undefined,
    }));
  }

  async getFriendshipRequests(userId: number): Promise<Friendship[]> {
    const query = `
      SELECT * FROM friendships 
      WHERE addressee_id = $1 AND status = 'pending'
      ORDER BY created_at DESC
    `;
    const result = await this.databaseService.query(query, [userId]);
    return result.rows;
  }

  async getSentRequests(userId: number): Promise<Friendship[]> {
    const query = `
      SELECT * FROM friendships 
      WHERE requester_id = $1 AND status = 'pending'
      ORDER BY created_at DESC
    `;
    const result = await this.databaseService.query(query, [userId]);
    return result.rows;
  }

  async getFriends(userId: number): Promise<UserWithFriendshipStatus[]> {
    const query = `
      SELECT 
        u.id,
        u.first_name,
        u.last_name,
        u.email,
        u.last_active,
        f.id as friendship_id
      FROM friendships f
      JOIN users u ON (
        CASE 
          WHEN f.requester_id = $1 THEN u.id = f.addressee_id
          WHEN f.addressee_id = $1 THEN u.id = f.requester_id
        END
      )
      WHERE (f.requester_id = $1 OR f.addressee_id = $1)
        AND f.status = 'accepted'
      ORDER BY u.first_name, u.last_name
    `;
    const result = await this.databaseService.query(query, [userId]);
    return result.rows.map((row: any) => ({
      id: row.id,
      first_name: row.first_name,
      last_name: row.last_name,
      email: row.email,
      last_active: row.last_active || undefined,
      friendship_status: 'accepted' as const,
      friendship_id: row.friendship_id,
    }));
  }
}

