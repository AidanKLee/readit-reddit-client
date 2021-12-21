import React from 'react';
import reddit from '../../utilities/redditAPI';
import redditLogo from '../../assets/redditLogo.svg';
import './login.css';

const Login = () => {
    return (
        <div className='login' data-test='login'>
            <button onClick={reddit.handleLogin} className='loginButton' type='button' data-test='loginButtons'>
                <img className='loginButtonImg' src={redditLogo} alt='Reddit Logo'  data-test='loginButtonSvg'/>
                <span className='loginButtonText'>
                    Log In
                </span>
            </button>
            <a className="loginButton red" href='https://www.reddit.com/register.compact' target="_blank" rel="noopener noreferrer" data-test='loginButtons'>
                <span className="loginButtonText red">
                    Sign Up
                </span>
            </a>
        </div>
    );
};

export default Login;