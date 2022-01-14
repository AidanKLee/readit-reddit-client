import React from 'react';
import './home.css';
import { Outlet } from 'react-router-dom';
import Categories from '../../components/Categories/Categories';
import CreatePost from '../../components/CreatePost/CreatePost';

const Home = () => {
    return (
        <div className='home'>
            <div className='content'>
                <CreatePost />
                <Categories page={''}/>
                <Outlet/>
            </div>
        </div>
    )
}

export default Home;