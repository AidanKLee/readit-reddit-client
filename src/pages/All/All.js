import React from 'react';
import './all.css';
import { Outlet } from 'react-router-dom';
import Categories from '../../components/Categories/Categories';
import { useSelector } from 'react-redux';
import { selectNewPost } from '../../components/NewPost/newPostSlice';
import CreatePost from '../../components/CreatePost/CreatePost';

const All = () => {

    const newPost = useSelector(selectNewPost);

    return (
        <div className='all'>
            <div className='content'>
                {newPost.open ? <CreatePost /> : undefined}
                <Categories page={'/all'}/>
                <Outlet/>
            </div>
        </div>
    )
}

export default All;