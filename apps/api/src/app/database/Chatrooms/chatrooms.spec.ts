/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  createChatroom,
  addMembersToChatroom,
  readChatroom,
  appendToLog,
  batchAppendToLog,
} from './chatrooms';
import connect from '../connect';
import type { ChatMessage } from '@chatrooms/api-interfaces';

const wait = (time: number) =>
  new Promise((resolve) => setTimeout(resolve, time));

describe('chatrooms', () => {
  describe('createChatroom', () => {
    it('creates a chatroom', async () => {
      const testResult: any = await createChatroom(
        'alpha',
        'brian',
        'test-Chatrooms'
      );

      expect(testResult).toEqual({
        _id: testResult._id,
        logs: [],
        members: ['brian'],
        roomName: 'alpha',
      });
    });
    it(`doesn't create a chatroom if it already exists, just joins the user`, async () => {
      const testResult = await createChatroom(
        'alpha',
        'carl',
        'test-Chatrooms'
      );
      expect(testResult).toEqual({
        _id: testResult._id,
        logs: [],
        members: ['brian', 'carl'],
        roomName: 'alpha',
      });
    });
  });
  describe('addMembersToChatroom', () => {
    it('joins a chatroom', async () => {
      const testResult: any = await addMembersToChatroom(
        'alpha',
        'david',
        'test-Chatrooms'
      );

      expect(testResult).toEqual({
        _id: testResult._id,
        logs: [],
        members: ['brian', 'carl', 'david'],
        roomName: 'alpha',
      });
    });
    it(`Doesn't add the same name twice`, async () => {
      const testResult: any = await addMembersToChatroom(
        'alpha',
        'david',
        'test-Chatrooms'
      );
      expect(testResult).not.toEqual({
        _id: testResult._id,
        logs: [],
        members: ['brian', 'carl', 'david', 'david'],
        roomName: 'alpha',
      });
      expect(testResult).toEqual({
        _id: testResult._id,
        logs: [],
        members: ['brian', 'carl', 'david'],
        roomName: 'alpha',
      });
    });
    it(`creates a chatroom that doesn't exist`, async () => {
      const testResult: any = await addMembersToChatroom(
        'beta',
        'ernie',
        'test-Chatrooms'
      );
      expect(testResult).toEqual({
        _id: testResult._id,
        logs: [],
        members: ['ernie'],
        roomName: 'beta',
      });
    });
  });
  describe('readChatroom', () => {
    it('reads a chatroom', async () => {
      const testResult: any = await readChatroom('alpha', 'test-Chatrooms');

      expect(testResult).toEqual({
        _id: testResult._id,
        logs: [],
        members: ['brian', 'carl', 'david'],
        roomName: 'alpha',
      });
    });
  });
  describe('appendToLog', () => {
    it('appends to a chatroom log', async () => {
      const chatMessages = Array(3)
        .fill(null)
        .map((_n, i: number) => ({
          type: 'CLIENT::message',
          roomName: 'alpha',
          message: `message group 1, ${i}`,
          timeStamp: new Date(),
          sender: 'brian',
          senderId: 'brian',
        }));
      const chatMessages2 = Array(3)
        .fill(null)
        .map((_n, i: number) => ({
          type: 'CLIENT::message',
          roomName: 'alpha',
          message: `message group 2, ${i}`,
          timeStamp: new Date(),
          sender: 'carl',
          senderId: 'carl',
        }));
      const res1 = await appendToLog('alpha', chatMessages, 'test-Chatrooms');
      expect(res1.logs.map((log: ChatMessage): string => log.message)).toEqual([
        'message group 1, 0',
        'message group 1, 1',
        'message group 1, 2',
      ]);
      const res2 = await appendToLog('alpha', chatMessages2, 'test-Chatrooms');
      expect(res2.logs.map((log: ChatMessage): string => log.message)).toEqual([
        'message group 1, 0',
        'message group 1, 1',
        'message group 1, 2',
        'message group 2, 0',
        'message group 2, 1',
        'message group 2, 2',
      ]);
    });
  });
  describe('batchAppendToLog', () => {
    it('appends to a chatroom log, but only once every 10 seconds', async () => {
      jest.setTimeout(40000);
      const mockMsg = (b: number, n: number) => ({
        type: 'CLIENT::message',
        roomName: 'alpha',
        message: `batch ${b}, number ${n}`,
        timeStamp: new Date(),
        sender: 'brian',
        senderId: 'brian',
      });
      const batchAlpha = batchAppendToLog('alpha', 'test-Chatrooms');
      batchAlpha(
        Array(3)
          .fill(null)
          .map((_x, i: number) => mockMsg(1, i))
      );
      const time0: any = await readChatroom('alpha', 'test-Chatrooms');
      expect(time0.logs).toHaveLength(6);
      await wait(15000);
      const time15: any = await readChatroom('alpha', 'test-Chatrooms');
      expect(time15.logs).toHaveLength(9);
      // queue first bacth.
      batchAlpha(
        Array(3)
          .fill(null)
          .map((_x, i: number) => mockMsg(2, i))
      );
      await wait(5000);
      // sending another batch should reset the clock.
      batchAlpha(
        Array(3)
          .fill(null)
          .map((_x, i: number) => mockMsg(3, i))
      );
      await wait(2000);
      const time17: any = await readChatroom('alpha', 'test-Chatrooms');
      expect(time17.logs).toHaveLength(9);
      await wait(4000);
      // even though it was 10 seconds since we sent the first batch,
      // the clock should have reset when the second batch was queued.
      const time21: any = await readChatroom('alpha', 'test-Chatrooms');
      expect(time21.logs).toHaveLength(9);
      await wait(6000);
      // now it should all update in one big batch.
      const time26: any = await readChatroom('alpha', 'test-Chatrooms');
      expect(time26.logs).toHaveLength(15);
      expect(time26.logs.map((log) => log.message)).toEqual([
        'message group 1, 0',
        'message group 1, 1',
        'message group 1, 2',
        'message group 2, 0',
        'message group 2, 1',
        'message group 2, 2',
        'batch 1, number 0',
        'batch 1, number 1',
        'batch 1, number 2',
        'batch 2, number 0',
        'batch 2, number 1',
        'batch 2, number 2',
        'batch 3, number 0',
        'batch 3, number 1',
        'batch 3, number 2',
      ]);
    });
  });
  afterAll(async () => {
    const { db, close } = await connect();
    await db.dropCollection('test-Chatrooms');
    close();
    return;
  });
});
