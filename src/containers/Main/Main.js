import React from "react";
import './main.css';
import { useSelector } from 'react-redux';
import { selectMenu } from "../Menu/menuSlice";

const Main = () => {

    const menu = useSelector(selectMenu);

    return (
        <main className={menu.menuOpen ? 'blur' : ''}>
            Main
        </main>
    );
};

export default Main;