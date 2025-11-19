import { Body, Controller, Get, Param, Post, Put, Delete, ParseIntPipe } from '@nestjs/common';
import { MessageService } from '../services/message.service';

@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post('send')
  async sendMessage(@Body() body: { sender_id: number; receiver_id: number; content: string }) {
    return this.messageService.sendMessage({
      sender_id: body.sender_id,
      receiver_id: body.receiver_id,
      content: body.content,
    });
  }

  @Get('conversation/:userId1/:userId2/:currentUserId')
  async getConversation(
    @Param('userId1', ParseIntPipe) userId1: number,
    @Param('userId2', ParseIntPipe) userId2: number,
    @Param('currentUserId', ParseIntPipe) currentUserId: number
  ) {
    return this.messageService.getConversation(userId1, userId2, currentUserId);
  }

  @Get('unread-count/:userId')
  async getUnreadCount(@Param('userId', ParseIntPipe) userId: number) {
    return this.messageService.getUnreadCount(userId);
  }

  @Get('user/:userId')
  async getUserMessages(@Param('userId', ParseIntPipe) userId: number) {
    return this.messageService.getUserMessages(userId);
  }

  @Put(':id/read')
  async markAsRead(
    @Param('id', ParseIntPipe) messageId: number,
    @Body() body: { user_id: number }
  ) {
    return this.messageService.markAsRead(messageId, body.user_id);
  }

  @Put(':id')
  async updateMessage(
    @Param('id', ParseIntPipe) messageId: number,
    @Body() body: { user_id: number; content?: string; is_read?: boolean }
  ) {
    return this.messageService.updateMessage(messageId, {
      content: body.content,
      is_read: body.is_read,
    }, body.user_id);
  }

  @Delete(':id')
  async deleteMessage(
    @Param('id', ParseIntPipe) messageId: number,
    @Body() body: { user_id: number }
  ) {
    return this.messageService.deleteMessage(messageId, body.user_id);
  }
}

