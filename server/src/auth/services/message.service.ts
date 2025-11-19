import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { MessageRepository } from '../repositories/message.repository';
import { CreateMessageDto, UpdateMessageDto, MessageWithUser, Message } from '../interfaces/message.interface';

@Injectable()
export class MessageService {
  constructor(private readonly messageRepository: MessageRepository) {}

  async sendMessage(createDto: CreateMessageDto): Promise<{ message: string; data: Message }> {
    if (createDto.sender_id === createDto.receiver_id) {
      throw new BadRequestException('Kendinize mesaj gönderemezsiniz');
    }

    if (!createDto.content || createDto.content.trim().length === 0) {
      throw new BadRequestException('Mesaj içeriği boş olamaz');
    }

    const message = await this.messageRepository.create({
      sender_id: createDto.sender_id,
      receiver_id: createDto.receiver_id,
      content: createDto.content.trim(),
    });

    return {
      message: 'Mesaj gönderildi',
      data: message,
    };
  }

  async getConversation(userId1: number, userId2: number, currentUserId: number): Promise<MessageWithUser[]> {
    // Sadece konuşmanın bir parçası olan kullanıcı konuşmayı görebilir
    if (currentUserId !== userId1 && currentUserId !== userId2) {
      throw new ForbiddenException('Bu konuşmayı görüntüleme yetkiniz yok');
    }

    const messages = await this.messageRepository.findByConversation(userId1, userId2);
    
    // Okunmamış mesajları işaretle
    await this.messageRepository.markConversationAsRead(userId2, userId1);

    return messages;
  }

  async getUserMessages(userId: number): Promise<MessageWithUser[]> {
    return await this.messageRepository.findByUserId(userId);
  }

  async markAsRead(messageId: number, userId: number): Promise<{ message: string }> {
    const message = await this.messageRepository.findById(messageId);
    
    if (!message) {
      throw new NotFoundException('Mesaj bulunamadı');
    }

    if (message.receiver_id !== userId) {
      throw new ForbiddenException('Bu mesajı okundu olarak işaretleme yetkiniz yok');
    }

    await this.messageRepository.markAsRead(messageId, userId);

    return {
      message: 'Mesaj okundu olarak işaretlendi',
    };
  }

  async updateMessage(messageId: number, updateDto: UpdateMessageDto, userId: number): Promise<{ message: string; data: Message }> {
    const message = await this.messageRepository.findById(messageId);
    
    if (!message) {
      throw new NotFoundException('Mesaj bulunamadı');
    }

    if (message.sender_id !== userId) {
      throw new ForbiddenException('Bu mesajı düzenleme yetkiniz yok');
    }

    const updatedMessage = await this.messageRepository.update(messageId, updateDto);

    return {
      message: 'Mesaj güncellendi',
      data: updatedMessage,
    };
  }

  async deleteMessage(messageId: number, userId: number): Promise<{ message: string }> {
    const message = await this.messageRepository.findById(messageId);
    
    if (!message) {
      throw new NotFoundException('Mesaj bulunamadı');
    }

    if (message.sender_id !== userId && message.receiver_id !== userId) {
      throw new ForbiddenException('Bu mesajı silme yetkiniz yok');
    }

    await this.messageRepository.delete(messageId, userId);

    return {
      message: 'Mesaj silindi',
    };
  }

  async getUnreadCount(userId: number): Promise<{ count: number }> {
    const count = await this.messageRepository.getUnreadCount(userId);
    return { count };
  }
}

