import React, { useEffect, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import reddit from '../../utilities/redditAPI';
import './deleteButton.css';

const DeleteButton = (props) => {

    const { name, text, type } = props;

    const [ warning, setWarning ] = useState(false);
    // const [ scrollPos, setScrollPos ] = useState(0);

    const handleDelete = () => {
        reddit.delete(name);
        setWarning(false);
    }

    const handleWarning = () => {
        setWarning(!warning);
        // setScrollPos(window.scrollY);
    }

    // const stopScrolling = (e) => {
    //     if ((e.type !== 'touchmove' && e.type !== 'scroll') || (e.type === 'touchmove' && e.touches.length < 2)) {
    //         e.preventDefault();
    //         e.stopPropagation();
    //     } else if (e.type === 'scroll') {
    //         stopScroll(scrollPos)
    //     }
    //     return false;
    // }

    // useEffect(() => {
    //     // const page = document.documentElement;
    //     const eventTypes = 'scroll mousewheel touchmove'.split(' ')
    //     if (warning) {
    //         eventTypes.forEach(type => {
    //             window.addEventListener(type, stopScrolling, {passive: false});
    //         })
    //         return () => {
    //             eventTypes.forEach(type => {
    //                 window.removeEventListener(type, stopScrolling, {passive: false});
    //             })
    //         }
    //     }
    // },[warning])

    useEffect(() => {
        const page = document.documentElement;
        if (warning) {
            page.style.overflow = 'hidden'
            return () => page.style.overflow = 'auto'
        }
    },[warning])

    return (
        <div className='delete'>
            <CSSTransition in={warning} timeout={300} classNames='tran13' mountOnEnter={true} unmountOnExit={true}><div className='deleteWarning'>Delete this {type}?<div onClick={handleDelete}>Yes</div><div onClick={handleWarning}>No</div></div></CSSTransition>
            <div onClick={handleWarning} className='deleteButton'>
                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z"/></svg>
                {text ? <p>Delete</p> : undefined}
            </div>
        </div> 
    )
}

export default DeleteButton;