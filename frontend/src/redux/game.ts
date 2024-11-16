import { createSlice } from "@reduxjs/toolkit"

// Game Slice
export const GameSlice = createSlice({
    name: "game",
    initialState: {
        gameID: null,
        joined: false,
        players: [],
        filters: []
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
        },
        setFilters(state, action) {
            state.filters = action.payload
        }
    }
})

// Exports the change function
export const { setGame, setJoined, setPlayers, setFilters } = GameSlice.actions

// Exports the name slice
export default GameSlice.reducer
