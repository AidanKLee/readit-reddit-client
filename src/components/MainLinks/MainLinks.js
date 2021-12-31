import React from 'react';
import { NavLink } from 'react-router-dom';
import './mainLinks.css';
import { closeMenu } from '../../containers/Menu/menuSlice';
import { useDispatch } from 'react-redux';

const MainLinks = () => {

    const dispatch = useDispatch();

    const handleClick = () => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
        dispatch(closeMenu());
    }

    return (
        <ul className='mainLinks'>
            <NavLink onClick={handleClick} to={`/`} className={({ isActive }) => isActive ? 'mainLinksActive' : ''}>
                <li className="mainLinksItems" data-test='mainLinks'>
                    <svg data-list='mainLinksSvgs' xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 5.69l5 4.5V18h-2v-6H9v6H7v-7.81l5-4.5M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z"/></svg>
                    <p>Home</p>
                </li>
            </NavLink>
            <NavLink onClick={handleClick} to ={`/popular`} className={({ isActive }) => isActive ? 'mainLinksActive' : ''}>
                <li className="mainLinksItems" data-test='mainLinks'>
                    <svg data-list='mainLinksSvgs' xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z"/></svg>
                    <p>Popular</p>
                </li>
            </NavLink>
            <NavLink onClick={handleClick} to={`/all`} className={({ isActive }) => isActive ? 'mainLinksActive' : ''}>
                <li className="mainLinksItems" data-test='mainLinks'>
                    <svg data-list='mainLinksSvgs' xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z"/></svg>
                    <p>All</p>
                </li>
            </NavLink>
        </ul>
    );
};

export default MainLinks;