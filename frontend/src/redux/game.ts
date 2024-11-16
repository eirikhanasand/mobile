import { createSlice } from "@reduxjs/toolkit"

// Game Slice
export const GameSlice = createSlice({
    name: "game",
    initialState: {
        gameID: null,
        joined: false,
        players: []
    },
    reducers: {
        // Sets the game
        setGame(state, action) {
            state.gameID = action.payload
        },
        setJoined(state, action) {
            state.joined = action.payload
        },
        setPlayers(state, action) {
            state.players = action.payload
        }
    }
})

// Exports the change function
export const { setGame, setJoined, setPlayers } = GameSlice.actions

// Exports the name slice
export default GameSlice.reducer
