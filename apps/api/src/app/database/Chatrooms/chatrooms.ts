import connect from '../connect';
import type { Chatroom, ChatMessage } from '@chatrooms/api-interfaces';
import type { ObjectID } from 'mongodb';

export const readChatroom = async (
  roomName: string,
  collName = 'Chatrooms'
): Promise<unknown> => {
  const { db, close } = await connect();
  const collection = db.collection(collName);
  const response = await collection.findOne({ roomName });
  close();
  return response;
};

export const createChatroom = async (
  roomName: string,
  creator: string,
  collName = 'Chatrooms'
): Promise<Chatroom & { _id: ObjectID }> => {
  const { db, close } = await connect();
  const collection = db.collection(collName);
  const doesExist = await collection.findOne({ roomName });
  if (doesExist) {
    close();
    return joinChatroom(roomName, creator, collName);
  }
  const response = await collection.insertOne({
    roomName,
    members: [creator],
    logs: [],
  });
  close();
  return response.ops[0];
};

export const joinChatroom = async (
  roomName: string,
  member: string,
  collName = 'Chatrooms'
): Promise<Chatroom & { _id: ObjectID }> => {
  const { db, close } = await connect();
  const collection = db.collection(collName);
  const currentRecord = await collection.findOne({ roomName });
  if (currentRecord === null) {
    close();
    return await createChatroom(roomName, member, collName);
  }
  if (currentRecord.members.includes(member)) {
    close();
    return currentRecord;
  }
  const insertion = await collection.findOneAndUpdate(
    { roomName },
    { $addToSet: { members: member } },
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

export const batchAppendToLog = (roomName: string, collName = 'Chatrooms') => {
  let batch = [];
  let timer: number;
  return (logs: ChatMessage[]) => {
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
  joinChatroom,
  readChatroom,
  appendToLog,
  batchAppendToLog,
};
