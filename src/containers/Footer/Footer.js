import React from "react";
import './footer.css';
import { useSelector } from 'react-redux';
import { selectMenu } from "../Menu/menuSlice";

const Footer = () => {

    const menu = useSelector(selectMenu);

    return (
        <footer className={menu.menuOpen ? 'blur' : ''}>
            <div id='footerWrapper'>
                Footer
            </div>
        </footer>
    );
};

export default Footer;