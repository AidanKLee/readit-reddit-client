
import './App.css';
import React, { useEffect } from 'react';
import Header from '../containers/Header/Header';
import Main from '../containers/Main/Main';
import Menu from '../containers/Menu/Menu';
import Footer from '../containers/Footer/Footer';
import { useDispatch, useSelector } from 'react-redux';
import { handleLogin } from '../components/LogIn/loginSlice';

function App() {

  const dispatch = useDispatch();
  
  const { hasError } = useSelector(state => state.login);

  console.log(hasError)

  useEffect(() => {
    dispatch(handleLogin());
  }, [dispatch]);

  return (
    <div className="App" data-test='App'>
     <Header />
     <Main />
     <Menu />
     <Footer />
    </div>
  );
}

export default App;
