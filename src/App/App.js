import React, { useEffect } from 'react';
import './App.css';
import Header from '../containers/Header/Header';
import Main from '../containers/Main/Main';
import Menu from '../containers/Menu/Menu';
import Footer from '../containers/Footer/Footer';
import { useDispatch, useSelector } from 'react-redux';
import { handleLogin, selectLogin } from '../components/LogIn/loginSlice';
import { selectDarkMode, setDarkMode, setDayMode } from '../components/DarkMode/darkModeSlice';
import NewPost from '../components/NewPost/NewPost';
import { useLocation } from 'react-router-dom';
import { clearSelectedSubreddit, closeNewPost, handleCommunityChange, selectNewPost } from '../components/NewPost/newPostSlice';
import { selectClock } from '../components/Clock/clockSlice';
import Clock from '../components/Clock/Clock';


function App() {

  const dispatch = useDispatch();

  const location = useLocation().pathname;

  const login = useSelector(selectLogin);
  const newPost = useSelector(selectNewPost)
  const darkMode = useSelector(selectDarkMode);
  const clock = useSelector(selectClock);

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
  }, [dispatch]);

  return (
    <div className="App" data-test='App'>
      <Clock />
      <Header />
      <Main />
      <Menu />
      {
        login.authorization ?
        <div className='appButton'>
          <NewPost />
        </div> : undefined
      }
      <Footer />
    </div>
  );
}

export default App;
