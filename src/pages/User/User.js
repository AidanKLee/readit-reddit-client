import React, { useEffect, useLayoutEffect, useState} from 'react';
import './user.css';
import { Outlet, useLocation } from 'react-router-dom';
import Categories from '../../components/Categories/Categories';
import reddit from '../../utilities/redditAPI';
import { getTimePosted, over18Style, returnToTop } from '../../utilities/functions';
import { Link } from 'react-router-dom';
import { Text } from '../../components/ContentTile/ContentTile';
import { useDispatch, useSelector } from 'react-redux';
import { clearMainPageState } from '../../containers/Main/mainSlice';
import { selectLogin } from '../../components/LogIn/loginSlice';
import CreatePost from '../../components/CreatePost/CreatePost';
import { selectNewPost } from '../../components/NewPost/newPostSlice';
import Subscribe from '../../components/Subscribe/Subscribe';

const User = () => {

    const dispatch = useDispatch();

    let selected = useLocation().pathname.split('/').slice(1);
    const [ prefix, user, content ] = selected;
    const login = useSelector(selectLogin);
    const newPost = useSelector(selectNewPost);

    const [ subreddit, setSubreddit ] = useState({});
    const [ height, setHeight ] = useState({});

    console.log(subreddit)

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

    const handleClick = (e) => {
        dispatch(clearMainPageState())
        returnToTop(e);
        // setSubreddit({});
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
                                        {login.authorization ? <Subscribe name={sub ? sub.name : undefined} subreddit={sub} text='Join'/> : undefined}
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
            {console.log(subreddit)}
                {subreddit && subreddit.data && subreddit.data.subreddit.banner_img ? <img style={over18Style(subreddit, login)} src={getUrl(subreddit.data.subreddit.banner_img)} alt={subreddit.data.name}/> : undefined}
                {login.authorization && subreddit && subreddit.data ? <Subscribe name={subreddit && subreddit.data ? subreddit.data.subreddit.name : undefined} subreddit={{data: subreddit.data.subreddit}} text='Follow'/> : undefined}
            </div>
            <div className='subBannerUnder'>
                <div className='subBannerUnderWrapper'>
                <div className='iconImgWrapper'>
                    {subreddit && subreddit.data ? reddit.getIconImg(subreddit.data.subreddit, over18Style(subreddit, login)) : undefined}
                </div>
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
                        {subreddit && subreddit.data && subreddit.data.subreddit.over_18 ? <p className='userDetailsNsfw'>NSFW</p> : undefined}
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
                    {newPost.open ? <CreatePost /> : undefined}
                    <Categories page={`/${prefix}/${user}/${content}`}/>
                    <Outlet/>
                </div>
                <div className='subContentRight'>
                    <div className='userContentRightSticky'>
                        <div className='subContentRightHeader'>
                            <div className='subContentRightHeaderName'>
                                {subreddit.data ? <p className='bold'>{<Text text={subreddit.data.name} length={1000}/>}</p> : undefined}
                                {login.authorization && subreddit && subreddit.data ? <Subscribe name={subreddit.data ? subreddit.data.subreddit.name : undefined} subreddit={{data: subreddit.data.subreddit}} text='Follow'/> : undefined}
                            </div>
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