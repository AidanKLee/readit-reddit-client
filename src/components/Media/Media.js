import React, { useEffect, useState } from 'react';
import { stopScroll } from '../../utilities/functions';
import './media.css';

const Media = (props) => {

    const { viewMedia, toggleViewMedia } = props;
    const { src, alt, type, mediaOpen } = viewMedia;

    const [ scrollPos, setScrollPos] = useState(0);
    const [ zoom, setZoom ] = useState(false);
    // const [ dragStartPos, setDragStartPos ] = useState({x: 0, y: 0});

    let x;
    let y;
    let dragPosition = {x: 0, y: 0}

    const renderMedia = () => {
        if (type === 'video') {
            return <video controls><source src={src}/></video>
        } else if (type === 'image') {
            return <img onClick={handleImageClick} src={src} alt={alt}/>
        }
    }

    const toggleView = (e) => {
        if (e.keyCode === 27) {
            toggleViewMedia(e, {src: src, type:''})
        }
    }

    const handleImageClick = (e) => {
        console.log(e)
        const media = document.querySelector('.media');
        const img = document.querySelector('.media img');
        if (e.target.naturalHeight > media.clientHeight || e.target.naturalWidth > media.clientWidth) {
            !zoom ? setZoom(true) : setZoom(false);
            img.style.cursor = 'zoom-in';
        }
        
    }

    const dragStart = (e) => {
        // setDragStartPos({x: e.screenX, y:e.screenY})
        x = e.screenX
        y = e.screenY
    }

    const changePos = (e) => {
        // const { x, y } = dragStartPos;
        if (e.screenX > 0 && e.screenY > 0) {
            const img = document.querySelector('.media img');
            const media = document.querySelector('.media');
            const moveX = e.screenX - x
            const moveY = e.screenY - y

            let totalX = moveX + dragPosition.x
            let totalY = moveY + dragPosition.y

            if (e.target.width > media.clientWidth && totalX > (e.target.width - media.clientWidth) / 2) {
                totalX = (e.target.width - media.clientWidth) / 2;
            } else if (e.target.width > media.clientWidth && totalX < - (e.target.width - media.clientWidth) / 2) {
                totalX = - (e.target.width - media.clientWidth) / 2;
            } else if (e.target.width < media.clientWidth) {
                totalX = 0;
            }

            if (e.target.height > media.clientHeight && totalY > (e.target.height - media.clientHeight) / 2) {
                totalY = (e.target.height - media.clientHeight) / 2;
            } else if (e.target.height > media.clientHeight && totalY < - (e.target.height - media.clientHeight) / 2) {
                totalY = - (e.target.height - media.clientHeight) / 2;
            } else if (e.target.height < media.clientHeight) {
                totalY = 0;
            }

            img.style.transform = `translate(calc(-50% + ${totalX}px), calc(-50% + ${totalY}px))`;
        }
    }

    const dragEnd = (e) => {
        const img = document.querySelector('.media img')
        const media = document.querySelector('.media');

        img.style.cursor = 'zoom-out';

        const moveX = e.screenX - x
        const moveY = e.screenY - y

        let totalX = moveX + dragPosition.x
        let totalY = moveY + dragPosition.y

        if (e.target.width > media.clientWidth && totalX > (e.target.width - media.clientWidth) / 2) {
            totalX = (e.target.width - media.clientWidth) / 2;
        } else if (e.target.width > media.clientWidth && totalX < - (e.target.width - media.clientWidth) / 2) {
            totalX = - (e.target.width - media.clientWidth) / 2;
        } else if (e.target.width < media.clientWidth) {
            totalX = 0;
        }

        if (e.target.height > media.clientHeight && totalY > (e.target.height - media.clientHeight) / 2) {
            totalY = (e.target.height - media.clientHeight) / 2;
        } else if (totalY < - (e.target.height > media.clientHeight && e.target.height - media.clientHeight) / 2) {
            totalY = - (e.target.height - media.clientHeight) / 2;
        } else if (e.target.height < media.clientHeight) {
            totalY = 0;
        }

        dragPosition = {x: totalX, y: totalY}
    }

    useEffect(() => {
        const img = document.querySelector('.media img')
        if (zoom) {
            img.style.maxHeight = 'none';
            img.style.maxWidth = 'none';
            img.style.cursor = 'zoom-out';
            img.addEventListener('dragstart', dragStart);
            img.addEventListener('drag', changePos);
            img.addEventListener('dragend', dragEnd);

            return () => {
                img.style.maxHeight = '100%';
                img.style.maxWidth = '100%';
                img.style.transform = `translate(-50%, -50%)`;
                img.style.cursor = 'zoom-in';
                img.removeEventListener('drag', changePos);
                img.removeEventListener('dragstart', dragStart);
                img.removeEventListener('dragend', dragEnd);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[zoom])

    useEffect(() => {
        if (mediaOpen) {
            document.documentElement.addEventListener('keydown', toggleView)
            const img = document.querySelector('.media img');
            const media = document.querySelector('.media');

            if (img.naturalHeight > media.clientHeight || img.naturalWidth > media.clientWidth) {
                img.style.cursor = 'zoom-in';
            }
        }
        return () => document.documentElement.removeEventListener('keydown', toggleView)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[mediaOpen])
    
    useEffect(() => {
        if (mediaOpen) {
            setScrollPos(window.scrollY);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    const preventScroll = () => {
        stopScroll(scrollPos);
    }

    const prevent = (e) => {
        e.preventDefault();
    }

    useEffect(() => {
        window.addEventListener('scroll', preventScroll, {passive: false});
        window.addEventListener('mousewheel', prevent, {passive: false});
        window.addEventListener('touchmove', prevent, {passive: false});
        
        return () => {
            window.removeEventListener('scroll', preventScroll);
            window.removeEventListener('mousewheel', prevent);
            window.removeEventListener('touchmove', prevent, {passive: false});
        }
            // eslint-disable-next-line react-hooks/exhaustive-deps
    },[scrollPos])

    return (
        <div className='media'>
            <svg onClick={(e) => toggleViewMedia(e, {src: src, type:''})} xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>
            <div className='mediaOverlay' onClick={(e) => toggleViewMedia(e, {src: src, type:''})}></div>
            {renderMedia()}
        </div>
    )
}

export default Media;