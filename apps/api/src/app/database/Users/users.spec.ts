import { createUser, retrieveUser } from './users';
import connect from '../connect';

const data = {
  roles: {
    'http://localhost:3000/roles': [
      'admin',
      'user',
      'email:brian.boyko@gmail.com',
    ],
  },
  given_name: 'Brian',
  family_name: 'Boyko',
  nickname: 'brian.boyko',
  name: 'Brian Boyko',
  picture:
    'https://lh3.googleusercontent.com/a-/AOh14Gja5QUrl-n0Lo5unFDTRTXfr-AWA7nnNwodWeXIfg',
  locale: 'en',
  updated_at: new Date('2020-07-28T06:04:33.806Z'),
  email: 'brian.boyko@gmail.com',
  email_verified: true,
  sub: 'google-oauth2|116939662738345637139',
};

describe('Users', () => {
  describe(`createUser()`, () => {
    it('correctly creates a user in the DB', async () => {
      const response = await createUser(data, 'test-Users');
      expect(response.insertedCount).toBe(1);
      expect(response.result.ok).toBe(1);
    });
  });
  describe(`retrieveUser()`, () => {
    it('correctly retrieves a user in the DB', async () => {
      const response = await retrieveUser(
        { email: 'brian.boyko@gmail.com' },
        'test-Users'
      );
      expect(response).toEqual({ ...data, _id: response['_id'] });
    });
  });
  afterAll(async () => {
    const { db, close } = await connect();
    await db.dropCollection('test-Users');
    close();
    return;
  });
});
