import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeMenu, selectMenu } from '../../containers/Menu/menuSlice';
import './fullscreen.css';
import { selectFullscreen } from './fullscreenSlice';

const Fullscreen = () => {

    const dispatch = useDispatch();

    const fullscreen = useSelector(selectFullscreen);

    const menu = useSelector(selectMenu);

    const handleClick = () => {
        const app = document.documentElement;
        if (document.fullscreenElement !== app) {
            app.requestFullscreen({navigationUI: 'hide'}).catch(e =>alert('Error Opening Fullscreen: ' + e))
        } else {
            document.exitFullscreen();
        }
        if (menu.menuOpen) {
            dispatch(closeMenu())
        }
    }


    useEffect(() => {
        const fSTimeout = setTimeout(() => {
            const app = document.documentElement
            if (fullscreen && document.fullscreenElement === app && window.screen.orientation && window.screen.orientation.lock) {
                window.screen.orientation.lock('portrait');
            }
        },100)
        return () => clearTimeout(fSTimeout)
    },[fullscreen])
    

    return (
        <div onClick={handleClick} className='fullscreen'>            
            {!fullscreen ? <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg> : <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/></svg>}
        </div>
    )
}

export default Fullscreen;