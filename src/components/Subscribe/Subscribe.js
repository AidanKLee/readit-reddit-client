import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import reddit from '../../utilities/redditAPI';
import { selectLogin, setSubscribed } from '../LogIn/loginSlice';
import './subscribe.css';

const Subscribe = (props) => {

    const dispatch = useDispatch();

    const { text, name, subreddit } = props;

    const login = useSelector(selectLogin);

    const isSubscribed = (n) => {
        let subscribed;
        login.authorization.communities.data.children.forEach(community => {
            if (name === community.data.name) {
                return subscribed = true;
            }
        })
        return subscribed;
    }

    const handleClick = async () => {
        let subscribed;
        let action;

        isSubscribed(name) ? subscribed = true : subscribed = false
        
        subscribed ? action = 'unsub' : action = 'sub';

        if (subscribed) {
            const filtered = login.authorization.communities.data.children.filter(community => {
                return name !== community.data.name
            })
            dispatch(setSubscribed(filtered))
        } else {
            dispatch(setSubscribed([
                subreddit,
                ...login.authorization.communities.data.children
            ]))
        }

        const subscribe = await reddit.setSubscriptionStatus({action: action, sr: name});
        console.log(subscribe)
    }

    const renderText = () => {

        if (text === 'Join' && isSubscribed(name)) {
            return 'Leave'
        } else if (text === 'Join' && !isSubscribed(name)) {
            return 'Join'
        } else if (text === 'Follow' && isSubscribed(name)) {
            return 'Unfollow'
        } else {
            return 'Follow'
        }
    }

    return (
        <button onClick={handleClick} className='subscribe'>
            {login.authorization && login.authorization.communities ? renderText() : undefined}
        </button>
    )
}

export default Subscribe;