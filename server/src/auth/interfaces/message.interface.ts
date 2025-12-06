export interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  content: string;
  is_read: boolean;
  read_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface CreateMessageDto {
  sender_id: number;
  receiver_id: number;
  content: string;
}

export interface UpdateMessageDto {
  content?: string;
  is_read?: boolean;
}

export interface MessageWithUser {
  id: number;
  sender_id: number;
  receiver_id: number;
  content: string;
  is_read: boolean;
  read_at: Date | null;
  created_at: Date;
  updated_at: Date;
  sender_name?: string;
  receiver_name?: string;
}

