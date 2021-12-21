import React from 'react';
import './menu.css';
import Login from '../../components/LogIn/Login';
import Communities from '../../components/Communities/Communities';
import NewPost from '../../components/NewPost/NewPost';
import MainLinks from '../../components/MainLinks/MainLinks';
import User from '../../components/User/User';
import { useSelector, useDispatch } from 'react-redux';
import { selectLogin } from '../../components/LogIn/loginSlice';
import { toggleMenu, selectMenu } from './menuSlice';

const Menu = () => {

    const login = useSelector(selectLogin);
    const menu = useSelector(selectMenu);

    const dispatch = useDispatch();

    const handleToggleMenu = () => {
        dispatch(toggleMenu());
    }

    window.onresize = () => {
        if (window.innerWidth >= 720 && menu.menuOpen) {
            handleToggleMenu();
        }
    }

    return (
        <aside id='menu' className={menu.menuOpen ? 'openMenu' : ''}>
            <div id='menuWrapper'>
                <svg id='menuClose' onClick={handleToggleMenu} xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>
            </div>
            {!login.authorization ? <Login /> : undefined}
            {login.authorization || login.isLoading? <User /> : undefined}
            {login.authorization ? <NewPost /> : undefined}
            <MainLinks />
            {login.authorization ? <Communities /> : undefined}
        </aside>
    );
};

export default Menu;