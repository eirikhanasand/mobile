import AsyncStorage from "@react-native-async-storage/async-storage"
import { combineReducers, configureStore } from "@reduxjs/toolkit"
import { persistReducer } from "redux-persist"
import LangReducer from "./lang"
import ThemeReducer from "./theme"
import NameReducer from "./name"
import GameReducer from "./game"
import { thunk } from "redux-thunk"

// Combines all reducers
const reducers = combineReducers({
    theme: ThemeReducer,
    lang: LangReducer,
    name: NameReducer,
    game: GameReducer
})

// Function to localstore redux state with key:root and AsyncStorage, as well as
// whitelists allowed keys.
const saveState = {
    key: "root",
    storage: AsyncStorage,
    whitelist: [
        "lang",
        "theme",
        "name",
        "game"
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
