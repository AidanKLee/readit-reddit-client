import React from 'react';
import './home.css';
import { Outlet } from 'react-router-dom';
import Categories from '../../components/Categories/Categories';

const Home = () => {
    return (
        <div className='home'>
            <Categories page={''}/>
            <Outlet/>
        </div>
    )
}

export default Home;