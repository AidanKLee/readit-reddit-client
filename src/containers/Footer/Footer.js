import React from "react";
import './footer.css';
import { useSelector } from 'react-redux';
import { selectMenu } from "../Menu/menuSlice";

const Footer = () => {

    const menu = useSelector(selectMenu);

    return (
        <footer className={menu.menuOpen ? 'blur' : ''}>
            <div id='footerWrapper'>
                &copy; 2021 Readit - Reddit Client: <a target='_blank' rel="noreferrer" href='https://aidanklee.github.io/kaiGenPortfolio/'>Kai-Gen</a>
            </div>
        </footer>
    );
};

export default Footer;