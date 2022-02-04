import React from 'react';
import './mod.css';
import { Outlet } from 'react-router-dom';
import Categories from '../../components/Categories/Categories';
import CreatePost from '../../components/CreatePost/CreatePost';
import { useSelector } from 'react-redux';
import { selectNewPost } from '../../components/NewPost/newPostSlice';
import { CSSTransition } from 'react-transition-group';

const Mod = () => {

    const newPost = useSelector(selectNewPost);

    return (
        <div className='mod'>
            <div className='content'>
                <CSSTransition in={newPost.open} timeout={300} classNames={'tran9'} mountOnEnter={true} unmountOnExit={true}><CreatePost /></CSSTransition>
                <Categories page={'/mod'}/>
                <Outlet/>
            </div>
        </div>
    )
}

export default Mod;