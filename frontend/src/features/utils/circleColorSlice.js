import { createSlice } from '@reduxjs/toolkit'

export const circleColorSlice = createSlice({
  name: 'circleColor',
  initialState: {
    emailColorMappings: [] // Array of {email, randomColor, textColor}
  },
  reducers: {
    addEmailColorMapping: (state, action) => {
      const { email, randomColor, textColor } = action.payload;
      
      // Check if email already exists
      const existingIndex = state.emailColorMappings.findIndex(item => item.email === email);
      
      if (existingIndex === -1) {
        // Add new mapping if email doesn't exist
        state.emailColorMappings.push({ email, randomColor, textColor });
      }
    },
    
    updateEmailColorMapping: (state, action) => {
      const { email, randomColor, textColor } = action.payload;
      const existingIndex = state.emailColorMappings.findIndex(item => item.email === email);
      
      if (existingIndex !== -1) {
        state.emailColorMappings[existingIndex] = { email, randomColor, textColor };
      }
    },
    
    removeEmailColorMapping: (state, action) => {
      const email = action.payload;
      state.emailColorMappings = state.emailColorMappings.filter(item => item.email !== email);
    },
    
    clearAllMappings: (state) => {
      state.emailColorMappings = [];
    }
  },
})

export const { 
  addEmailColorMapping, 
  updateEmailColorMapping, 
  removeEmailColorMapping, 
  clearAllMappings 
} = circleColorSlice.actions;

export default circleColorSlice.reducer;