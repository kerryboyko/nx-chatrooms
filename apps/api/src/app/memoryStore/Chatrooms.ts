import type { Chatroom, ChatMessage } from '@chatrooms/api-interfaces';
import {
  readChatroom,
  createChatroom,
  batchAppendToLog,
  addMembersToChatroom,
} from '../database/Chatrooms';
import { ObjectID } from 'mongodb';

export interface InMemChatroom extends Chatroom {
  members: Set<string>;
  roomName: string;
  logs: ChatMessage[];
  newLogs: ChatMessage[];
  batchSave?: (newLogs: ChatMessage[]) => void;
  _id?: ObjectID;
}

export default class Chatrooms {
  public rooms: Record<string, InMemChatroom>;
  constructor(private collName = 'Chatrooms') {}
  public loadChatroom = async (roomName: string): Promise<InMemChatroom> => {
    if (this.rooms[roomName]) {
      throw new Error(`Room name ${roomName} already exists in memory`);
    }
    const chatRecord = await readChatroom(roomName, this.collName);
    const base = {
      newLogs: [],
      batchSave: batchAppendToLog(roomName, this.collName),
    };
    if (!chatRecord) {
      this.rooms[roomName] = {
        ...base,
        members: new Set([]),
        roomName,
        logs: [],
      };
    } else {
      this.rooms[roomName] = {
        ...chatRecord,
        ...base,
        members: new Set(chatRecord.members),
      };
    }
    return this.rooms[roomName];
  };
  public saveChatroom = async (roomName: string): Promise<void> => {
    if (!this.rooms[roomName]) {
      throw new Error(`Room name ${roomName} does not exist in memory`);
    }
    const record = await readChatroom(roomName, this.collName);
    if (!record) {
      await createChatroom(roomName, this.collName);
    }
    await addMembersToChatroom(
      roomName,
      Array.from(this.rooms[roomName].members),
      this.collName
    );
    this.rooms[roomName].batchSave(this.rooms[roomName].newLogs);
    this.rooms[roomName].logs = this.rooms[roomName].logs.concat(
      ...this.rooms[roomName].newLogs
    );
    this.rooms[roomName].newLogs = [];
  };
  public getChatroom = (roomName: string): InMemChatroom =>
    this.rooms[roomName];
}
