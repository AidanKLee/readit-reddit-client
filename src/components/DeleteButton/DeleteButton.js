import React, { useEffect, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import { stopScroll } from '../../utilities/functions';
import reddit from '../../utilities/redditAPI';
import './deleteButton.css';

const DeleteButton = (props) => {

    const { name, text, type } = props;

    const [ warning, setWarning ] = useState(false);
    const [ scrollPos, setScrollPos ] = useState(0);

    const handleDelete = () => {
        reddit.delete(name);
        setWarning(false);
    }

    const handleWarning = () => {
        setWarning(!warning);
        setScrollPos(window.scrollY);
    }

    const preventScroll = () => {
        stopScroll(scrollPos);
    }

    const prevent = (e) => {
        e.preventDefault();
    }

    useEffect(() => {
        if (warning) {
            window.addEventListener('scroll', preventScroll, {passive: false});
            window.addEventListener('mousewheel', prevent, {passive: false});
            window.addEventListener('touchmove', prevent, {passive: false});
        }
        
        
        return () => {
            window.removeEventListener('scroll', preventScroll);
            window.removeEventListener('mousewheel', prevent);
            window.addEventListener('touchmove', prevent, {passive: false});
        }
            // eslint-disable-next-line react-hooks/exhaustive-deps
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