export interface ChatMessage {
  message_id: string;
  match_id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  media_url?: string;
  is_read: boolean;
  created_at: string;
  // Optimistic UI metadata
  is_pending?: boolean;
  is_failed?: boolean;
}

export interface SendMessageRequest {
  match_id: string;
  recipient_id: string;
  content: string;
  media_url?: string;
}

export interface Conversation {
  match_id: string;
  partner_id: string;
  partner_name: string;
  partner_avatar: string;
  is_online: boolean;
  last_seen?: string;
  is_verified?: boolean;
  last_message?: string;
  last_message_time?: string;
  unread_count: number;
}
