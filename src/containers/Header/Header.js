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
import { useSelector } from 'react-redux';
import { selectLogin } from '../../components/LogIn/loginSlice';
import { selectMenu } from "../Menu/menuSlice";

const Header = (props) => {

    // console.log(props)

    const login = useSelector(selectLogin);
    const menu = useSelector(selectMenu);

    return (
        <header id='header' className={menu.menuOpen ? 'blur' : ''} data-test='header'>
            
            <div id='headerWrapper'>
                <div id='headerWrapperLeft'>
                    <div id='headerLogoWrapper'>
                        <img id='headerLogo' src={ReaditLogo} alt='Readit Logo' data-test='headerLogo'/>
                        <span id='headerLogoText' data-test='headerLogoText'>
                            READIT
                        </span>
                    </div>
                    {login.authorization || login.isLoading ? <Communities /> : undefined}
                    <SearchBar />                
                </div>
                <div id='headerWrapperRight'>
                    {login.authorization ? <NewPost /> : undefined}
                    <MainLinks />
                    {!login.authorization ? <Login /> : undefined}
                    {login.authorization || login.isLoading ? <User /> : undefined}
                    <Hamburger />
                </div>
            </div>
        </header>
    );
};

export default Header;