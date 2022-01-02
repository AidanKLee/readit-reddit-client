import React, { useEffect, useState} from 'react';
import './user.css';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useParams } from 'react-router-dom';
import Categories from '../../components/Categories/Categories';
import reddit from '../../utilities/redditAPI';
import { selectMain, setSelectedSubreddit } from '../../containers/Main/mainSlice';

const User = () => {

    const dispatch = useDispatch();

    const params = useParams();
    const userUrl = params.userId;
    const main = useSelector(selectMain);

    dispatch(setSelectedSubreddit(userUrl + '/overview'));

    const [ subreddit, setSubreddit ] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            // variable endpoints - about, overview, submitted, comments, https://www.reddit.com/user/[user]/moderated_subreddits.json
            const data = await reddit.fetchSubreddit(`user/${userUrl}/about`);
            const subreddit = {
                data: data.data,
            }
            setSubreddit(subreddit);
        }
        fetchData();
    }, [userUrl]);

    // data for page header - name, display_name_prefixed, title, total_karma, created, snoovatar_img, banner_img, description/ public_description

    return (
        <div className='user'>
            <div className='content'>
                <Categories page={'/u/' + userUrl}/>
                <Outlet/>
            </div>
        </div>
    )
}

export default User;