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

const Header = () => {
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
                    <Communities />
                    <SearchBar />                
                </div>
                <div id='headerWrapperRight'>
                    <NewPost />
                    <MainLinks />
                    <Login />
                    <User />
                    <Hamburger />
                </div>
            </div>
        </header>
    );
};

export default Header;