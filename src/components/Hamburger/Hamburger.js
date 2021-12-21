import React from "react";
import './hamburger.css';

const Hamburger = () => {
    return (
        <div id='hamburgerWrapper'>
            <div id='hamburger'>
                <div id='line1' className="lines" data-test='line1'></div>
                <div id='line2' className="lines" data-test='line2'></div>
                <div id='line3' className="lines" data-test='line3'></div>
            </div>
        </div>
    );
};

export default Hamburger;