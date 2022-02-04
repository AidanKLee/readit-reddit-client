import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import './sub.css';
import { useParams, Outlet, Link } from 'react-router-dom';
import { Text } from '../../components/ContentTile/ContentTile';
import reddit from '../../utilities/redditAPI';
import Categories from '../../components/Categories/Categories';
import { over18Style, returnToTop } from '../../utilities/functions';
import { useDispatch, useSelector } from 'react-redux';
import { selectLogin, setUpdate, toggleImageUpload } from '../../components/LogIn/loginSlice';
import CreatePost from '../../components/CreatePost/CreatePost';
import { selectNewPost } from '../../components/NewPost/newPostSlice';
import Subscribe from '../../components/Subscribe/Subscribe';
import { CSSTransition } from 'react-transition-group';

const Sub = (props) => {

    const dispatch = useDispatch();

    const login = useSelector(selectLogin);
    const update = useMemo(() => login.update,[login]);

    const newPost = useSelector(selectNewPost);
    
    const params = useParams();
    const subredditUrl = params.subredditId;

    const [ subreddit, setSubreddit ] = useState({});
    const [ height, setHeight ] = useState({});
    const [ updated, setUpdated ] = useState(false)
    const [ mountTop, setMountTop ] = useState(false)
    const [ mountUnder, setMountUnder ] = useState(false);
    const [ mountSide, setMountSide] = useState(false);

    const isReadyToMount = useMemo(() => subreddit && subreddit.data ? true : false,[subreddit]);

    const fetchData = async () => {
        const data = await reddit.fetchSubreddit(`r/${subredditUrl}`);
        const subData = {
            data: data.data,
        }
        setSubreddit({...subreddit, data: subData.data});
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
    }, [subredditUrl]);

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
            dispatch(setUpdate())
            setUpdated(true)
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
        if (!subreddit.recommended && subreddit.data) {
            const fetchRecommended = async (name) => {
                const data = await reddit.fetchSubredditSearch(name, 11, null, subreddit.data.over18);
                setSubreddit({
                    ...subreddit,
                    recommended: data.data.children.splice(1),
                })
            }
            fetchRecommended(subreddit.data.display_name)
            setSubreddit({
                ...subreddit,
                initialFetchComplete: true
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[subreddit.data])

    useEffect(() => {
        getHeight(setHeight);
    },[subreddit.recommended])

    useLayoutEffect(() => {
        window.addEventListener('resize', getHeight);
        getHeight(setHeight);
        return () => window.removeEventListener('resize', getHeight());
    },[])

    const backgroundColor = subreddit.data && subreddit.data.banner_background_color ? {backgroundColor: subreddit.data.banner_background_color} : subreddit.data && subreddit.data.key_color ? {backgroundColor: subreddit.data.key_color} : {backgroundColor: 'rgb(13, 121, 168)'};

    const getTextColor = () => {
        let hexColor = backgroundColor.backgroundColor;

        const componentToHex = (c) => {
            var hex = c.toString(16);
            return hex.length === 1 ? "0" + hex : hex;
        }

        if (hexColor.toLowerCase().includes('rgb')) {
            hexColor = hexColor.replace(/[^\d,]/g, '').split(',');
            const [ r, g, b ] = hexColor;
            hexColor = "#" + componentToHex(parseInt(r)) + componentToHex(parseInt(g)) + componentToHex(parseInt(b));
            
        }

        hexColor = hexColor.replace("#", "");
        var r = parseInt(hexColor.substr(0,2),16);
        var g = parseInt(hexColor.substr(2,2),16);
        var b = parseInt(hexColor.substr(4,2),16);
        var yiq = ((r*299)+(g*587)+(b*114))/1000;
        return (yiq >= 128) ? {color: '#000000'} : {color: '#ffffff'};
    }

    const getBannerImg = () => {
        if (subreddit.data) {
            if (subreddit.data.banner_img) {
                return <img style={over18Style(subreddit, login)} src={subreddit.data.banner_img} alt={subreddit.data.title + ' Banner'}/>
            } else if (subreddit.data.banner_background_image) {
                let url = subreddit.data.banner_background_image.split('?')[0]
                return <img style={over18Style(subreddit, login)} src={url} alt={subreddit.data.title + ' Banner'}/>
            };
        };
    };

    const handleClick = (e) => {
        // dispatch(clearMainPageState());
        returnToTop(e);
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
            let height = (parent.offsetHeight - position).toString() + 'px';
            setHeight({height: height});
        }
    }

    const isModeratedSubreddit = (subreddit) => {
        if (subreddit.data) {
            const name = subreddit.data.name;
            const moderatedList = login.authorization.moderated;
            let isModerated = false;

            if (moderatedList) {
                moderatedList.forEach(subreddit => {
                    if (name === subreddit.name) {
                        isModerated = true
                    }
                })

                return isModerated;
            }
        }
    }

    const toggleUpload = (upload_type) => {
        dispatch(toggleImageUpload({upload_type: upload_type, subreddit: subreddit.data.display_name}))
    }

    const renderRecommended = () => {      
        if (subreddit.recommended) {
            return (
                <div className='subContentRightRecommended' style={backgroundColor}>
                    <p className='bold subContentRightRecommendedHeading' style={getTextColor()}>
                        Recommended
                    </p>
                    <div className='subContentRightRecommendedLinks' style={height}>
                        {
                            subreddit.recommended.map(sub => {
                                return (
                                    <div className='subContentRightRecommendedLink' key={sub.data.id}>
                                        <div className='subContentRightRecommendedLinkLeft'>
                                            <Link onClick={handleClick} to={`/${sub.data.display_name_prefixed}`}>
                                                {reddit.getIconImg(sub)}
                                            </Link>
                                            <div className='subContentRightRecommendedLinkData'>
                                                <Link onClick={handleClick} to={`/${sub.data.display_name_prefixed}`}><p className='subHeading bold'>{sub.data.display_name_prefixed} {sub.data.over18 ? <span className='blue'>NSFW</span> : undefined}</p></Link>
                                                <p className='subHeading'>{sub.data.subscribers} members</p>
                                            </div>
                                        </div>
                                        {login.authorization ? <Subscribe name={sub.data ? sub.data.name : undefined} subreddit={sub} text='Join'/> : undefined}
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
        <CSSTransition in={true} appear={true} timeout={1000} classNames='tran1'>
            <div className='sub'>
                <CSSTransition in={mountTop} timeout={300} classNames={'tran8'} mountOnEnter={true} unmountOnExit={true} onEntered={() => setMountUnder(true)}>
                    <div className='subBanner' style={backgroundColor}>
                        {getBannerImg()}
                        {login.authorization && !isModeratedSubreddit(subreddit) ? <Subscribe name={subreddit.data ? subreddit.data.name : undefined} subreddit={subreddit} text='Join'/> : undefined}
                        {login.authorization && isModeratedSubreddit(subreddit) ? <svg className='iconUpload' onClick={() => toggleUpload('banner')} xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M14.12 4l1.83 2H20v12H4V6h4.05l1.83-2h4.24M15 2H9L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2zm-3 7c1.65 0 3 1.35 3 3s-1.35 3-3 3-3-1.35-3-3 1.35-3 3-3m0-2c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z"/></svg> : undefined}
                    </div>
                </CSSTransition>
                
                <CSSTransition in={mountUnder} timeout={300} classNames={'tran8'} mountOnEnter={true} unmountOnExit={true} onExit={() => setMountSide(false)} onExited={() => setMountTop(false)} onEntered={() => setMountSide(true)}>
                    <div className='subBannerUnder'>
                        <div className='subBannerUnderWrapper'>
                        <div className='subBannerIconWrapper'>
                            <div className='iconImgWrapper'>
                                {subreddit && subreddit.data ? reddit.getIconImg(subreddit, over18Style(subreddit, login)) : undefined}
                            </div>
                            {login.authorization && isModeratedSubreddit(subreddit) ? <svg className='iconUpload' onClick={() => toggleUpload('icon')} xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M14.12 4l1.83 2H20v12H4V6h4.05l1.83-2h4.24M15 2H9L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2zm-3 7c1.65 0 3 1.35 3 3s-1.35 3-3 3-3-1.35-3-3 1.35-3 3-3m0-2c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z"/></svg> : undefined}
                        </div>
                            
                            
                            <div className='subBannerUnderText'>
                                <h1>
                                    {subreddit.data ? <Text text={subreddit.data.title} length={300}/> : undefined}
                                </h1>
                                <p>
                                    {subreddit.data ? subreddit.data.url : undefined}
                                </p>
                                {subreddit.data && (subreddit.data.over_18 || subreddit.data.over18) ? <p className='userDetailsNsfw'>NSFW</p> : undefined}
                            </div>
                        </div>
                    </div>
                </CSSTransition>
                <div className='subContent'>
                    <div className='content'>
                        <CSSTransition in={newPost.open} timeout={300} classNames={'tran9'} mountOnEnter={true} unmountOnExit={true}><CreatePost /></CSSTransition>
                        <Categories page={'/r/' + subredditUrl}/>
                        <Outlet/>
                    </div>
                    <div className='subContentRight'>
                        <CSSTransition in={mountSide} timeout={300} classNames={'tran9'} mountOnEnter={true} unmountOnExit={true} >
                            <div className='subContentRightSticky'>
                                <div className='subContentRightHeader' style={backgroundColor}>
                                    <div className='subContentRightHeaderName'>
                                        {subreddit.data ? <p className='bold' style={getTextColor()}>{<Text text={subreddit.data.title} length={300}/>}</p> : undefined}
                                        {login.authorization && !isModeratedSubreddit(subreddit) ? <Subscribe name={subreddit.data ? subreddit.data.name : undefined} subreddit={subreddit} text='Join'/> : undefined}
                                        {login.authorization && isModeratedSubreddit(subreddit) ? <Subscribe name={subreddit.data ? subreddit.data.name : undefined} moderated={true} subreddit={subreddit} text='Join'/> : undefined}
                                    </div>
                                    {subreddit.data ? <p className='subHeading' style={getTextColor()}>{subreddit.data.url}</p> : undefined}

                                    <div className='subContentRightHeaderStats'>
                                        <div>
                                            {subreddit.data ? <p className='heading bold' style={getTextColor()}>{subreddit.data.subscribers}</p> : undefined}
                                            <p className='subHeading' style={getTextColor()}>Followers</p>
                                        </div>
                                        <div>
                                            {subreddit.data ? <p className='heading bold' style={getTextColor()}>{subreddit.data.accounts_active}</p> : undefined}
                                            <p className='subHeading' style={getTextColor()}>Online</p>
                                        </div>
                                    </div>
                                </div>
                                <div className='subContentRightMain'>
                                    <p className='bold'>
                                        About
                                    </p>
                                    {subreddit.data && subreddit.data.public_description ? <div><p className='paragraph'>{<Text text={subreddit.data.public_description} length={500}/>}</p></div> : undefined}
                                    {subreddit.data && subreddit.data.description && (!subreddit.data.description.includes(subreddit.data.public_description) && !subreddit.data.public_description.includes(subreddit.data.description)) ? <div><p className='paragraph'>{<Text text={subreddit.data.description} length={500}/>}</p></div> : undefined}
                                </div>
                                {renderRecommended()}
                            </div>
                        </CSSTransition>
                    </div>
                </div>
                <div className='updateWarning' style={updated ? {bottom: '32px', opacity: 1} : {}}>
                    <svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24"><g><rect fill="none" height="24" width="24"/></g><g><g><path d="M11,8v5l4.25,2.52l0.77-1.28l-3.52-2.09V8H11z M21,10V3l-2.64,2.64C16.74,4.01,14.49,3,12,3c-4.97,0-9,4.03-9,9 s4.03,9,9,9s9-4.03,9-9h-2c0,3.86-3.14,7-7,7s-7-3.14-7-7s3.14-7,7-7c1.93,0,3.68,0.79,4.95,2.05L14,10H21z"/></g></g></svg>
                    <p>Changes Saved</p>
                </div>
            </div>
        </CSSTransition>
    )
}

export default Sub;