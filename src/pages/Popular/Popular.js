import React from 'react';
import './popular.css';
import { Outlet } from 'react-router-dom';
import Categories from '../../components/Categories/Categories';
import { useSelector } from 'react-redux';
import { selectNewPost } from '../../components/NewPost/newPostSlice';
import CreatePost from '../../components/CreatePost/CreatePost';
import { CSSTransition } from 'react-transition-group';

const Popular = () => {

    const newPost = useSelector(selectNewPost);

    return (
        <CSSTransition in={true} appear={true} timeout={1000} classNames='tran1'>
            <div className='popular'>
                <div className='content'>
                    <CSSTransition in={newPost.open} timeout={300} classNames={'tran9'} mountOnEnter={true} unmountOnExit={true}><CreatePost /></CSSTransition>
                    <Categories page={'/popular'}/>
                    <Outlet page={'popular'}/>
                </div>
            </div>
        </CSSTransition>
    )
}

export default Popular;