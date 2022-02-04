import React from 'react';
import './all.css';
import { Outlet } from 'react-router-dom';
import Categories from '../../components/Categories/Categories';
import { useSelector } from 'react-redux';
import { selectNewPost } from '../../components/NewPost/newPostSlice';
import CreatePost from '../../components/CreatePost/CreatePost';
import { CSSTransition } from 'react-transition-group';

const All = () => {

    const newPost = useSelector(selectNewPost);

    return (
        <CSSTransition in={true} appear={true} timeout={1000} classNames='tran1'>
            <div className='all'>
                <div className='content'>
                    <CSSTransition in={newPost.open} timeout={300} classNames={'tran9'} mountOnEnter={true} unmountOnExit={true}><CreatePost /></CSSTransition>
                    <Categories page={'/all'}/>
                    <Outlet/>
                </div>
            </div>
        </CSSTransition>
    )
}

export default All;