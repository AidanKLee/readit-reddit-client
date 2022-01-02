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

    console.log(subreddit)

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

    const getUrl = (url) => {
        if (url.includes('?')) {
            return url.split('?')[0];
        } else {
            return url;
        }
    }

    // data for page header - name, display_name_prefixed, title, total_karma, created, snoovatar_img, banner_img, description/ public_description

    return (
        <div className='user'>
            <div className='subBanner'>
                {subreddit && subreddit.data && subreddit.data.subreddit.banner_img ? <img src={getUrl(subreddit.data.subreddit.banner_img)} alt={subreddit.data.name}/> : undefined}
            </div>
            <div className='subBannerUnder'>
                <div className='subBannerUnderWrapper'>
                    {reddit.getIconImg(subreddit && subreddit.data ? subreddit.data.subreddit : undefined)}
                    <div className='subBannerUnderText'>
                        <h1>
                            {subreddit.data ? subreddit.data.name : undefined}
                        </h1>
                        <p>
                            {subreddit.data ? subreddit.data.subreddit.display_name_prefixed : undefined}
                        </p>
                        <p>
                            {subreddit.data && subreddit.data.subreddit.title ? subreddit.data.subreddit.title : undefined}
                        </p>
                    </div>
                </div>
            </div>
            <div className='userCategories'>
                <div className='userCategoriesWrapper'>
                    <p>Overview</p>
                    <p>Posts</p>
                    <p>Comments</p>
                </div>
            </div>
            <div className='subContent'>
                <div className='content'>
                    <Categories page={'/u/' + userUrl}/>
                    <Outlet/>
                </div>
                <div className='subContentRight'>
                    <div className='userContentRightSticky'>
                        <div className='subContentRightHeader'>
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default User;