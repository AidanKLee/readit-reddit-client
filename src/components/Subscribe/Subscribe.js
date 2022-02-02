import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { returnToTop } from '../../utilities/functions';
import reddit from '../../utilities/redditAPI';
import { selectLogin, setSubscribed } from '../LogIn/loginSlice';
import './subscribe.css';

const Subscribe = (props) => {

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const { text, name, subreddit, moderated } = props;

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

        if (moderated) {
            let url;
            if (subreddit.data && subreddit.data.display_name_prefixed.slice(0, 2).includes('u/')) {
                url = '/account'
            } else if (subreddit.data) {
                url = `/${subreddit.data.display_name_prefixed}/admin`
            } else {
                url = `/${subreddit.sr_display_name_prefixed}/admin`
            }

            returnToTop();
            return navigate(url, {replace: false})
        }

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

        if (moderated) {
            return 'Edit'
        } else if (text === 'Join' && isSubscribed(name)) {
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