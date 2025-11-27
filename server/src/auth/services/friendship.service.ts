import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { FriendshipRepository } from '../repositories/friendship.repository';
import { CreateFriendshipDto, UpdateFriendshipStatusDto, UserWithFriendshipStatus, Friendship } from '../interfaces/friendship.interface';

@Injectable()
export class FriendshipService {
  constructor(private readonly friendshipRepository: FriendshipRepository) {}

  async sendFriendRequest(requesterId: number, addresseeId: number): Promise<{ message: string; friendship?: any }> {
    if (requesterId === addresseeId) {
      throw new BadRequestException('Kendinize arkadaş isteği gönderemezsiniz');
    }

    const existingFriendship = await this.friendshipRepository.findByUserIds(requesterId, addresseeId);
    
    if (existingFriendship) {
      switch (existingFriendship.status) {
        case 'pending':
          if (existingFriendship.requester_id === requesterId) {
            throw new BadRequestException('Bu kullanıcıya zaten arkadaş isteği gönderdiniz');
          } else {
            throw new BadRequestException('Bu kullanıcıdan zaten arkadaş isteği aldınız');
          }
        case 'accepted':
          throw new BadRequestException('Bu kullanıcı zaten arkadaşınız');
        case 'rejected':
          // Reddedilmiş bir istek varsa, yeni istek gönderebilir
          await this.friendshipRepository.delete(existingFriendship.id);
          break;
        case 'cancelled':
          // İptal edilmiş bir istek varsa, yeni istek gönderebilir
          await this.friendshipRepository.delete(existingFriendship.id);
          break;
      }
    }

    const friendship = await this.friendshipRepository.create({
      requester_id: requesterId,
      addressee_id: addresseeId,
    });

    return {
      message: 'Arkadaş isteği gönderildi',
      friendship,
    };
  }

  async acceptFriendRequest(friendshipId: number, userId: number): Promise<{ message: string; friendship: any }> {
    const friendship = await this.friendshipRepository.findById(friendshipId);
    
    if (!friendship) {
      throw new NotFoundException('Arkadaş isteği bulunamadı');
    }

    if (friendship.addressee_id !== userId) {
      throw new BadRequestException('Bu arkadaş isteğini kabul edemezsiniz');
    }

    if (friendship.status !== 'pending') {
      throw new BadRequestException('Bu istek artık bekleyen durumda değil');
    }

    const updatedFriendship = await this.friendshipRepository.updateStatus(friendshipId, { status: 'accepted' });

    return {
      message: 'Arkadaş isteği kabul edildi',
      friendship: updatedFriendship,
    };
  }

  async rejectFriendRequest(friendshipId: number, userId: number): Promise<{ message: string; friendship: any }> {
    const friendship = await this.friendshipRepository.findById(friendshipId);
    
    if (!friendship) {
      throw new NotFoundException('Arkadaş isteği bulunamadı');
    }

    if (friendship.addressee_id !== userId) {
      throw new BadRequestException('Bu arkadaş isteğini reddedemezsiniz');
    }

    if (friendship.status !== 'pending') {
      throw new BadRequestException('Bu istek artık bekleyen durumda değil');
    }

    const updatedFriendship = await this.friendshipRepository.updateStatus(friendshipId, { status: 'rejected' });

    return {
      message: 'Arkadaş isteği reddedildi',
      friendship: updatedFriendship,
    };
  }

  async cancelFriendRequest(friendshipId: number, userId: number): Promise<{ message: string }> {
    const friendship = await this.friendshipRepository.findById(friendshipId);
    
    if (!friendship) {
      throw new NotFoundException('Arkadaş isteği bulunamadı');
    }

    if (friendship.requester_id !== userId) {
      throw new BadRequestException('Bu arkadaş isteğini iptal edemezsiniz');
    }

    if (friendship.status !== 'pending') {
      throw new BadRequestException('Sadece bekleyen istekler iptal edilebilir');
    }

    await this.friendshipRepository.updateStatus(friendshipId, { status: 'cancelled' });

    return {
      message: 'Arkadaş isteği iptal edildi',
    };
  }

  async getAllUsersWithFriendshipStatus(userId: number): Promise<UserWithFriendshipStatus[]> {
    return await this.friendshipRepository.getAllUsersWithFriendshipStatus(userId);
  }

  async getFriendshipRequests(userId: number): Promise<Friendship[]> {
    return await this.friendshipRepository.getFriendshipRequests(userId);
  }

  async getSentRequests(userId: number): Promise<Friendship[]> {
    return await this.friendshipRepository.getSentRequests(userId);
  }

  async getFriends(userId: number): Promise<UserWithFriendshipStatus[]> {
    return await this.friendshipRepository.getFriends(userId);
  }

  async getPendingRequestsCount(userId: number): Promise<{ count: number }> {
    const requests = await this.friendshipRepository.getFriendshipRequests(userId);
    return { count: requests.length };
  }
}

