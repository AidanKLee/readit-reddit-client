import React, { useEffect } from 'react';
import './App.css';
import Header from '../containers/Header/Header';
import Main from '../containers/Main/Main';
import Menu from '../containers/Menu/Menu';
import Footer from '../containers/Footer/Footer';
import { useDispatch, useSelector } from 'react-redux';
import { fetchModeratedSubreddits, handleLogin, selectLogin } from '../components/LogIn/loginSlice';
import { selectDarkMode, setDarkMode, setDayMode } from '../components/DarkMode/darkModeSlice';
import NewPost from '../components/NewPost/NewPost';
import { useLocation } from 'react-router-dom';
import { clearSelectedSubreddit, closeNewPost, handleCommunityChange, selectNewPost } from '../components/NewPost/newPostSlice';
import { selectClock } from '../components/Clock/clockSlice';
import Clock from '../components/Clock/Clock';
import Build from '../components/Build/Build';
import FileUpload from '../components/FileUpload/FileUpload';
import { CSSTransition } from 'react-transition-group';
import { selectFullscreen, toggleFullscreen } from '../components/Fullscreen/fullscreenSlice';


function App() {

  const dispatch = useDispatch();

  const location = useLocation().pathname;

  const login = useSelector(selectLogin);
  const newPost = useSelector(selectNewPost)
  const darkMode = useSelector(selectDarkMode);
  const clock = useSelector(selectClock);
  const fullscreen = useSelector(selectFullscreen);

  useEffect(() => {
    const localStorageDark = localStorage.getItem('darkMode');
    if (localStorageDark) {
        dispatch(setDarkMode(localStorageDark === 'true'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  // dark mode functionality
  useEffect(() => {
    if (login.authorization && login.authorization.settings && login.authorization.settings.nightmode !== (localStorage.getItem('darkMode') === 'true')) {
        dispatch(setDarkMode(login.authorization.settings.nightmode));
        localStorage.setItem('darkMode', login.authorization.settings.nightmode)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[login.initialLoginAttempt])

  // auto switch for daymode and nightmode
  useEffect(() => {
      if (clock.hour > 6 && clock.hour < 19 && !darkMode.dayMode) {
          dispatch(setDayMode(true));
      } else if ((clock.hour <= 6 || clock.hour >= 19) && darkMode.dayMode) {
          dispatch(setDayMode(false));
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clock])

  // theme setter
  useEffect(() => {
    if ((darkMode.darkMode && darkMode.dayMode && darkMode.dayModeEnabled) || (darkMode.darkMode && !darkMode.dayModeEnabled)) {
        document.documentElement.setAttribute("data-theme",'dark')
    } else if ((!darkMode.darkmode && darkMode.dayMode && darkMode.dayModeEnabled) || (!darkMode.darkMode && !darkMode.dayModeEnabled)) {
        document.documentElement.removeAttribute('data-theme')
    } else if (darkMode.darkMode && !darkMode.dayMode && darkMode.dayModeEnabled) {
        document.documentElement.setAttribute("data-theme",'darkNight')
    } else if (!darkMode.darkMode && !darkMode.dayMode && darkMode.dayModeEnabled) {
        document.documentElement.setAttribute("data-theme", 'night')
    }
},[darkMode])

useEffect(() => {
  if (newPost.open) {
      dispatch(closeNewPost())
  }
  if (newPost.community.selected) {
      dispatch(clearSelectedSubreddit())
      dispatch(handleCommunityChange(''))
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
},[location])

  useEffect(() => {
      dispatch(handleLogin());
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (login && login.authorization && login.authorization.user) {
      dispatch(fetchModeratedSubreddits(login.authorization.user.name));
    }
      // eslint-disable-next-line react-hooks/exhaustive-deps
  },[login.initialLoginAttempt])

  const handleFullscreenChange = (e) => {
    dispatch(toggleFullscreen())
  }

  useEffect(() => {
    window.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => window.removeEventListener('fullscreenchange', handleFullscreenChange)
    // eslint-disable-next-line react-hooks/exhaustive-deps
},[])

  return (
    <div className="App" data-test='App'>
        <Header />
        <CSSTransition in={true} appear={true} timeout={1500} classNames='tran2'>      
          <Main />
        </CSSTransition>
        <Menu />
        {
          login.authorization && !fullscreen ?
          <div className='appButton'>
            <NewPost />
          </div> : undefined
        }
        {
          login.authorization ? <Build/> : undefined
        }
        {
          login.authorization && login.imageUpload ? <CSSTransition in={login.imageUpload.open} timeout={400} classNames={'tran4'} mountOnEnter={true} unmountOnExit={true}><FileUpload/></CSSTransition> : undefined
        }
        <Footer />
        <Clock />
    </div>
  );
}

export default App;
