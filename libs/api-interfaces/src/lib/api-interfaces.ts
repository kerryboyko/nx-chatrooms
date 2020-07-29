export interface Message {
  message: string;
}

export interface ChatMessage {
  type: string;
  roomName: string;
  message: string;
  timeStamp: Date;
  sender: string;
  senderId: string;
}

export interface Chatroom {
  members: string[];
  roomName: string;
  logs: ChatMessage[];
}

export interface DirectMessage {
  type: string;
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
