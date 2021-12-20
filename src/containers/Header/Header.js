import React from "react";
import './header.css';
import ReaditLogo from '../../assets/logo.svg';

const Header = () => {
    return (
        <header>
            <div id='headerWrapper'>
                <div id='headerLogoWrapper'>
                    <img id='headerLogo' src={ReaditLogo} alt='Readit Logo'/>
                    <span id='headerLogoText'>
                        READIT
                    </span>
                </div>
            </div>
        </header>
    );
};

export default Header;