import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import { ChatbotMessageRepository } from '../repositories/chatbot-message.repository';
import { UserRepository } from '../repositories/user.repository';
import { CreateChatbotMessageDto, ChatbotMessageWithUser, ChatbotMessage } from '../interfaces/chatbot-message.interface';

@Injectable()
export class ChatbotService {
  private genAI: GoogleGenAI;

  constructor(
    private readonly chatbotMessageRepository: ChatbotMessageRepository,
    private readonly userRepository: UserRepository,
  ) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY yok');
    }
    this.genAI = new GoogleGenAI({ apiKey });
  }

  async sendMessage(userId: number, content: string): Promise<{ message: string; data: { userMessage: ChatbotMessage; assistantMessage: ChatbotMessage } }> {
    if (!content || content.trim().length === 0) {
      throw new BadRequestException('Mesaj içeriği boş olamaz');
    }

    const trimmedContent = content.trim();

    // Kullanıcı mesajını kaydet
    const userMessage = await this.chatbotMessageRepository.create({
      user_id: userId,
      message_type: 'user',
      content: trimmedContent,
    });

    try {
      // Geçmiş mesajları al (context için)
      const history = await this.chatbotMessageRepository.getLastMessages(userId, 10);
      
      const chatHistory = history.map(msg => ({
        role: msg.message_type === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      }));

      // Gemini API'ye istek gönder
      let assistantContent: string;
      
      // Tüm mesajları içeren contents array'i oluştur
      const contents = [
        ...chatHistory.map(msg => ({
          role: msg.role,
          parts: msg.parts,
        })),
        {
          role: 'user' as const,
          parts: [{ text: trimmedContent }],
        },
      ];
      
      // GenerateContent kullan
      const result = await this.genAI.models.generateContent({
        model: 'gemini-pro-latest',
        contents: contents,
      });
      
      // Response'dan text'i al
      const candidates = result.candidates || [];
      if (candidates.length > 0 && candidates[0].content) {
        const parts = candidates[0].content.parts || [];
        assistantContent = parts.map((part: any) => part.text || '').join('');
      } else {
        throw new Error('Chatbot yanıt üretemedi');
      }

      const assistantMessage = await this.chatbotMessageRepository.create({
        user_id: userId,
        message_type: 'assistant',
        content: assistantContent,
      });

      console.log('✅ Assistant mesajı oluşturuldu:', {
        id: assistantMessage.id,
        content: assistantContent.substring(0, 50),
        message_type: assistantMessage.message_type
      });

      // Kullanıcının last_active'ini güncelle
      await this.userRepository.updateLastActive(userId);

      const response = {
        message: 'Mesaj gönderildi',
        data: {
          userMessage: userMessage,
          assistantMessage: assistantMessage,
        },
      };

      console.log('📤 Backend Response:', {
        hasUserMessage: !!response.data.userMessage,
        hasAssistantMessage: !!response.data.assistantMessage,
        userMessageId: response.data.userMessage?.id,
        assistantMessageId: response.data.assistantMessage?.id
      });

      return response;
    } catch (error) {
      console.error('Chatbot hatası:', error);
      throw new InternalServerErrorException('Chatbot yanıt veremedi. Lütfen tekrar deneyin.');
    }
  }

  async getConversation(userId: number): Promise<ChatbotMessageWithUser[]> {
    const messages = await this.chatbotMessageRepository.findByUserId(userId);
    
    // Okunmamış mesajları işaretle
    await this.chatbotMessageRepository.markConversationAsRead(userId);
    
    // Kullanıcının last_active'ini güncelle
    await this.userRepository.updateLastActive(userId);
    
    return messages;
  }

  async getUnreadCount(userId: number): Promise<{ count: number }> {
    const count = await this.chatbotMessageRepository.getUnreadCount(userId);
    return { count };
  }

  async deleteConversation(userId: number): Promise<{ message: string }> {
    await this.chatbotMessageRepository.deleteByUserId(userId);
    return {
      message: 'Konuşma geçmişi silindi',
    };
  }

  async markMessageAsRead(messageId: number, userId: number): Promise<{ message: string }> {
    await this.chatbotMessageRepository.markMessageAsRead(messageId, userId);
    return {
      message: 'Mesaj okundu olarak işaretlendi',
    };
  }
}

