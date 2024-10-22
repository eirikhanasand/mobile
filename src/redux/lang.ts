import { createSlice } from "@reduxjs/toolkit"

// Language Slice
export const LangSlice = createSlice({
    name: "lang",
    initialState: {
        // true is Norwegian, false is English
        lang: true
    },
    reducers: {
        // Changes language
        changeLang(state) {
            state.lang = !state.lang
        },
    }
})

// Exports the change function
export const { changeLang } = LangSlice.actions

// Exports the language slice
export default LangSlice.reducer
