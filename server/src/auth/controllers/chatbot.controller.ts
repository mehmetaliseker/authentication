import { Body, Controller, Get, Post, Put, Delete, Param, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { ChatbotService } from '../services/chatbot.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('chatbot')
@UseGuards(JwtAuthGuard)
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Post('send')
  async sendMessage(@Request() req: any, @Body() body: { content: string }) {
    const userId = req.user?.id;
    if (!userId) {
      return { error: 'Kullanıcı bilgisi bulunamadı' };
    }
    return this.chatbotService.sendMessage(userId, body.content);
  }

  @Get('conversation/:userId')
  async getConversation(@Request() req: any, @Param('userId', ParseIntPipe) userId: number) {
    // Kullanıcı sadece kendi konuşmasını görebilir
    if (req.user?.id !== userId) {
      return { error: 'Yetkisiz erişim' };
    }
    return this.chatbotService.getConversation(userId);
  }

  @Delete('conversation/:userId')
  async deleteConversation(@Request() req: any, @Param('userId', ParseIntPipe) userId: number) {
    // Kullanıcı sadece kendi konuşmasını silebilir
    if (req.user?.id !== userId) {
      return { error: 'Yetkisiz erişim' };
    }
    return this.chatbotService.deleteConversation(userId);
  }

  @Get('unread-count/:userId')
  async getUnreadCount(@Request() req: any, @Param('userId', ParseIntPipe) userId: number) {
    // Kullanıcı sadece kendi okunmamış sayısını görebilir
    if (req.user?.id !== userId) {
      return { error: 'Yetkisiz erişim' };
    }
    return this.chatbotService.getUnreadCount(userId);
  }

  @Put(':id/read')
  async markMessageAsRead(
    @Request() req: any,
    @Param('id', ParseIntPipe) messageId: number,
    @Body() body: { user_id: number }
  ) {
    // Kullanıcı sadece kendi mesajlarını okundu olarak işaretleyebilir
    if (req.user?.id !== body.user_id) {
      return { error: 'Yetkisiz erişim' };
    }
    return this.chatbotService.markMessageAsRead(messageId, body.user_id);
  }
}

