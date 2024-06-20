import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface LoginState {
  value: boolean;
}

const initialState: LoginState = {
  value: false,
};

export const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    logIn: (state) => {
      state.value = true;
    },
    logOut: (state) => {
      state.value = false;
    },
  },
});
export const { logIn, logOut } = loginSlice.actions;

export default loginSlice.reducer;
