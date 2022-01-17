import React from 'react';
import './popular.css';
import { Outlet } from 'react-router-dom';
import Categories from '../../components/Categories/Categories';
import { useSelector } from 'react-redux';
import { selectNewPost } from '../../components/NewPost/newPostSlice';
import CreatePost from '../../components/CreatePost/CreatePost';

const Popular = () => {

    const newPost = useSelector(selectNewPost);

    return (
        <div className='popular'>
            <div className='content'>
                {newPost.open ? <CreatePost /> : undefined}
                <Categories page={'/popular'}/>
                <Outlet page={'popular'}/>
            </div>
        </div>
    )
}

export default Popular;