import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { ChatbotMessage, CreateChatbotMessageDto, ChatbotMessageWithUser } from '../interfaces/chatbot-message.interface';

@Injectable()
export class ChatbotMessageRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createDto: CreateChatbotMessageDto): Promise<ChatbotMessage> {
    // User mesajları otomatik olarak okunmuş sayılır, assistant mesajları okunmamış
    const isRead = createDto.message_type === 'user';
    
    try {
      // Önce is_read kolonu ile deneyelim
      const query = `
        INSERT INTO chatbot_messages (user_id, message_type, content, is_read)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `;
      
      const values = [createDto.user_id, createDto.message_type, createDto.content, isRead];
      const result = await this.databaseService.query(query, values);
      return result.rows[0];
    } catch (error) {
      // Eğer is_read kolonu yoksa (migration çalıştırılmamışsa), is_read olmadan ekle
      if (error.message && error.message.includes('is_read')) {
        console.warn('is_read kolonu bulunamadı. Migration çalıştırılmalı: 018_add_is_read_to_chatbot_messages.sql');
        const query = `
          INSERT INTO chatbot_messages (user_id, message_type, content)
          VALUES ($1, $2, $3)
          RETURNING *
        `;
        const values = [createDto.user_id, createDto.message_type, createDto.content];
        const result = await this.databaseService.query(query, values);
        // is_read kolonu yoksa, varsayılan olarak false döndür
        return { ...result.rows[0], is_read: false };
      }
      throw error;
    }
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

  async markConversationAsRead(userId: number): Promise<void> {
    try {
      const query = `
        UPDATE chatbot_messages 
        SET is_read = true, updated_at = CURRENT_TIMESTAMP
        WHERE user_id = $1 AND message_type = 'assistant' AND is_read = false
      `;
      await this.databaseService.query(query, [userId]);
    } catch (error) {
      // Eğer is_read kolonu yoksa (migration çalıştırılmamışsa), sessizce geç
      if (error.message && error.message.includes('is_read')) {
        console.warn('is_read kolonu bulunamadı. Migration çalıştırılmalı: 018_add_is_read_to_chatbot_messages.sql');
        return;
      }
      throw error;
    }
  }

  async getUnreadCount(userId: number): Promise<number> {
    try {
      const query = `
        SELECT COUNT(*) as count 
        FROM chatbot_messages 
        WHERE user_id = $1 AND message_type = 'assistant' AND is_read = false
      `;
      const result = await this.databaseService.query(query, [userId]);
      return parseInt(result.rows[0].count) || 0;
    } catch (error) {
      // Eğer is_read kolonu yoksa (migration çalıştırılmamışsa), 0 döndür
      if (error.message && error.message.includes('is_read')) {
        console.warn('is_read kolonu bulunamadı. Migration çalıştırılmalı: 018_add_is_read_to_chatbot_messages.sql');
        return 0;
      }
      throw error;
    }
  }

  async markMessageAsRead(messageId: number, userId: number): Promise<void> {
    try {
      const query = `
        UPDATE chatbot_messages 
        SET is_read = true, updated_at = CURRENT_TIMESTAMP
        WHERE id = $1 AND user_id = $2 AND message_type = 'assistant' AND is_read = false
      `;
      await this.databaseService.query(query, [messageId, userId]);
    } catch (error) {
      // Eğer is_read kolonu yoksa (migration çalıştırılmamışsa), sessizce geç
      if (error.message && error.message.includes('is_read')) {
        console.warn('is_read kolonu bulunamadı. Migration çalıştırılmalı: 018_add_is_read_to_chatbot_messages.sql');
        return;
      }
      throw error;
    }
  }
}

