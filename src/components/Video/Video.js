import React, { useEffect, useState } from 'react';
import './video.css';
import './slider.css';
import { Link } from 'react-router-dom';
import { returnToTop } from '../../utilities/functions';
import loader from '../../assets/loader.svg';

const Video = (props) => {

    const { style, video, id, isPost } = props;

    const [ paused, setPaused ] = useState(true);
    const [ muted, setMuted ] = useState(false);
    const [ volume, setVolume ] = useState(.8);
    const [ lastKnownVolume, setLastKnownVolume ] = useState(.8);
    const [ fullscreen, setFullscreen ] = useState(false);
    const [ wasPlaying, setWasPlaying ] = useState(false);
    const [ time, setTime ] = useState(0);
    const [ ended, setEnded ] = useState(false);
    const [ mouseIdle, setMouseIdle ] = useState(false);
    const [ duration, setDuration ] = useState(0);
    const [ buffering, setBuffering ] = useState(false);
    const [ hoverPosition, setHoverPosition ] = useState(0);
    const [ hoverTime, setHoverTime ] = useState(0);
    const [ width, setWidth ] = useState(0);
    const [ cursor, setCursor ] = useState(0);

    const audio = video ? video.split('_')[0] + '_audio.mp4' : undefined;

    let toggleVid = document.getElementsByClassName(id)[0]
    let toggleAud = document.getElementsByClassName(id)[1]

    useEffect(() => {
        if (volume > 0 && muted) {
            setMuted(false)
        }
    },[volume, muted])

    const togglePlay = () => {
        if (ended) {
            setTime(0);
            toggleVid.currentTime = 0;
            toggleAud.currentTime = 0;
            setEnded(false);
            toggleVid.play();
        } else if (paused) {
            setPaused(false);
            toggleVid.play();
        } else {
            setPaused(true);
            toggleVid.pause();
        }
    }

    const renderAudioControl = () => {
        if (toggleVid && (muted || toggleVid.volume === 0)) {
            return <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M4.34 2.93L2.93 4.34 7.29 8.7 7 9H3v6h4l5 5v-6.59l4.18 4.18c-.65.49-1.38.88-2.18 1.11v2.06c1.34-.3 2.57-.92 3.61-1.75l2.05 2.05 1.41-1.41L4.34 2.93zM10 15.17L7.83 13H5v-2h2.83l.88-.88L10 11.41v3.76zM19 12c0 .82-.15 1.61-.41 2.34l1.53 1.53c.56-1.17.88-2.48.88-3.87 0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zm-7-8l-1.88 1.88L12 7.76zm4.5 8c0-1.77-1.02-3.29-2.5-4.03v1.79l2.48 2.48c.01-.08.02-.16.02-.24z"/></svg>
        }
        if (toggleVid && toggleVid.volume < 0.5) {
            return <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M16 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02 0-1.77-1.02-3.29-2.5-4.03zM5 9v6h4l5 5V4L9 9H5zm7-.17v6.34L9.83 13H7v-2h2.83L12 8.83z"/></svg>
        } else {
            return <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M3 9v6h4l5 5V4L7 9H3zm7-.17v6.34L7.83 13H5v-2h2.83L10 8.83zM16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77 0-4.28-2.99-7.86-7-8.77z"/></svg>
        }
    }

    const toggleMute = () => {
        if (toggleVid.volume > 0) {
            setVolume(0)
            setMuted(true)
            toggleVid.volume = 0;
            toggleAud.volume = 0;
        } else {
            setVolume(lastKnownVolume)
            setMuted(false)
            toggleVid.volume = lastKnownVolume;
            toggleAud.volume = lastKnownVolume;
        }
    }

    useEffect(() => {
        if (toggleVid && toggleAud) {
            toggleVid.volume = volume;
            toggleAud.volume = volume;
        }
    },[volume, toggleVid, toggleAud])

    const handleAudioLevel = (e) => {
        const value = e.target.value
        setVolume(value)
        setLastKnownVolume(value)
    }

    const volumeSliderStyle = () => {
        return {backgroundSize: (volume * 100) + '% 100%'}
    }

    const playbackSliderStyle = () => {
        return {backgroundSize: ((time / duration) * 100) + '% 100%'}
    }

    const handlePlaybackPosition = (e) => {
        setTime(e.target.value)
        toggleVid.currentTime = e.target.value
        toggleAud.currentTime = e.target.value
    }

    const playbackPositionDown = (e) => {
        showHoveredTime()
        if (!toggleVid.paused) {
            togglePlay();
            setWasPlaying(true);
        } else {
            setWasPlaying(false);
        }
    }

    const playbackPositionUp = () => {
        hideHoveredTime()
        if (wasPlaying) {
            togglePlay();
        }
    }

    const toggleFullscreen = () => {
        const videoPlayer = document.querySelector('.videoPlayer' + id);
        if (document.fullscreenElement !== videoPlayer) {
            setFullscreen(true)
            videoPlayer.requestFullscreen({navigationUI: 'hide'}).catch(e => console.log('Error opening fullscreen player: ' + e.name))
        } else {
            setFullscreen(false)
            document.exitFullscreen();
        }
    }

    // useEffect(() => {
    //     const videoPlayer = document.querySelector('.videoPlayer' + id);
    //     console.log(fullscreen)
    //     if (fullscreen && Screen.orientation && Screen.orientation.lock) {
    //         Screen.orientation.lock('landscape')
    //     }
    // },[fullscreen])

    const handleCloseFS = (e) => {
        setFullscreen(false)
    }

    useEffect(() => {
        const videoPlayer = document.querySelector('.videoPlayer' + id);
        if (fullscreen) {
            const timeout = setTimeout(() => {
                videoPlayer.addEventListener('fullscreenchange', handleCloseFS)
            },100)

            return () => {
                videoPlayer.removeEventListener('fullscreenchange', handleCloseFS)
                clearTimeout(timeout)
            }
        }
            
    },[fullscreen, id])

    const timeRanges = toggleVid && toggleVid.buffered ? toggleVid.buffered : undefined
    const bufferedSections = timeRanges ? timeRanges.length : undefined
    let sectionsStart = []
    let sectionsEnd = []

    for (let i = 0; i < bufferedSections; i++) {
        sectionsStart.push(timeRanges.start(i))
        sectionsEnd.push(timeRanges.end(i))
    }

    const maxHeightNone = fullscreen ? {maxHeight: 'none'} : {};

    const formatTime = (time) => {
        time = Math.round(time);
        let hours = Math.floor(time / 60 / 60)
        let minutes = Math.floor(time / 60);
        let seconds = Math.floor(time % 60);

        if (hours < 1) {
            if (!seconds || seconds.toString().length === 1) {
                seconds = '0' + seconds.toString()
            }
            time = minutes + ':' + seconds
        } else {
            if (!minutes || minutes.toString().length === 1) {
                minutes = '0' + seconds.toString()
            }
            if (!seconds || seconds.toString().length === 1) {
                seconds = '0' + seconds.toString()
            }
            time = hours + ':' + minutes + ':' + seconds
        }
        
        return time;
    }

    const handleTime = (e) => {
        if (toggleVid.currentTime < toggleAud.currentTime + .015 || toggleVid.currentTime > toggleAud.currentTime + .045) {
            toggleAud.currentTime = toggleVid.currentTime
        }
        setTime(e.target.currentTime)
    }

    const handleEnd = () => {
        setEnded(true);
    }

    const handleRightClick = (e) => {
        e.preventDefault();
    }

    let timer;

    const handleMovingMouse = () => {
        setMouseIdle(false)
    }

    useEffect(() => {
        if (!mouseIdle) {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            timer = setTimeout(() => {
                setMouseIdle(true)           
            }, 3000)

            return () => clearTimeout(timer)
        }
    },[mouseIdle])
    
    useEffect(() => {
        const videoPlayer = document.querySelector('.videoPlayer' + id);
        const overlay = document.querySelector('.videoPlayerControlsOverlay' + id);
        const controls = document.querySelector('.videoPlayerControls' + id);
        const logo = document.querySelector('.videoPlayerLogo' + id);
        if (mouseIdle && !paused) {
            videoPlayer.style.cursor = 'none'
            overlay.style.transform = 'translateY(100%)';
            controls.style.transform = 'translateY(100%)';
            logo.style.bottom = '2%';
        } else {
            videoPlayer.style.cursor = ''
            overlay.style.transform = '';
            controls.style.transform = '';
            logo.style.bottom = '';
        }
    },[mouseIdle, paused, id])

    const handlePlaying = () => {
        toggleAud.currentTime = toggleVid.currentTime
        setBuffering(false);
        toggleAud.play();
    }

    const handleBuffering = () => {
        setBuffering(true);
        toggleAud.pause();
    }

    const getHoveredPositionOrTime = (e) => {
        const { left } = e.target.getBoundingClientRect();
        let hoveredPosition = e.clientX;
        if (!hoveredPosition) {
            hoveredPosition = e.touches[0].clientX
        }
        setCursor(hoveredPosition)

        const w = e.target.offsetWidth;
        setWidth(w)
        
        hoveredPosition = hoveredPosition - left;

        const hoveredDecimal = hoveredPosition / width;

        let hoveredTime = duration * hoveredDecimal
        hoveredTime = formatTime(hoveredTime)

        setHoverPosition(hoveredDecimal)
        setHoverTime(hoveredTime)

        // hoveredTimeBoundaries()
    }

    const showHoveredTime = () => {
        const showTime = document.querySelector('.videoPlayer' + id + ' .videoPlayerHoveredTimeWrapper');
        showTime.style.display = 'block';
    }

    const hideHoveredTime = () => {
        const showTime = document.querySelector('.videoPlayer' + id + ' .videoPlayerHoveredTimeWrapper');
        showTime.style.display = '';
    }

    const hoveredTimeBoundaries = () => {
        const timeWidth = document.querySelector('.videoPlayer' + id + ' .videoPlayerHoveredTimeWrapper') ? document.querySelector('.videoPlayer' + id + ' .videoPlayerHoveredTimeWrapper').offsetWidth / 2 : 0;
        const { left: boundLeft, right: boundRight } = document.querySelector('.videoPlayer' + id) ? document.querySelector('.videoPlayer' + id).getBoundingClientRect() : {left: 0, right: 0};

        const cursorLeft = cursor - timeWidth;
        const cursorRight = cursor + timeWidth;

        if (cursorLeft < boundLeft) {
            return {transform: 'translate(calc(-50% + ' + (boundLeft - cursorLeft) + 'px))', left: (hoverPosition * width) + 'px'}
        } else if (cursorRight > boundRight) {
            return {transform: 'translate(calc(-50% - ' + (cursorRight - boundRight) + 'px))', left: (hoverPosition * width) + 'px'}
        } else {
            return {left: (hoverPosition * width) + 'px'}
        }
    }


    return (
        <div onMouseMove={handleMovingMouse} onContextMenu={handleRightClick} className={'videoPlayer videoPlayer' + id} style={{...maxHeightNone, ...style}}>
            {ended && !paused ? <svg onClick={togglePlay} className='videoPlayerReplay' xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24"><g><rect fill="none" height="24" width="24"/><rect fill="none" height="24" width="24"/><rect fill="none" height="24" width="24"/></g><g><g/><path d="M12,5V1L7,6l5,5V7c3.31,0,6,2.69,6,6s-2.69,6-6,6s-6-2.69-6-6H4c0,4.42,3.58,8,8,8s8-3.58,8-8S16.42,5,12,5z"/></g></svg> : undefined}
            {paused && !ended ? <svg onClick={togglePlay} className='videoPlayerReplay' xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M10 8.64L15.27 12 10 15.36V8.64M8 5v14l11-7L8 5z"/></svg> : undefined}
            {buffering ? <img className='videoPlayerReplay' src={loader} alt={'Video Loading'}/> : undefined}         
            <div onClick={togglePlay} className='videoMedia'>
                <video onLoadedData={(e) => {
                    setDuration(e.target.duration)
                }
                } onPlaying={handlePlaying} onPause={() => toggleAud.pause()} onWaiting={handleBuffering} onEnded={handleEnd} onTimeUpdate={handleTime} className={id} style={maxHeightNone} preload={isPost ? 'auto' : 'meta'}><source src={video ? video : undefined}/></video>
                
            </div>
            <audio className={id}><source src={audio ? audio : undefined}/></audio>
            <div className='videoPlayerHoveredTimeWrapper' style={hoveredTimeBoundaries()}>{hoverTime}</div>
            <div className={'videoPlayerControls videoPlayerControls' + id}>
                <div className='playPosition' onMouseOver={showHoveredTime} onMouseLeave={hideHoveredTime}>
                    {sectionsStart.map((section, i) => {
                        return (
                            <div key={i} className='playPositionBuffered' style={{
                                left: ((section / duration) * 100) + '%',
                                width: (((sectionsEnd[i] - section) / duration) * 100) + '%'
                            }}></div>
                        )
                    })}
                    <div className='videoPlayerHoveredPosition' style={{width: 100 * hoverPosition + '%'}}></div>
                    <input onTouchMove={(e) => {
                        getHoveredPositionOrTime(e)
                        playbackPositionDown()
                        }} onMouseMove={getHoveredPositionOrTime} onMouseDown={playbackPositionDown} onTouchStart={playbackPositionDown} onMouseUp={playbackPositionUp} onTouchEnd={playbackPositionUp} onInput={handlePlaybackPosition} style={playbackSliderStyle()} type='range' min='0' max={duration} value={time} step='.01'/>
                </div>
                <div className='buttons'>
                    <div className='videoPlayerControlsLeft'>
                        <div onClick={togglePlay} className='play'>
                            {toggleVid && toggleVid.paused ? <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M10 8.64L15.27 12 10 15.36V8.64M8 5v14l11-7L8 5z"/></svg> : <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>}
                        </div>
                        <div className='volume'>
                            <div onClick={toggleMute} className='mute'>
                                {renderAudioControl()}
                            </div>
                            <div className='volumeSlider'><input onChange={handleAudioLevel} style={volumeSliderStyle()} type='range' min='0' max='1' step='.01' value={volume}/></div>
                        </div>
                        <div className='timePlayed'>
                            {formatTime(time) + ' / ' + formatTime(duration)}
                        </div>
                    </div>
                    <div className='videoPlayerControlsRight'>
                        <div onClick={toggleFullscreen} className='videoPlayerFullscreen'>
                            {fullscreen ? <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/></svg> : <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>}
                        </div>
                    </div>
                </div>
            </div>
            <div className={'videoPlayerControlsOverlay videoPlayerControlsOverlay' + id}></div>
            <div className={'videoPlayerLogo videoPlayerLogo' + id}>
                <Link className='' onClick={(e) => returnToTop(e)} to='/'><p>READIT</p></Link>
            </div>
        </div>
    )
}

export default Video;