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
