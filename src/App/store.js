import { configureStore } from '@reduxjs/toolkit';
import loginReducer from '../components/LogIn/loginSlice';

export default configureStore({
    reducer: {
        login: loginReducer,
    }
})