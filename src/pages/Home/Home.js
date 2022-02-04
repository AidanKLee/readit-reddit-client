import React from 'react';
import './home.css';
import { Outlet } from 'react-router-dom';
import Categories from '../../components/Categories/Categories';
import CreatePost from '../../components/CreatePost/CreatePost';
import { useSelector } from 'react-redux';
import { selectNewPost } from '../../components/NewPost/newPostSlice';
import { CSSTransition } from 'react-transition-group';

const Home = () => {

    const newPost = useSelector(selectNewPost);

    return (
        <CSSTransition in={true} appear={true} timeout={1000} classNames='tran1'>
            <div className='home'>
                <div className='content'>
                    <CSSTransition in={newPost.open} timeout={300} classNames={'tran9'} mountOnEnter={true} unmountOnExit={true}><CreatePost /></CSSTransition>
                    <Categories page={''}/>
                    <Outlet/>
                </div>
            </div>
        </CSSTransition>
    )
}

export default Home;