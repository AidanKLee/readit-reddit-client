import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectLogin, updateVotes } from '../LogIn/loginSlice';
import { getUpVotes } from '../../utilities/functions';
import reddit from '../../utilities/redditAPI';

const Votes = (props) => {

    const dispatch = useDispatch();

    const login = useSelector(selectLogin);

    const { ups, downs, article } = props;

    const getUpVoted = (direction) => {
        let isVoted = false;
        let colour;
        if (direction === 'up') {
            direction = login.authorization.votes.upVotes
            colour = {fill: 'var(--prim1)'}
        } else {
            direction = login.authorization.votes.downVotes
            colour = {fill: 'var(--sec1)'}
        } 
        direction.data.children.forEach(vote => {
            if (article.data.name === vote.data.name) {
                isVoted = true;
            }
        });

        if (isVoted) {
            return colour;
        }
        return {};
    }

    const handleClick = async (e) => {
        const button = e.target.classList[0]
        let isVoted = false;
        if (button === 'tileSideUp') {
            login.authorization.votes.upVotes.data.children.forEach(vote => {
                if (article.data.name === vote.data.name) {
                    isVoted = true;
                }
            })
            isVoted ? await reddit.placeVote('0', article.data.name) : await reddit.placeVote('1', article.data.name);
        } else {
            login.authorization.votes.downVotes.data.children.forEach(vote => {
                if (article.data.name === vote.data.name) {
                    isVoted = true;
                }
            })
            isVoted ? await reddit.placeVote('0', article.data.name) : await reddit.placeVote('-1', article.data.name);
        }
        if (login.authorization && login.authorization.votes) {
            dispatch(updateVotes(login.authorization.user.name));
        }
        
    }

    return (
        <div className="tileSide">
            <div className='tileSideButton'>
                <button onClick={handleClick} style={login.authorization && login.authorization.votes ? {cursor: 'pointer'} : {pointerEvents: 'none'}}>
                    <svg style={login.authorization && login.authorization.votes ? getUpVoted('up') : {pointerEvents: 'none'}} className="tileSideUp" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z"/></svg>
                </button>
                
                <span>{getUpVotes(ups)}</span>
            </div>
            <div className='tileSideButton'>
                <button onClick={handleClick} style={login.authorization && login.authorization.votes ? {cursor: 'pointer'} : {pointerEvents: 'none'}}>
                    <svg onClick={handleClick} style={login.authorization && login.authorization.votes ? getUpVoted('down') : {pointerEvents: 'none'}} className="tileSideDown" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z"/></svg>
                </button>

                {typeof downs === 'number' ? <span>{getUpVotes(downs)}</span> : undefined}
            </div>
        </div>
    )

}

export default Votes;