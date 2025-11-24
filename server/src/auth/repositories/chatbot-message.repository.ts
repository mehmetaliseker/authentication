import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { ChatbotMessage, CreateChatbotMessageDto, ChatbotMessageWithUser } from '../interfaces/chatbot-message.interface';

@Injectable()
export class ChatbotMessageRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createDto: CreateChatbotMessageDto): Promise<ChatbotMessage> {
    const query = `
      INSERT INTO chatbot_messages (user_id, message_type, content)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    
    const values = [createDto.user_id, createDto.message_type, createDto.content];
    const result = await this.databaseService.query(query, values);
    return result.rows[0];
  }

  async findById(id: number): Promise<ChatbotMessage | null> {
    const query = `
      SELECT * FROM chatbot_messages WHERE id = $1
    `;
    const result = await this.databaseService.query(query, [id]);
    return result.rows[0] || null;
  }

  async findByUserId(userId: number): Promise<ChatbotMessageWithUser[]> {
    const query = `
      SELECT 
        cm.*,
        u.first_name || ' ' || u.last_name as user_name
      FROM chatbot_messages cm
      JOIN users u ON cm.user_id = u.id
      WHERE cm.user_id = $1
      ORDER BY cm.created_at ASC
    `;
    const result = await this.databaseService.query(query, [userId]);
    return result.rows;
  }

  async getLastMessages(userId: number, limit: number = 10): Promise<ChatbotMessage[]> {
    const query = `
      SELECT * FROM chatbot_messages
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT $2
    `;
    const result = await this.databaseService.query(query, [userId, limit]);
    return result.rows.reverse();
  }

  async deleteByUserId(userId: number): Promise<void> {
    const query = `
      DELETE FROM chatbot_messages 
      WHERE user_id = $1
    `;
    await this.databaseService.query(query, [userId]);
  }
}

