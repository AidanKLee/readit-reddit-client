import React from "react";
import './footer.css';
import { useSelector } from 'react-redux';
import { selectMenu } from "../Menu/menuSlice";

const Footer = () => {

    const menu = useSelector(selectMenu);

    return (
        <footer className={menu.menuOpen ? 'blur' : ''}>
            <div className='footerWrapper'>
                <p>&copy; 2021 Readit - Reddit Client</p>
                <p>Return To Top</p>
            </div>
        </footer>
    );
};

export default Footer;