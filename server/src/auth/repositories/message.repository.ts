import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { Message, CreateMessageDto, UpdateMessageDto, MessageWithUser } from '../interfaces/message.interface';

@Injectable()
export class MessageRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createDto: CreateMessageDto): Promise<Message> {
    const query = `
      INSERT INTO messages (sender_id, receiver_id, content)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    
    const values = [createDto.sender_id, createDto.receiver_id, createDto.content];
    const result = await this.databaseService.query(query, values);
    return result.rows[0];
  }

  async findById(id: number): Promise<Message | null> {
    const query = `
      SELECT * FROM messages WHERE id = $1
    `;
    const result = await this.databaseService.query(query, [id]);
    return result.rows[0] || null;
  }

  async findByConversation(userId1: number, userId2: number): Promise<MessageWithUser[]> {
    const query = `
      SELECT 
        m.*,
        sender.first_name || ' ' || sender.last_name as sender_name,
        receiver.first_name || ' ' || receiver.last_name as receiver_name
      FROM messages m
      JOIN users sender ON m.sender_id = sender.id
      JOIN users receiver ON m.receiver_id = receiver.id
      WHERE (m.sender_id = $1 AND m.receiver_id = $2)
         OR (m.sender_id = $2 AND m.receiver_id = $1)
      ORDER BY m.created_at ASC
    `;
    const result = await this.databaseService.query(query, [userId1, userId2]);
    return result.rows;
  }

  async findByUserId(userId: number): Promise<MessageWithUser[]> {
    const query = `
      SELECT 
        m.*,
        sender.first_name || ' ' || sender.last_name as sender_name,
        receiver.first_name || ' ' || receiver.last_name as receiver_name
      FROM messages m
      JOIN users sender ON m.sender_id = sender.id
      JOIN users receiver ON m.receiver_id = receiver.id
      WHERE m.sender_id = $1 OR m.receiver_id = $1
      ORDER BY m.created_at DESC
    `;
    const result = await this.databaseService.query(query, [userId]);
    return result.rows;
  }

  async markAsRead(messageId: number, userId: number): Promise<Message> {
    const query = `
      UPDATE messages 
      SET is_read = true, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND receiver_id = $2
      RETURNING *
    `;
    const result = await this.databaseService.query(query, [messageId, userId]);
    return result.rows[0];
  }

  async markConversationAsRead(senderId: number, receiverId: number): Promise<void> {
    const query = `
      UPDATE messages 
      SET is_read = true, updated_at = CURRENT_TIMESTAMP
      WHERE sender_id = $1 AND receiver_id = $2 AND is_read = false
    `;
    await this.databaseService.query(query, [senderId, receiverId]);
  }

  async update(id: number, updateDto: UpdateMessageDto): Promise<Message> {
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (updateDto.content !== undefined) {
      updates.push(`content = $${paramCount}`);
      values.push(updateDto.content);
      paramCount++;
    }

    if (updateDto.is_read !== undefined) {
      updates.push(`is_read = $${paramCount}`);
      values.push(updateDto.is_read);
      paramCount++;
    }

    if (updates.length === 0) {
      const message = await this.findById(id);
      if (!message) {
        throw new Error('Mesaj bulunamadı');
      }
      return message;
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `
      UPDATE messages 
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;
    const result = await this.databaseService.query(query, values);
    return result.rows[0];
  }

  async delete(id: number, userId: number): Promise<void> {
    const query = `
      DELETE FROM messages 
      WHERE id = $1 AND (sender_id = $2 OR receiver_id = $2)
    `;
    await this.databaseService.query(query, [id, userId]);
  }

  async getUnreadCount(userId: number): Promise<number> {
    const query = `
      SELECT COUNT(*) as count 
      FROM messages 
      WHERE receiver_id = $1 AND is_read = false
    `;
    const result = await this.databaseService.query(query, [userId]);
    return parseInt(result.rows[0].count);
  }

  async getUnreadCountBySender(receiverId: number, senderId: number): Promise<number> {
    const query = `
      SELECT COUNT(*) as count 
      FROM messages 
      WHERE receiver_id = $1 AND sender_id = $2 AND is_read = false
    `;
    const result = await this.databaseService.query(query, [receiverId, senderId]);
    return parseInt(result.rows[0].count);
  }
}

