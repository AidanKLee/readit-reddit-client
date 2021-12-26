import { configureStore } from '@reduxjs/toolkit';
import loginReducer from '../components/LogIn/loginSlice';
import menuRecducer from '../containers/Menu/menuSlice';
import communitiesReducer from '../components/Communities/communitiesSlice';
import searchBarReducer from '../components/SearchBar/searchBarSlice';
import mainReducer from '../containers/Main/mainSlice';

export default configureStore({
    reducer: {
        login: loginReducer,
        menu: menuRecducer,
        communities: communitiesReducer,
        searchBar: searchBarReducer,
        main: mainReducer
    }
});