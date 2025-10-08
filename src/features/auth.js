import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isAuth: false,
    token: '',
    userid: '',
    expiredAt: '',
    role: '',
    username: '',
    name: '',
};

export const auth = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        acceptLogin: (state, { payload }) => {
            state.isAuth = true;

            if (payload.token) {
                state.token = payload.token;
            }
            if (payload.expiredAt) {
                state.expiredAt = payload.expiredAt;
            }
            if (payload.username) {
                state.username = payload.username;
            }
            if (payload.name) {
                state.name = payload.name;
            }
            if (payload.userid) {
                state.userid = payload.userid;
            }
            if (payload.role) {
                state.role = payload.role;
            }
        },
        restore(state) {
            state.isAuth = initialState.isAuth;
            state.token = initialState.token;
            state.userid = initialState.userid;
            state.expiredAt = initialState.expiredAt;
            //state.username = initialState.username;
            //state.name = initialState.name;
            state.role = initialState.role;
        },
    },
});

export const { acceptLogin, restore } = auth.actions;

export default auth.reducer;
