import { Body, Controller, Get, Param, Post, Put, Delete } from '@nestjs/common';
import { FriendshipService } from '../services/friendship.service';

@Controller('friendships')
export class FriendshipController {
  constructor(private readonly friendshipService: FriendshipService) {}

  @Post('send-request')
  async sendFriendRequest(@Body() body: { requester_id: number; addressee_id: number }) {
    return this.friendshipService.sendFriendRequest(body.requester_id, body.addressee_id);
  }

  @Put(':id/accept')
  async acceptFriendRequest(
    @Param('id') friendshipId: number,
    @Body() body: { user_id: number }
  ) {
    return this.friendshipService.acceptFriendRequest(friendshipId, body.user_id);
  }

  @Put(':id/reject')
  async rejectFriendRequest(
    @Param('id') friendshipId: number,
    @Body() body: { user_id: number }
  ) {
    return this.friendshipService.rejectFriendRequest(friendshipId, body.user_id);
  }

  @Put(':id/cancel')
  async cancelFriendRequest(
    @Param('id') friendshipId: number,
    @Body() body: { user_id: number }
  ) {
    return this.friendshipService.cancelFriendRequest(friendshipId, body.user_id);
  }

  @Get('users/:userId')
  async getAllUsersWithFriendshipStatus(@Param('userId') userId: number) {
    return this.friendshipService.getAllUsersWithFriendshipStatus(userId);
  }

  @Get('requests/:userId')
  async getFriendshipRequests(@Param('userId') userId: number) {
    return this.friendshipService.getFriendshipRequests(userId);
  }

  @Get('sent-requests/:userId')
  async getSentRequests(@Param('userId') userId: number) {
    return this.friendshipService.getSentRequests(userId);
  }

  @Get('friends/:userId')
  async getFriends(@Param('userId') userId: number) {
    return this.friendshipService.getFriends(userId);
  }
}

