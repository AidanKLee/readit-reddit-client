import React, { useEffect, useLayoutEffect, useMemo, useState} from 'react';
import './user.css';
import { Outlet, useLocation, useParams } from 'react-router-dom';
import Categories from '../../components/Categories/Categories';
import reddit from '../../utilities/redditAPI';
import { getTimePosted, over18Style, returnToTop } from '../../utilities/functions';
import { Link } from 'react-router-dom';
import { Text } from '../../components/ContentTile/ContentTile';
import { useDispatch, useSelector } from 'react-redux';
import { selectLogin, setUpdate, toggleImageUpload } from '../../components/LogIn/loginSlice';
import CreatePost from '../../components/CreatePost/CreatePost';
import { selectNewPost } from '../../components/NewPost/newPostSlice';
import Subscribe from '../../components/Subscribe/Subscribe';
import { CSSTransition } from 'react-transition-group';

const User = () => {

    const dispatch = useDispatch();

    let selected = useLocation().pathname.split('/').slice(1);
    const [ prefix, user, content ] = useMemo(() => selected,[selected]);
    const login = useSelector(selectLogin);
    const update = useMemo(() => login.update,[login]);
    const newPost = useSelector(selectNewPost);

    const params = useParams();
    const userUrl = params.userId;

    const [ subreddit, setSubreddit ] = useState({});
    const [ height, setHeight ] = useState({});
    const [ updated, setUpdated ] = useState(false)
    const [ mountTop, setMountTop ] = useState(false)
    const [ mountUnder, setMountUnder ] = useState(false);
    const [ mountSide, setMountSide] = useState(false);

    const isReadyToMount = useMemo(() => subreddit && subreddit.data ? true : false,[subreddit]);

    const fetchData = async () => {
        const data = await reddit.fetchSubreddit(`user/${user}/about`);
        const subData = {
            data: data.data,
        }
        setSubreddit({
            ...subreddit,
            data: subData.data
        });
    }

    useEffect(() => {
        if (mountUnder) {
            setMountUnder(false);
            const timer = setTimeout(() => {
                setSubreddit({})
                fetchData()
            },600)
            return () => clearTimeout(timer)
        } else if (!mountUnder) {
            fetchData()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userUrl]);

    useEffect(() => {
        if (isReadyToMount) {
            const timer = setTimeout(() => {
                setMountTop(true)
            },300)
            return () => clearTimeout(timer)
        }
    },[isReadyToMount])

    useEffect(() => {
        if (update) {
            fetchData();
            dispatch(setUpdate());
            setUpdated(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [update]);

    useEffect(() => {
        if (updated) {
            const timer = setTimeout(() => {
                setUpdated(false)
            },[3000])
            return () => clearTimeout(timer)
        }
    },[updated])

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
        returnToTop(e);
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

    const isUserPage = (subreddit) => {
        if (subreddit.data) {
            const userName = login.authorization.user.name;
            let subredditName = subreddit.data.name;

            if (userName === subredditName) {
                return true;
            }
        }
    }

    const toggleUpload = (upload_type) => {
        dispatch(toggleImageUpload({upload_type: upload_type, subreddit: login.authorization.user.subreddit.display_name}))
    }

    const isModeratorOf = (subreddit) => {
        const subredditName = subreddit.name;
        let isModerator = false;
        if (login.authorization && login.authorization.moderated) {
            login.authorization.moderated.forEach(sub => {
                if (sub.name === subredditName) {
                    isModerator = true;
                }
            })
        }
        return isModerator
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
                                        {login.authorization && !isModeratorOf(sub) ? <Subscribe name={sub ? sub.name : undefined} subreddit={sub} text='Join'/> : undefined}
                                        {login.authorization && isModeratorOf(sub) ? <Subscribe name={sub ? sub.name : undefined} subreddit={sub} moderated={true} text='Join'/> : undefined}
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
            <CSSTransition in={mountTop} timeout={300} classNames={'tran8'} mountOnEnter={true} unmountOnExit={true} onEntered={() => setMountUnder(true)}>
                <div className='subBanner'>
                    {subreddit && subreddit.data && subreddit.data.subreddit.banner_img ? <img style={over18Style(subreddit, login)} src={getUrl(subreddit.data.subreddit.banner_img)} alt={subreddit.data.name}/> : undefined}
                    {login.authorization && subreddit && subreddit.data && !isUserPage(subreddit) ? <Subscribe name={subreddit && subreddit.data ? subreddit.data.subreddit.name : undefined} subreddit={{data: subreddit.data.subreddit}} text='Follow'/> : undefined}
                    {login.authorization && isUserPage(subreddit) ? <svg className='iconUpload' onClick={() => toggleUpload('banner')} xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M14.12 4l1.83 2H20v12H4V6h4.05l1.83-2h4.24M15 2H9L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2zm-3 7c1.65 0 3 1.35 3 3s-1.35 3-3 3-3-1.35-3-3 1.35-3 3-3m0-2c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z"/></svg> : undefined}
                </div>
            </CSSTransition>

            <CSSTransition in={mountUnder} timeout={300} classNames={'tran8'} mountOnEnter={true} unmountOnExit={true} onExit={() => setMountSide(false)} onExited={() => setMountTop(false)} onEntered={() => setMountSide(true)}>
                <div className='subBannerUnder'>
                    <div className='subBannerUnderWrapper'>
                    <div className='subBannerIconWrapper'>
                        <div className='iconImgWrapper'>
                            {subreddit && subreddit.data ? reddit.getIconImg(subreddit.data.subreddit, over18Style(subreddit, login)) : undefined}
                        </div>
                        {login.authorization && isUserPage(subreddit) ? <svg className='iconUpload' onClick={() => toggleUpload('icon')} xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M14.12 4l1.83 2H20v12H4V6h4.05l1.83-2h4.24M15 2H9L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2zm-3 7c1.65 0 3 1.35 3 3s-1.35 3-3 3-3-1.35-3-3 1.35-3 3-3m0-2c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z"/></svg> : undefined}
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
            </CSSTransition>
            <div className='userCategories'>
                <div className='userCategoriesWrapper'>
                    <Link to={`/${prefix}/${user}/overview`} onClick={returnToTop}><p>Overview</p></Link>
                    <Link to={`/${prefix}/${user}/submitted`} onClick={returnToTop}><p>Posts</p></Link>
                    <Link to={`/${prefix}/${user}/comments`} onClick={returnToTop}><p>Comments</p></Link>
                </div>
            </div>
            <div className='subContent'>
                <div className='content'>
                    <CSSTransition in={newPost.open} timeout={300} classNames={'tran9'} mountOnEnter={true} unmountOnExit={true}><CreatePost /></CSSTransition>
                    <Categories page={`/${prefix}/${user}/${content}`}/>
                    <Outlet/>
                </div>
                <div className='subContentRight'>
                    <CSSTransition in={mountSide} timeout={300} classNames={'tran9'} mountOnEnter={true} unmountOnExit={true} >
                        <div className='userContentRightSticky'>
                            <div className='subContentRightHeader'>
                                <div className='subContentRightHeaderName'>
                                    {subreddit.data ? <p className='bold'>{<Text text={subreddit.data.name} length={1000}/>}</p> : undefined}
                                    {login.authorization && subreddit && subreddit.data && !isUserPage(subreddit) ? <Subscribe name={subreddit.data ? subreddit.data.subreddit.name : undefined} subreddit={{data: subreddit.data.subreddit}} text='Follow'/> : undefined}
                                    {login.authorization && subreddit && subreddit.data && isUserPage(subreddit) ? <Subscribe name={subreddit.data ? subreddit.data.subreddit.name : undefined} subreddit={{data: subreddit.data.subreddit}} moderated={true} text='Follow'/> : undefined}
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
                    </CSSTransition>
                </div>
            </div>
            <div className='updateWarning' style={updated ? {bottom: '32px'} : {}}>
                <svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24"><g><rect fill="none" height="24" width="24"/></g><g><g><path d="M11,8v5l4.25,2.52l0.77-1.28l-3.52-2.09V8H11z M21,10V3l-2.64,2.64C16.74,4.01,14.49,3,12,3c-4.97,0-9,4.03-9,9 s4.03,9,9,9s9-4.03,9-9h-2c0,3.86-3.14,7-7,7s-7-3.14-7-7s3.14-7,7-7c1.93,0,3.68,0.79,4.95,2.05L14,10H21z"/></g></g></svg>
                <p>Changes Saved</p>
            </div>
        </div>
    )
}

export default User;