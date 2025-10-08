import { createSlice } from '@reduxjs/toolkit';

export const BOResourceName = {
    PROJECT: 'project',
    PROJECT_DETAIL: 'projectDetail',
    EVENT_LIVE: 'eventLive',
    EVENT_LIVE_DETAIL: 'eventLiveDetail',
    PARTNER_INFO: 'partnerInfo',
};

const initialState = {};

export const boResources = createSlice({
    name: 'boResources',
    initialState,
    reducers: {
        setResource: (state, { payload }) => {
            state[payload.key] = {
                data: payload.data,
                expiredAt: payload.expiredAt,
            };
        },
        restore(state) {
            state = { ...initialState };
        },
    },
});

export const { setResource, restore } = boResources.actions;

export default boResources.reducer;
