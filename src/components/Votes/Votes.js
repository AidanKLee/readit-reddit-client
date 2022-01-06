import React from 'react';
import { useSelector } from 'react-redux';
import { selectLogin } from '../LogIn/loginSlice';
import { getUpVotes } from '../../utilities/functions';

const Votes = (props) => {

    const login = useSelector(selectLogin);

    const { ups, downs } = props;

    return (
        <div className="tileSide">
            <div className='tileSideButton'>
                <svg className="tileSideUp" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z"/></svg>
                <span>{getUpVotes(ups)}</span>
            </div>
            <div className='tileSideButton'>
                <svg className="tileSideDown" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z"/></svg>
                {downs >= 0 ? <span>{getUpVotes(downs)}</span> : undefined}
            </div>
        </div>
    )

}

export default Votes;