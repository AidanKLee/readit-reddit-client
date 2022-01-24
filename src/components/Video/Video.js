import React, { useEffect, useState } from 'react';
import './video.css';
import './slider.css';

const Video = (props) => {

    const { style, video, id } = props;

    const [ paused, setPaused ] = useState(true);
    const [ muted, setMuted ] = useState(false);
    const [ volume, setVolume ] = useState(.8);
    const [ lastKnownVolume, setLastKnownVolume ] = useState(.8);
    const [ fullscreen, setFullscreen ] = useState(false);
    const [ wasPlaying, setWasPlaying ] = useState(false);

    const audio = video ? video.split('_')[0] + '_audio.mp4' : undefined;

    const toggleVid = document.getElementsByClassName(id)[0];
    const toggleAud = document.getElementsByClassName(id)[1];

    const duration = toggleAud && toggleAud.duration ? toggleAud.duration : 1;
    let position = toggleAud && toggleAud.currentTime ? toggleAud.currentTime : 0;
    const buffered = toggleVid ? toggleVid.buffered.TimeRanges : 0;

    // console.log(buffered)

    const togglePlay = () => {
        if (toggleVid.paused) {
            setPaused(false);
            toggleVid.play();
            toggleAud.play();
        } else {
            setPaused(true);
            toggleVid.pause();
            toggleAud.pause();
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
        return {backgroundSize: ((position / duration) * 100) + '% 100%'}
    }

    const playbackBufferedStyle = () => {
        return {backgroundSize: ((buffered / duration) * 100) + '% 100%'}
    }

    const handlePlaybackPosition = (e) => {
        toggleAud.currentTime = e.target.value
        toggleVid.currentTime = e.target.value
    }

    const playbackPositionDown = () => {
        if (!toggleVid.paused) {
            togglePlay();
            setWasPlaying(true);
        } else {
            setWasPlaying(false);
        }
    }

    const playbackPositionUp = () => {
        if (wasPlaying) {
            togglePlay();
        }
    }

    const toggleFullscreen = () => {
        const videoPlayer = document.querySelector('.videoPlayer' + id);
        if (document.fullscreenElement !== videoPlayer) {
            setFullscreen(true)
            videoPlayer.requestFullscreen().catch(e => console.log('Error opening fullscreen player: ' + e.name))
        } else {
            setFullscreen(false)
            document.exitFullscreen();
        }
    }

    const handleCloseFS = (e) => {
        console.log('handle')
        setFullscreen(false)
    }

    useEffect(() => {
        const videoPlayer = document.querySelector('.videoPlayer' + id);
        if (fullscreen) {
            const timeout = setTimeout(() => {
                videoPlayer.addEventListener('fullscreenchange', handleCloseFS)
            },50)

            return () => {
                videoPlayer.removeEventListener('fullscreenchange', handleCloseFS)
                clearTimeout(timeout)
            }
        }
            
    },[fullscreen, id])

    const maxHeightNone = fullscreen ? {maxHeight: 'none'} : {};

    return (
        <div className={'videoPlayer videoPlayer' + id} style={maxHeightNone}>
            <div onClick={togglePlay} className='videoMedia' style={style}>
                <video className={id} style={maxHeightNone}><source src={video ? video : undefined}/></video>
            </div>
            <audio className={id}><source src={audio ? audio : undefined}/></audio>
            <div className='videoPlayerControls'>
                <div className='playPosition' style={playbackBufferedStyle()}><input onMouseDown={playbackPositionDown} onMouseUp={playbackPositionUp} onChange={handlePlaybackPosition} style={playbackSliderStyle()} type='range' min='0' max={duration} value={position} step='1'/></div>
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
                    </div>
                    <div className='videoPlayerControlsRight'>
                        <div onClick={toggleFullscreen} className='videoPlayerFullscreen'>
                            {fullscreen ? <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/></svg> : <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Video;