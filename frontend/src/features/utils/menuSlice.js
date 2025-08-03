import { createSlice } from '@reduxjs/toolkit'

export const menuSlice = createSlice({
  name: 'showMenu',
  initialState: {
    value: false, // true means menu is closed, false means menu is open
  },
  reducers: {
    toggleMenu: (state) => {
      state.value = !state.value
    },
    closeMenu: (state) => {
      state.value = true
    },
  },
})

// Action creators are generated for each case reducer function
export const { toggleMenu, closeMenu } = menuSlice.actions

export default menuSlice.reducer;