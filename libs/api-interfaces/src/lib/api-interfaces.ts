export interface Message {
  message: string;
}

export interface ChatMessage {
  type: 'SERVER::message' | 'CLIENT::message';
  roomName: string;
  message: string;
  timeStamp: Date;
  sender: string;
  senderId: string;
}

export interface DirectMessage {
  type: 'SERVER::direct-message' | 'CLIENT::direct-message';
  sender: string;
  senderId: string;
  reciever: string;
  message: string;
  timeStamp: Date;
}

export interface User {
  roles?: Record<string, string[]>;
  given_name?: string;
  family_name?: string;
  nickname?: string;
  name?: string;
  picture?: string;
  locale?: string;
  updated_at?: Date;
  email?: string;
  email_verified?: boolean;
  sub?: string;
}
