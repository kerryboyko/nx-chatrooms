import connect from '../connect';
import type { Chatroom, ChatMessage } from '@chatrooms/api-interfaces';
import type { ObjectID } from 'mongodb';

export const readChatroom = async (
  roomName: string,
  collName = 'Chatrooms'
): Promise<Chatroom & { _id: ObjectID }> => {
  const { db, close } = await connect();
  const collection = db.collection(collName);
  const response = await collection.findOne({ roomName });
  close();
  return response;
};

export const createChatroom = async (
  roomName: string,
  collName = 'Chatrooms'
): Promise<Chatroom & { _id: ObjectID }> => {
  const { db, close } = await connect();
  const collection = db.collection(collName);
  const doesExist = await collection.findOne({ roomName });
  if (doesExist) {
    close();
    throw new Error(`Chatroom ${roomName} already exists`);
  }
  const response = await collection.insertOne({
    roomName,
    members: [],
    logs: [],
  });
  close();
  return response.ops[0];
};

export const addMembersToChatroom = async (
  roomName: string,
  members: string | string[],
  collName = 'Chatrooms'
): Promise<Chatroom & { _id: ObjectID }> => {
  if (typeof members === 'string') {
    members = [members];
  }
  const { db, close } = await connect();
  const collection = db.collection(collName);
  const currentRecord = await collection.findOne({ roomName });
  if (currentRecord === null) {
    close();
    await createChatroom(roomName, collName);
  }
  const insertion = await collection.findOneAndUpdate(
    { roomName },
    { $addToSet: { members: { $each: members } } },
    { returnOriginal: false }
  );
  close();
  return insertion.value;
};

export const appendToLog = async (
  roomName: string,
  logs: ChatMessage[],
  collName = 'Chatrooms'
): Promise<Chatroom> => {
  const { db, close } = await connect();
  const collection = db.collection(collName);
  const update = await collection.findOneAndUpdate(
    { roomName },
    { $push: { logs: { $each: logs } } },
    { returnOriginal: false }
  );
  close();
  return update.value;
};

const TEN_SECONDS = 10000;

type Batcher = (logs: ChatMessage[]) => void;
export const batchAppendToLog = (
  roomName: string,
  collName = 'Chatrooms'
): Batcher => {
  let batch = [];
  let timer: number;
  return (logs: ChatMessage[]): void => {
    batch = batch.concat(logs);
    clearTimeout(timer);
    timer = setTimeout(() => {
      appendToLog(roomName, batch, collName);
      batch = [];
      clearTimeout(timer);
    }, TEN_SECONDS);
  };
};

export default {
  createChatroom,
  addMembersToChatroom,
  readChatroom,
  appendToLog,
  batchAppendToLog,
};
