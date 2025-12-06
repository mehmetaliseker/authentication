import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { FriendshipService } from '../services/friendship.service';
import { MessageService } from '../services/message.service';
import { JwtService } from '../services/jwt.service';
import { FriendshipRepository } from '../repositories/friendship.repository';
import { MessageRepository } from '../repositories/message.repository';

interface AuthenticatedSocket extends Socket {
  userId?: number;
}

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGINS?.split(',').map(origin => origin.trim()) || ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
  },
  namespace: '/',
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly connectedUsers: Map<number, string> = new Map();

  constructor(
    private readonly friendshipService: FriendshipService,
    private readonly messageService: MessageService,
    private readonly jwtService: JwtService,
    private readonly friendshipRepository: FriendshipRepository,
    private readonly messageRepository: MessageRepository,
  ) {}

  async handleConnection(client: AuthenticatedSocket) {
    try {
      const token = client.handshake.auth?.token || client.handshake.headers?.authorization?.replace('Bearer ', '');
      
      if (!token) {
        client.disconnect();
        return;
      }

      const decoded = this.jwtService.verifyAccessToken(token);
      if (!decoded || !decoded.sub) {
        client.disconnect();
        return;
      }

      client.userId = decoded.sub;
      this.connectedUsers.set(decoded.sub, client.id);
      
      // Kullanıcıyı kendi room'una ekle
      client.join(`user:${decoded.sub}`);
      
      console.log(`Kullanıcı bağlandı: ${decoded.sub} (Socket ID: ${client.id})`);
    } catch (error) {
      console.error('Socket bağlantı hatası:', error);
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    if (client.userId) {
      this.connectedUsers.delete(client.userId);
      console.log(`Kullanıcı ayrıldı: ${client.userId} (Socket ID: ${client.id})`);
    }
  }

  @SubscribeMessage('friendship:send-request')
  async handleSendFriendRequest(
    @MessageBody() data: { requester_id: number; addressee_id: number },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    if (!client.userId || client.userId !== data.requester_id) {
      return { error: 'Yetkisiz erişim' };
    }

    try {
      const result = await this.friendshipService.sendFriendRequest(data.requester_id, data.addressee_id);
      
      // Alıcıya bildirim gönder
      const receiverSocketId = this.connectedUsers.get(data.addressee_id);
      if (receiverSocketId) {
        this.server.to(`user:${data.addressee_id}`).emit('friendship:request-received', {
          friendship: result.friendship,
          requester_id: data.requester_id,
        });
      }

      // Gönderene onay
      return { success: true, data: result };
    } catch (error) {
      return { error: error.message || 'Arkadaş isteği gönderilemedi' };
    }
  }

  @SubscribeMessage('friendship:accept')
  async handleAcceptFriendRequest(
    @MessageBody() data: { friendship_id: number; user_id: number },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    if (!client.userId || client.userId !== data.user_id) {
      return { error: 'Yetkisiz erişim' };
    }

    try {
      const result = await this.friendshipService.acceptFriendRequest(data.friendship_id, data.user_id);
      
      // İsteği gönderen kullanıcıya bildirim gönder
      const friendship = await this.friendshipRepository.findById(data.friendship_id);
      if (friendship) {
        const requesterSocketId = this.connectedUsers.get(friendship.requester_id);
        if (requesterSocketId) {
          this.server.to(`user:${friendship.requester_id}`).emit('friendship:request-accepted', {
            friendship: result.friendship,
            accepter_id: data.user_id,
          });
        }
      }

      return { success: true, data: result };
    } catch (error) {
      return { error: error.message || 'Arkadaş isteği kabul edilemedi' };
    }
  }

  @SubscribeMessage('friendship:reject')
  async handleRejectFriendRequest(
    @MessageBody() data: { friendship_id: number; user_id: number },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    if (!client.userId || client.userId !== data.user_id) {
      return { error: 'Yetkisiz erişim' };
    }

    try {
      const result = await this.friendshipService.rejectFriendRequest(data.friendship_id, data.user_id);
      
      // İsteği gönderen kullanıcıya bildirim gönder
      const friendship = await this.friendshipRepository.findById(data.friendship_id);
      if (friendship) {
        const requesterSocketId = this.connectedUsers.get(friendship.requester_id);
        if (requesterSocketId) {
          this.server.to(`user:${friendship.requester_id}`).emit('friendship:request-rejected', {
            friendship_id: data.friendship_id,
            rejecter_id: data.user_id,
          });
        }
      }

      return { success: true, data: result };
    } catch (error) {
      return { error: error.message || 'Arkadaş isteği reddedilemedi' };
    }
  }

  @SubscribeMessage('friendship:cancel')
  async handleCancelFriendRequest(
    @MessageBody() data: { friendship_id: number; user_id: number },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    if (!client.userId || client.userId !== data.user_id) {
      return { error: 'Yetkisiz erişim' };
    }

    try {
      const result = await this.friendshipService.cancelFriendRequest(data.friendship_id, data.user_id);
      
      // İsteği alan kullanıcıya bildirim gönder
      const friendship = await this.friendshipRepository.findById(data.friendship_id);
      if (friendship) {
        const addresseeSocketId = this.connectedUsers.get(friendship.addressee_id);
        if (addresseeSocketId) {
          this.server.to(`user:${friendship.addressee_id}`).emit('friendship:request-cancelled', {
            friendship_id: data.friendship_id,
            canceller_id: data.user_id,
          });
        }
      }

      return { success: true, data: result };
    } catch (error) {
      return { error: error.message || 'Arkadaş isteği iptal edilemedi' };
    }
  }

  @SubscribeMessage('message:send')
  async handleSendMessage(
    @MessageBody() data: { sender_id: number; receiver_id: number; content: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    if (!client.userId || client.userId !== data.sender_id) {
      return { error: 'Yetkisiz erişim' };
    }

    try {
      const result = await this.messageService.sendMessage({
        sender_id: data.sender_id,
        receiver_id: data.receiver_id,
        content: data.content,
      });
      
      // Alıcıya mesaj gönder
      const receiverSocketId = this.connectedUsers.get(data.receiver_id);
      if (receiverSocketId) {
        this.server.to(`user:${data.receiver_id}`).emit('message:new', {
          message: result.data,
        });
      }

      // Gönderene onay
      return { success: true, data: result };
    } catch (error) {
      return { error: error.message || 'Mesaj gönderilemedi' };
    }
  }

  @SubscribeMessage('message:delete')
  async handleDeleteMessage(
    @MessageBody() data: { message_id: number; user_id: number },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    if (!client.userId || client.userId !== data.user_id) {
      return { error: 'Yetkisiz erişim' };
    }

    try {
      const message = await this.messageRepository.findById(data.message_id);
      if (!message) {
        return { error: 'Mesaj bulunamadı' };
      }

      const result = await this.messageService.deleteMessage(data.message_id, data.user_id);
      
      // Diğer kullanıcıya bildirim gönder
      const otherUserId = message.sender_id === data.user_id ? message.receiver_id : message.sender_id;
      const otherUserSocketId = this.connectedUsers.get(otherUserId);
      if (otherUserSocketId) {
        this.server.to(`user:${otherUserId}`).emit('message:deleted', {
          message_id: data.message_id,
        });
      }

      return { success: true, data: result };
    } catch (error) {
      return { error: error.message || 'Mesaj silinemedi' };
    }
  }

  @SubscribeMessage('message:read')
  async handleReadMessage(
    @MessageBody() data: { message_id: number; user_id: number },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    if (!client.userId || client.userId !== data.user_id) {
      return { error: 'Yetkisiz erişim' };
    }

    try {
      const message = await this.messageRepository.findById(data.message_id);
      if (!message) {
        return { error: 'Mesaj bulunamadı' };
      }

      if (message.receiver_id !== data.user_id) {
        return { error: 'Bu mesajı okundu olarak işaretleme yetkiniz yok' };
      }

      if (message.is_read) {
        // Zaten okunmuş, güncellenmiş mesajı döndür
        return { success: true, data: { message: message } };
      }

      const updatedMessage = await this.messageRepository.markAsRead(data.message_id, data.user_id);
      
      if (updatedMessage) {
        // Gönderen kullanıcıya read receipt bildirimi gönder
        const senderSocketId = this.connectedUsers.get(message.sender_id);
        if (senderSocketId) {
          this.server.to(`user:${message.sender_id}`).emit('message:read-receipt', {
            message_id: data.message_id,
            read_at: updatedMessage.read_at,
          });
        }
      }

      return { success: true, data: { message: updatedMessage } };
    } catch (error) {
      return { error: error.message || 'Mesaj okundu olarak işaretlenemedi' };
    }
  }

  @SubscribeMessage('message:read-conversation')
  async handleReadConversation(
    @MessageBody() data: { sender_id: number; receiver_id: number },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    if (!client.userId || client.userId !== data.receiver_id) {
      return { error: 'Yetkisiz erişim' };
    }

    try {
      await this.messageRepository.markConversationAsRead(data.sender_id, data.receiver_id);
      
      // Gönderen kullanıcıya tüm mesajların okunduğunu bildir
      const senderSocketId = this.connectedUsers.get(data.sender_id);
      if (senderSocketId) {
        this.server.to(`user:${data.sender_id}`).emit('message:conversation-read', {
          receiver_id: data.receiver_id,
        });
      }

      return { success: true };
    } catch (error) {
      return { error: error.message || 'Konuşma okundu olarak işaretlenemedi' };
    }
  }
}

