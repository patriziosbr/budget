import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import notaSpeseService from './notaSpeseService';

const initialState = {
  notaSpese: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// Get notaSpese
export const getNotaSpese = createAsyncThunk(
  'notaSpese/get',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await notaSpeseService.getNotaSpese(token);
    } catch (error) {
      const message =
        (error.response?.data?.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create a new match
export const createNotaSpese = createAsyncThunk(
  'notaSpese/create',
  async (notaSpeseData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await notaSpeseService.createNotaSpese(notaSpeseData, token);
    } catch (error) {
      const message =
        (error.response?.data?.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update notaSpese
export const updateNotaSpese = createAsyncThunk(
  'notaSpese/update',
  async (data, thunkAPI) => {
    debugger
    if(data) {
      try {
        const token = thunkAPI.getState().auth.user.token;
        const notaSpeseId = data.notaID;
        const notaSpeseData = data;
        return await notaSpeseService.updateNotaSpese(notaSpeseId, notaSpeseData, token);
      } catch (error) {
        const message =
          (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
      }
    } else {
      try {
        const token = thunkAPI.getState().auth.user.token;
        const updatedBudgetes = await Promise.all(
          data.map(async (notaSpese) => {
            const notaSpeseId = notaSpese.notaSpeseId;
            const notaSpeseData = notaSpese;
            return await notaSpeseService.updateNotaSpese(notaSpeseId, notaSpeseData, token);
          })
        );
        return updatedBudgetes;
      } catch (error) {
        const message =
          (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
      }
    }
  }
);

const notaSpeseSlice = createSlice({
  name: 'notaSpese',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createNotaSpese.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createNotaSpese.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.notaSpese.push(action.payload);
      })
      .addCase(createNotaSpese.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateNotaSpese.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateNotaSpese.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const index = state.notaSpese.findIndex((notaSpese) => notaSpese._id === action.payload._id);
        if (index !== -1) {
          state.notaSpese[index] = action.payload;
        }
      })
      .addCase(updateNotaSpese.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getNotaSpese.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getNotaSpese.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.notaSpese = action.payload;
      })
      .addCase(getNotaSpese.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = notaSpeseSlice.actions;
export default notaSpeseSlice.reducer;



// export const updateEvent = createAsyncThunk(
//   'match/update',
//   async (data, thunkAPI) => {
//     try {
//       const state = thunkAPI.getState();
//       const token = state.auth.user.token;
//       const eventId = data.matchId; // Assuming you pass the eventId as part of the data parameter
//       const matchData = {
//         ...data.matchData, // Assuming you pass other event data fields in eventData
//       };

//       return await budgetService.updateEvent(eventId, matchData, token);
//     } catch (error) {
//       const message =
//         (error.response &&
//           error.response.data &&
//           error.response.data.message) ||
//         error.message ||
//         error.toString();
//       return thunkAPI.rejectWithValue(message);
//     }
//   }
// );
