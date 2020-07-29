import { createSlice } from '@reduxjs/toolkit';
import type { Dispatch } from '@reduxjs/toolkit';
import type { Chatroom, ChatMessage } from '@chatrooms/api-interfaces';
import store from '../store';

type ChatroomsState = Record<string, Chatroom>;
const blankChatroom = { members: [], roomName: '', logs: [] };

const chatroomsSlice = createSlice({
  name: 'chatrooms',
  initialState: {},
  reducers: {
    createRoom: (
      state: ChatroomsState,
      { payload }: { payload: Partial<Chatroom> }
    ) => {
      if (state[payload.roomName]) {
        // noop, should not create a room twice.
        return state;
      }

      state[payload.roomName] = { ...blankChatroom, ...payload };
    },
  },
});

const { actions, reducer } = chatroomsSlice;

export const { createRoom } = actions;

export const getLogsAndCreateRoom = (creator: string, roomName: string) => (
  dispatch: Dispatch,
  getState: () => typeof store
): void => {
  const existingState = getState();
  if (existingState.chatrooms[roomName]) {
    reject(`RoomName ${roomName} already exists on state.chatrooms`);
    return;
  }
  // TODO get logs from server.
  // const response = await database.getLogs(roomName);
  dispatch(createRoom({ roomName, logs: [], members: [creator] }));
};

export default reducer;
