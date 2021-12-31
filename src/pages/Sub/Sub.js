import React, { useEffect, useState } from 'react';
import './sub.css';
import { useParams, Outlet } from 'react-router-dom';
import reddit from '../../utilities/redditAPI';
import Categories from '../../components/Categories/Categories';
import { useDispatch } from 'react-redux';
import { setSelectedSubreddit } from '../../containers/Main/mainSlice';

const Sub = (props) => {

    const dispatch = useDispatch();
    
    let params = useParams();
    let subredditUrl = params.subredditId;
    
    dispatch(setSelectedSubreddit(subredditUrl));

    let [ subreddit, setSubreddit ] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            const data = await reddit.fetchSubreddit(`r/${subredditUrl}`);
            const content = await reddit.fetchContent(`r/${subredditUrl}`)
            const subreddit = {
                data: data.data,
                content: content
            }
            setSubreddit(subreddit);
        }
        fetchData()
    }, [subredditUrl])

    const backgroundColor = subreddit.data && subreddit.data.banner_background_color ? {backgroundColor: subreddit.data.banner_background_color} : {backgroundColor: '#f1f1f1'};

    const getBannerImg = () => {
        if (subreddit.data) {
            if (subreddit.data.banner_img) {
                return <img src={subreddit.data.banner_img} alt={subreddit.data.title + ' Banner'}/>
            } else if (subreddit.data.banner_background_image) {
                let url = subreddit.data.banner_background_image.split('?')[0]
                return <img src={url} alt={subreddit.data.title + ' Banner'}/>
            };
        };
    };

    return (
        <div className='sub'>
            <div className='subBanner' style={backgroundColor}>
                {getBannerImg()}
                <button type='button'>Join</button>
            </div>
            <div className='subBannerUnder'>
                <div className='subBannerUnderWrapper'>
                    {reddit.getIconImg(subreddit)}
                    <div className='subBannerUnderText'>
                        <h1>
                            {subreddit.data ? subreddit.data.title : undefined}
                        </h1>
                        <p>
                            {subreddit.data ? subreddit.data.url : undefined}
                        </p>
                    </div>
                </div>
            </div>
            <div className='content'>
                <Categories page={'/r/' + subredditUrl}/>
                <Outlet/>
            </div>
        </div>
    )
}

export default Sub;