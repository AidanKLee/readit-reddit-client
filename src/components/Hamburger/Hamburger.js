import React from "react";
import './hamburger.css';
import { toggleMenu } from "../../containers/Menu/menuSlice";
import { useDispatch } from 'react-redux';

const Hamburger = () => {

    const dispatch = useDispatch();

    const handleToggleMenu = () => {
        dispatch(toggleMenu());
    }

    return (
        <div id='hamburgerWrapper' onClick={handleToggleMenu}>
            <div id='hamburger'>
                <div id='line1' className="lines" data-test='line1'></div>
                <div id='line2' className="lines" data-test='line2'></div>
                <div id='line3' className="lines" data-test='line3'></div>
            </div>
        </div>
    );
};

export default Hamburger;