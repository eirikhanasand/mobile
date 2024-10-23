import { createSlice } from "@reduxjs/toolkit"

// Name Slice
export const NameSlice = createSlice({
    name: "name",
    initialState: {
        name: null
    },
    reducers: {
        // Sets the player name
        setName(state, action) {
            state.name = action.payload
        },
    }
})

// Exports the change function
export const { setName } = NameSlice.actions

// Exports the name slice
export default NameSlice.reducer
