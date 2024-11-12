import { createSlice } from '@reduxjs/toolkit'

const MusicSlice = createSlice({
    name: 'music',
    initialState: {
        playing: false,
    },
    reducers: {
        toggleMusic: (state) => {
            state.playing = !state.playing
        },
    },
})

export const { toggleMusic } = MusicSlice.actions
export default MusicSlice.reducer
