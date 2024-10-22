import AsyncStorage from "@react-native-async-storage/async-storage"
import { combineReducers, configureStore } from "@reduxjs/toolkit"
import { persistReducer } from "redux-persist"
import LangReducer from "@redux/lang"
import ThemeReducer from "@redux/theme"
import { thunk } from "redux-thunk"

// Combines all reducers
const reducers = combineReducers({
    theme: ThemeReducer,
    lang: LangReducer,
})

// Function to localstore redux state with key:root and AsyncStorage, as well as
// whitelists allowed keys.
const saveState = {
    key: "root",
    storage: AsyncStorage,
    whitelist: [
        "lang",
        "theme",
    ]
}

// Stores the state
const persistedReducer = persistReducer(saveState, reducers)

// Configures store with combind reducer and middleware for AsyncStorage
const Store = configureStore({
    reducer: persistedReducer,
    middleware: () => [thunk] as any
})

export default Store
