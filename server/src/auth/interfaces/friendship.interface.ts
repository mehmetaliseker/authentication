export interface Friendship {
  id: number;
  requester_id: number;
  addressee_id: number;
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled';
  created_at: Date;
  updated_at: Date;
}

export interface CreateFriendshipDto {
  requester_id: number;
  addressee_id: number;
}

export interface UpdateFriendshipStatusDto {
  status: 'accepted' | 'rejected' | 'cancelled';
}

export interface UserWithFriendshipStatus {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  friendship_status?: 'none' | 'pending_sent' | 'pending_received' | 'accepted' | 'rejected' | 'cancelled';
  friendship_id?: number;
  requester_id?: number;
}

