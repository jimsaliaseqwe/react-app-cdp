import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';

import {
    FLUSH,
    PAUSE,
    PERSIST,
    persistReducer,
    PURGE,
    REGISTER,
    REHYDRATE,
} from 'redux-persist';

import storage from 'redux-persist/lib/storage';

import AuthReducer from './features/auth';
import AuthEventReducer from './features/authEvent';
import BoResources from './features/boResources';

const persistConfig = {
    key: 'root',
    storage,
};

const reducers = combineReducers({
    auth: AuthReducer,
    authEvent: AuthEventReducer,
    boResources: BoResources,
});

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    FLUSH,
                    REHYDRATE,
                    PAUSE,
                    PERSIST,
                    PURGE,
                    REGISTER,
                ],
            },
        }),
});

export { store };
