import { createSlice } from '@reduxjs/toolkit'

export const menuSlice = createSlice({
  name: 'showMenu',
  initialState: {
    value: true, // false means menu is closed, true means menu is open
  },
  reducers: {
    toggleMenu: (state) => {
      state.value = !state.value
    },
  },
})

// Action creators are generated for each case reducer function
export const { toggleMenu } = menuSlice.actions

export default menuSlice.reducer;