import { createSlice } from "@reduxjs/toolkit"

// Game Slice
export const GameSlice = createSlice({
    name: "game",
    initialState: {
        gameID: null,
        joined: false
    },
    reducers: {
        // Sets the game
        setGame(state, action) {
            state.gameID = action.payload
        },
        setJoined(state, action) {
            state.joined = action.payload
        }
    }
})

// Exports the change function
export const { setGame, setJoined } = GameSlice.actions

// Exports the name slice
export default GameSlice.reducer
