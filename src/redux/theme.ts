import { createSlice } from "@reduxjs/toolkit"
import Dark from "@themes/dark"
import Light from "@themes/light"

export const ThemeSlice = createSlice({
    name: "theme",
    initialState: {
        value: 0,
        isDark: true,
        theme: Dark
    },
    reducers: {
        // Changes theme
        changeTheme(state) {
            // Increments state.theme by 1
            state.value = state.value === 1 ? 0 : 1
            state.isDark = state.value === 1 ? true : false
            state.theme = state.value === 1 ? Dark : Light
        },
        // Resets theme
        resetTheme(state) {
            state.value = 0
            state.isDark = true
            state.theme = Dark
        },
        // Sets a specific theme
        setTheme(state, action) {
            state.value = action.payload
            state.isDark = true
            state.theme = Dark
        }
    }
})

export const { changeTheme, resetTheme, setTheme } = ThemeSlice.actions
export default ThemeSlice.reducer
