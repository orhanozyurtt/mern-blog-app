import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserInfoState {
  name: string;
  email: string;
}

const initialState: UserInfoState = {
  name: '',
  email: '',
};

export const userInfoSlice = createSlice({
  name: 'userInfo',
  initialState,
  reducers: {
    logIn: (state, action: PayloadAction<UserInfoState>) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
    },
    logOut: (state) => {
      state.name = '';
      state.email = '';
    },
  },
});

export const { logIn, logOut } = userInfoSlice.actions;

export default userInfoSlice.reducer;
