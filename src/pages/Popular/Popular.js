import React from 'react';
import './popular.css';
import { Outlet } from 'react-router-dom';
import Categories from '../../components/Categories/Categories';

const Popular = () => {
    return (
        <div className='popular'>
            <div className='content'>
                <Categories page={'/popular'}/>
                <Outlet page={'popular'}/>
            </div>
        </div>
    )
}

export default Popular;