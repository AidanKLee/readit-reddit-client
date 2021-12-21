import { configureStore } from '@reduxjs/toolkit';
import loginReducer from '../components/LogIn/loginSlice';
import menuRecducer from '../containers/Menu/menuSlice';

export default configureStore({
    reducer: {
        login: loginReducer,
        menu: menuRecducer
    }
})