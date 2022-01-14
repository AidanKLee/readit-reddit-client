import React from 'react';
import './home.css';
import { Outlet } from 'react-router-dom';
import Categories from '../../components/Categories/Categories';
import CreatePost from '../../components/CreatePost/CreatePost';
import { useSelector } from 'react-redux';
import { selectNewPost } from '../../components/NewPost/newPostSlice';

const Home = () => {

    const newPost = useSelector(selectNewPost);

    return (
        <div className='home'>
            <div className='content'>
                {newPost.open ? <CreatePost /> : undefined}
                <Categories page={''}/>
                <Outlet/>
            </div>
        </div>
    )
}

export default Home;