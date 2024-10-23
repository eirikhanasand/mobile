import { createSlice } from "@reduxjs/toolkit"

// Game Slice
export const GameSlice = createSlice({
    name: "game",
    initialState: {
        gameID: null
    },
    reducers: {
        // Sets the game
        setGame(state, action) {
            state.gameID = action.payload
        },
    }
})

// Exports the change function
export const { setGame } = GameSlice.actions

// Exports the name slice
export default GameSlice.reducer
