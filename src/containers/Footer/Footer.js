import React, { useMemo } from "react";
import './footer.css';
import { returnToTop } from "../../utilities/functions";
import { useSelector } from 'react-redux';
import { selectMenu } from "../Menu/menuSlice";
import NewPost from "../../components/NewPost/NewPost";
import { useNavigate } from "react-router-dom";
import { selectFullscreen } from "../../components/Fullscreen/fullscreenSlice";
import { selectLogin } from "../../components/LogIn/loginSlice";
import { CSSTransition } from "react-transition-group";

const Footer = () => {

    const navigate = useNavigate();

    const menu = useSelector(selectMenu);
    const fullscreen = useSelector(selectFullscreen);
    const login = useSelector(selectLogin);

    const isLoggedIn = useMemo(() => login.authorization ? true : false,[login])

    return (
        <footer className={menu.menuOpen ? 'blur' : ''} style={fullscreen ? {height: '56px'} : {}}>
        {
            !fullscreen ?
            <div className='footerWrapper'>
                <p>&copy; 2021 Readit - Reddit Client</p>
                <p onClick={(e) => returnToTop(e)}>Return To Top</p>
            </div>
            :
            <div className='footerWrapper' style={{justifyContent:'space-around'}}>
                <svg onClick={() => window.history.back()} xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
                <svg onClick={() => window.location.reload(true)} xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>
                <CSSTransition in={isLoggedIn} timeout={300} classNames={'tran12'} mountOnEnter={true} unmountOnExit={true}><NewPost/></CSSTransition>
                <svg onClick={(e) => returnToTop(e)} xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M8 11h3v10h2V11h3l-4-4-4 4zM4 3v2h16V3H4z"/></svg>
                <svg onClick={() => navigate('/', {replace: false})} xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 5.69l5 4.5V18h-2v-6H9v6H7v-7.81l5-4.5M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z"/></svg>
            </div>
        }
            
        </footer>
    );
};

export default Footer;