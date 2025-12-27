import { combineReducers, configureStore } from '@reduxjs/toolkit'
import userSlice from './slices/userSlice'
import { loggerMiddleware } from './middleware/loggerMiddleware'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistReducer, persistStore } from 'redux-persist';

let persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['user']
}

let rootReducer = combineReducers({
    user: userSlice
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (gm) => gm({
        serializableCheck: false
    }).concat(loggerMiddleware)
})

export const persistor = persistStore(store);