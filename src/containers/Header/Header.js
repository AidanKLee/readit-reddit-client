import React from "react";
import './header.css';
import ReaditLogo from '../../assets/logo.svg';
import Communities from "../../components/Communities/Communities";
import SearchBar from "../../components/SearchBar/SearchBar";
import MainLinks from "../../components/MainLinks/MainLinks";
import NewPost from '../../components/NewPost/NewPost';
import Login from '../../components/LogIn/Login';
import User from "../../components/User/User";
import Hamburger from "../../components/Hamburger/Hamburger";
import { useSelector } from 'react-redux'

const Header = () => {

    const login = useSelector(state => state.login)

    return (
        <header id='header' data-test='header'>
            
            <div id='headerWrapper'>
                <div id='headerWrapperLeft'>
                    <div id='headerLogoWrapper'>
                        <img id='headerLogo' src={ReaditLogo} alt='Readit Logo' data-test='headerLogo'/>
                        <span id='headerLogoText' data-test='headerLogoText'>
                            READIT
                        </span>
                    </div>
                    {login.authorization ? <Communities /> : undefined}
                    <SearchBar />                
                </div>
                <div id='headerWrapperRight'>
                    {login.authorization ? <NewPost /> : undefined}
                    <MainLinks />
                    {!login.authorization ? <Login /> : undefined}
                    {login.authorization ? <User /> : undefined}
                    <Hamburger />
                </div>
            </div>
        </header>
    );
};

export default Header;