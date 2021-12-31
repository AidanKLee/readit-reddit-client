import React from 'react';
import './all.css';
import { Outlet } from 'react-router-dom';
import Categories from '../../components/Categories/Categories';

const All = () => {
    return (
        <div className='all'>
            <div className='content'>
                <Categories page={'/all'}/>
                <Outlet/>
            </div>
        </div>
    )
}

export default All;