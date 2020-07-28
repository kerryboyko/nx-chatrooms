import connect from '../connect';
import { User } from '@chatrooms/api-interfaces';
import type { InsertOneWriteOpResult, ObjectID } from 'mongodb';

export const createUser = async (
  user: User,
  collName = 'Users'
): Promise<InsertOneWriteOpResult<{ _id: ObjectID }>> => {
  const { db, close } = await connect();
  const collection = db.collection(collName);
  const response = await collection.insertOne(user);
  close();
  return response;
};

export const retrieveUser = async (
  criterion: { [key: string]: any },
  collName = 'Users'
): Promise<User> => {
  const { db, close } = await connect();
  const collection = db.collection(collName);
  const response = await collection.findOne(criterion);
  close();
  return response;
};

export default { createUser, retrieveUser };
