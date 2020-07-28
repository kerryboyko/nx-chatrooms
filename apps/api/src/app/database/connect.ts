import { MongoClient, MongoError, Db } from 'mongodb';
import sharedEnvironment from '@chatrooms/environments';

const connect = (
  dbName: string = sharedEnvironment.MONGO_DB_NAME
): Promise<{ db: Db; close: () => void }> =>
  new Promise((resolve, reject) => {
    const URL = `${sharedEnvironment.MONGO_URL}:${sharedEnvironment.MONGO_PORT}/${dbName}`;
    const client = new MongoClient(URL);
    client.connect((err: MongoError) => {
      if (err) {
        client.close();
        reject(err);
        return;
      }
      console.log(`Connected to Mongo Database`);
      const db: Db = client.db(dbName);
      resolve({ db, close: () => client.close() });
    });
  });

export default connect;
