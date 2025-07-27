import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import notaSpeseReducer from '../features/notaSpese/notaSpeseSlice'
import schedaSpeseReducer from '../features/schedaSpese/schedaSpeseSlice'
import menuShowReducer from '../features/utils/menuSlice'



export const store = configureStore({
  reducer: {
    auth: authReducer,
    notaSpese: notaSpeseReducer,
    schedaSpese: schedaSpeseReducer,
    menuShow: menuShowReducer,
    // matches: matchReducer,
    // matchBets: matchesReducer,
    // overAll: overall,
  },
})
