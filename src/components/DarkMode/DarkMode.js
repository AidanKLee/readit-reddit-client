import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './darkMode.css';
import { selectDarkMode, setDarkMode, setDayMode, toggleDarkMode } from './darkModeSlice';

const DarkMode = () => {

    const dispatch = useDispatch();

    const darkMode = useSelector(selectDarkMode);
    const [ time, setTime ] = useState(new Date());

    useEffect(() => {
        const timeout = setInterval(() => {
          setTime(new Date())
        },1000)
    
        return () => clearInterval(timeout)
    },[])

    useEffect(() => {
        console.log()
        if (time.getHours() > 6 && time.getHours() < 19 && !darkMode.dayMode) {
            console.log('running')
            dispatch(setDayMode(true));
        } else if ((time.getHours() <= 6 || time.getHours() >= 19) && darkMode.dayMode) {
            console.log('running')
            dispatch(setDayMode(false));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [time])

    useEffect(() => {
        const localStorageDark = localStorage.getItem('darkMode')
        if (localStorageDark) {
            dispatch(setDarkMode(localStorageDark === 'true'));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    useEffect(() => {
        if (darkMode.darkMode && darkMode.dayMode) {
            document.documentElement.setAttribute("data-theme",'dark')
        } else if (!darkMode.darkmode && darkMode.dayMode) {
            document.documentElement.removeAttribute('data-theme')
        } else if (darkMode.darkMode && !darkMode.dayMode) {
            document.documentElement.setAttribute("data-theme",'darkNight')
        } else if (!darkMode.darkMode && !darkMode.dayMode) {
            document.documentElement.setAttribute("data-theme", 'night')
        }
    },[darkMode])
    
      
    const handleClick = () => {
        dispatch(toggleDarkMode());
        localStorage.setItem('darkMode', !darkMode.darkMode)
    }

    const styleDarkMode = darkMode.darkMode ? { left: '32px' } : { left: '0'};

    return (
        <div onClick={handleClick} className="darkWrapper spaceBetween" data-test='userListItem'>
            <div className='dark'>
                <svg className='darkSvg' data-test='userListSvg' xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24"><rect fill="none" height="24" width="24"/><path d="M9.37,5.51C9.19,6.15,9.1,6.82,9.1,7.5c0,4.08,3.32,7.4,7.4,7.4c0.68,0,1.35-0.09,1.99-0.27C17.45,17.19,14.93,19,12,19 c-3.86,0-7-3.14-7-7C5,9.07,6.81,6.55,9.37,5.51z M12,3c-4.97,0-9,4.03-9,9s4.03,9,9,9s9-4.03,9-9c0-0.46-0.04-0.92-0.1-1.36 c-0.98,1.37-2.58,2.26-4.4,2.26c-2.98,0-5.4-2.42-5.4-5.4c0-1.81,0.89-3.42,2.26-4.4C12.92,3.04,12.46,3,12,3L12,3z"/></svg>
                <p>Dark Mode</p>
            </div>
            <div className='darkToggleOut'>
                <div className='darkToggleIn' style={styleDarkMode}></div>
            </div>
        </div>
    )
}

export default DarkMode;