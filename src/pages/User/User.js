import React from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

const User = () => {

    const dispatch = useDispatch();

    const params = useParams();
    const userUrl = params.userId;
    
    return (
        <div className='user'>
            User
        </div>
    )
}

export default User;