import React from 'react';
import './all.css';
import { Outlet } from 'react-router-dom';
import Categories from '../../components/Categories/Categories';

const All = () => {
    return (
        <div className='all'>
            <Categories page={'/all'}/>
            <Outlet/>
        </div>
    )
}

export default All;