import React from 'react';
import { useDispatch } from 'react-redux';
import { Outlet, useParams } from 'react-router-dom';
import Categories from '../../components/Categories/Categories';

const User = () => {

    const dispatch = useDispatch();

    const params = useParams();
    const userUrl = params.userId;
    
    return (
        <div className='user'>
            <div className='content'>
                <Categories page={'/u/' + userUrl}/>
                <Outlet/>
            </div>
            User
        </div>
    )
}

export default User;