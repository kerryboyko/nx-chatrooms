import { createSlice, Dispatch } from '@reduxjs/toolkit';

const wait = (time: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, time);
  });

const helloSlice = createSlice({
  name: 'hello',
  initialState: 'world',
  reducers: {
    sayHello: (state: string, action: { payload: string }) => {
      if (action.payload) {
        return action.payload;
      }
      return state;
    },
  },
});

const { actions, reducer } = helloSlice;

export const { sayHello } = actions;

export const waitAndSayHello = (word: string) => async (
  dispatch: Dispatch
): Promise<void> => {
  await wait(1000);
  dispatch(sayHello(word));
};

export default reducer;
