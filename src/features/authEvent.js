import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isAuth: false,
    token: '',
    userId: '',
    eventId: '',
    userPhone: '',
    userName: '',
    expiredAt: '',
    role: '',
};

export const authEvent = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        acceptEventLogin: (state, { payload }) => {
            state.isAuth = true;

            if (payload.token) {
                state.token = payload.token;
            }
            if (payload.expiredAt) {
                state.expiredAt = payload.expiredAt;
            }
            if (payload.userName) {
                state.userName = payload.userName;
            }
            if (payload.userId) {
                state.userId = payload.userId;
            }
            if (payload.eventId) {
                state.eventId = payload.eventId;
            }
            if (payload.role) {
                state.role = payload.role;
            }
            if (payload.userPhone) {
                state.userPhone = payload.userPhone;
            }
        },
        restore(state) {
            state.isAuth = initialState.isAuth;
            state.token = initialState.token;
            state.userId = initialState.userId;
            state.expiredAt = initialState.expiredAt;
            state.userName = initialState.userName;
            state.role = initialState.role;
            state.userPhone = initialState.userPhone;
            state.eventId = initialState.eventId;
        },
    },
});

export const { acceptEventLogin, restore } = authEvent.actions;

export default authEvent.reducer;
