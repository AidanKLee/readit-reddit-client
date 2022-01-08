import React, { useEffect, useLayoutEffect, useState} from 'react';
import './user.css';
import { Outlet, useLocation } from 'react-router-dom';
import Categories from '../../components/Categories/Categories';
import reddit from '../../utilities/redditAPI';
import { getTimePosted, returnToTop } from '../../utilities/functions';
import { Link } from 'react-router-dom';
import { Text } from '../../components/ContentTile/ContentTile';
import { useDispatch } from 'react-redux';
import { clearMainPageState } from '../../containers/Main/mainSlice';

const User = () => {

    const dispatch = useDispatch();

    let selected = useLocation().pathname.split('/').slice(1);
    const [prefix, user, content ] = selected;

    const [ subreddit, setSubreddit ] = useState({});
    const [ height, setHeight ] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            // variable endpoints - about, overview, submitted, comments, https://www.reddit.com/user/[user]/moderated_subreddits.json
            const data = await reddit.fetchSubreddit(`user/${user}/about`);
            const subreddit = {
                data: data.data,
            }
            setSubreddit(subreddit);
        }
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    useEffect(() => {
        if (!subreddit.moderatorOf && subreddit.data) {
            const fetchModeratorOf = async (name) => {
                const data = await reddit.fetchModeratorOf(name, 100, null, subreddit.data.subreddit.over18);
                setSubreddit({
                    ...subreddit,
                    moderatorOf: data.data,
                })
            }
            fetchModeratorOf(subreddit.data.subreddit.url)
            setSubreddit({
                ...subreddit,
                initialFetchComplete: true
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[subreddit.data])

    useEffect(() => {
        getHeight(setHeight);
    },[subreddit.moderatorOf])

    useLayoutEffect(() => {
        window.addEventListener('resize', getHeight);
        getHeight(setHeight);
        return () => window.removeEventListener('resize', getHeight());
    },[])

    const getUrl = (url) => {
        if (url.includes('?')) {
            return url.split('?')[0];
        } else {
            return url;
        }
    }

    const handleClick = () => {
        // dispatch(clearMainPageState())
        returnToTop();
        setSubreddit({});
    }

    const getHeight = () => {
        const element = document.getElementsByClassName('subContentRightRecommendedLinks')[0];
        let parent = document.getElementsByClassName('subContentRightSticky')[0];
        if (!parent) {
            parent = document.getElementsByClassName('userContentRightSticky')[0];
        }
        if (element) {
            const position = element.offsetTop;
            let height = (parent.offsetHeight - position - 2).toString() + 'px';
            setHeight({height: height});
        }
    }

    const renderModeratorOf = () => {
        if (subreddit.moderatorOf) {
            return (
                <div className='subContentRightRecommended'>
                    <p className='bold subContentRightRecommendedHeading'>
                        Moderator Of...
                    </p>
                    <div className='subContentRightRecommendedLinks' style={height}>
                        {
                            subreddit.moderatorOf.map(sub => {
                                return (
                                    <div className='subContentRightRecommendedLink' key={sub.name}>
                                        <div className='subContentRightRecommendedLinkLeft'>
                                            <Link onClick={handleClick} to={`/${sub.display_name_prefixed}`}>
                                                {reddit.getIconImg(sub)}
                                            </Link>
                                            <div className='subContentRightRecommendedLinkData'>
                                                <Link onClick={handleClick} to={`/${sub.display_name_prefixed}`}><p className='subHeading bold'>{sub.display_name_prefixed} {sub.over_18 ? <span className='blue'>NSFW</span> : undefined}</p></Link>
                                                <p className='subHeading'>{sub.subscribers} members</p>
                                            </div>
                                        </div>
                                        <button type='button'>Join</button>
                                    </div>                                    
                                )
                            })
                        }
                    </div>
                </div>
            )
            
        }
    }

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
                            {subreddit.data ? <Text text={subreddit.data.name} length={1000}/> : undefined}
                        </h1>
                        <p>
                            {subreddit.data ? subreddit.data.subreddit.display_name_prefixed : undefined}
                        </p>
                        <p>
                            {subreddit.data && subreddit.data.subreddit.title ? <Text text={subreddit.data.subreddit.title} length={1000}/> : undefined}
                        </p>
                        
                    </div>
                </div>
            </div>
            <div className='userCategories'>
                <div className='userCategoriesWrapper'>
                    <Link to={`/${prefix}/${user}/overview`} onClick={handleClick}><p>Overview</p></Link>
                    <Link to={`/${prefix}/${user}/submitted`} onClick={handleClick}><p>Posts</p></Link>
                    <Link to={`/${prefix}/${user}/comments`} onClick={handleClick}><p>Comments</p></Link>
                </div>
            </div>
            <div className='subContent'>
                <div className='content'>
                    <Categories page={`/${prefix}/${user}/${content}`}/>
                    <Outlet/>
                </div>
                <div className='subContentRight'>
                    <div className='userContentRightSticky'>
                        <div className='subContentRightHeader'>
                            {subreddit.data ? <p className='bold'>{<Text text={subreddit.data.name} length={1000}/>}</p> : undefined}
                            {subreddit.data ? <p className='subHeading'>{subreddit.data.subreddit.display_name_prefixed}</p> : undefined}
                            {subreddit.data && subreddit.data.subreddit.title ? <p>{<Text text={subreddit.data.subreddit.title} length={1000}/>}</p> : undefined}
                            <div className='subContentRightHeaderStats'>
                                <div>
                                    {subreddit.data ? <p className='heading bold'>{subreddit.data.subreddit.subscribers}</p> : undefined}
                                    <p className='subHeading'>subscribers</p>
                                </div>
                                <div>
                                    {subreddit.data ? <p className='heading bold'>{subreddit.data.total_karma}</p> : undefined}
                                    <p className='subHeading'>Total Karma</p>
                                </div>
                                <div>
                                    {subreddit.data ? <p className='heading bold'>{getTimePosted(subreddit.data.created)}</p> : undefined}
                                    <p className='subHeading'>Joined</p>
                                </div>
                            </div>
                        </div>
                        {
                            subreddit.data && (subreddit.data.subreddit.public_description || subreddit.data.subreddit.description) ?
                            <div className='subContentRightMain'>
                                <p className='bold'>
                                    About
                                </p>
                                {subreddit.data ? <div><p className='paragraph'><Text text={subreddit.data.subreddit.public_description} length={1000}/></p></div> : undefined}
                                {subreddit.data && subreddit.data.subreddit.public_description !== subreddit.data.subreddit.description ? <div><p className='paragraph'><Text text={subreddit.data.subreddit.description} length={1000}/></p></div> : undefined}
                            </div> : undefined
                        }
                        {renderModeratorOf()}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default User;