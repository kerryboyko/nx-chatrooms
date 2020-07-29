import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import loggerMiddleware from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import hello from './slices/hello';
import chatrooms from './slices/chatrooms';

const store = configureStore({
  reducer: {
    hello,
    chatrooms,
  },
  middleware: [...getDefaultMiddleware(), thunkMiddleware, loggerMiddleware],
});

export default store;
