export interface ChatbotMessage {
  id: number;
  user_id: number;
  message_type: 'user' | 'assistant';
  content: string;
  is_read: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateChatbotMessageDto {
  user_id: number;
  message_type: 'user' | 'assistant';
  content: string;
}

export interface ChatbotMessageWithUser {
  id: number;
  user_id: number;
  message_type: 'user' | 'assistant';
  content: string;
  is_read: boolean;
  created_at: Date;
  updated_at: Date;
  user_name?: string;
}

