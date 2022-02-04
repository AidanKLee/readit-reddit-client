import React, { useEffect, useState } from 'react';
import { stopScroll } from '../../utilities/functions';
import './media.css';

const Media = (props) => {

    const { viewMedia, toggleViewMedia } = props;
    const { src, alt, type, mediaOpen } = viewMedia;

    // const [ scrollPos, setScrollPos] = useState(0);

    const renderMedia = () => {
        if (type === 'video') {
            return <video controls><source src={src}/></video>
        } else if (type === 'image') {
            return <img src={src} alt={alt}/>
        }
    }

    const toggleView = (e) => {
        if (e.keyCode === 27) {
            toggleViewMedia(e, {src: src, type:''})
        }
    }

    useEffect(() => {
        if (mediaOpen) {
            document.documentElement.addEventListener('keydown', toggleView)
        }

        return () => document.documentElement.removeEventListener('keydown', toggleView)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[mediaOpen])
    
    // useEffect(() => {
    //     if (mediaOpen) {
    //         setScrollPos(window.scrollY);
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // },[])

    // const preventScroll = () => {
    //     stopScroll(scrollPos);
    // }

    // const prevent = (e) => {
    //     e.preventDefault();
    // }

    // useEffect(() => {
    //     window.addEventListener('scroll', preventScroll, {passive: false});
    //     window.addEventListener('mousewheel', prevent, {passive: false});
    //     window.addEventListener('touchmove', prevent, {passive: false});
        
    //     return () => {
    //         window.removeEventListener('scroll', preventScroll);
    //         window.removeEventListener('mousewheel', prevent);
    //         window.removeEventListener('touchmove', prevent, {passive: false});
    //     }
    //         // eslint-disable-next-line react-hooks/exhaustive-deps
    // },[scrollPos])

    return (
        <div className='media'>
            <svg onClick={(e) => toggleViewMedia(e, {src: src, type:''})} xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>
            <div className='mediaOverlay' onClick={(e) => toggleViewMedia(e, {src: src, type:''})}></div>
            {renderMedia()}
        </div>
    )
}

export default Media;