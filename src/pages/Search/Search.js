import React, { useEffect, useMemo, useState } from 'react';
import './search.css';
import { useLocation, useParams, useSearchParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { returnToTop } from '../../utilities/functions';
import reddit from '../../utilities/redditAPI';
import ContentTile, { Text } from '../../components/ContentTile/ContentTile';
import { useDispatch, useSelector } from 'react-redux';
import { clearMainPageState, fetchComments, fetchSubreddits } from '../../containers/Main/mainSlice';
import loader from '../../assets/loader.svg';
import { selectLogin } from '../../components/LogIn/loginSlice';
import { CSSTransition } from 'react-transition-group';

const Search = () => {

    const dispatch = useDispatch();

    const login = useSelector(selectLogin);

    const [ searchParams, setSearchParams ] = useSearchParams();

    const query = searchParams.get('q');
    const sort = searchParams.get('sort');
    const time = searchParams.get('time');
    const type = useParams().searchType;
    const [ over18, setOver18 ] = useState(login.authorization && login.authorization.settings && (login.authorization.settings.search_include_over_18 || login.authorization.settings.search_include_over_18 === false) ? login.authorization.settings.search_include_over_18 : searchParams.get('over18') === 'true');

    const getInitialQuery = () => {
        let initialQueryString = {};
        if (query) {initialQueryString = {q: query}};
        if (sort) {initialQueryString = {...initialQueryString, sort: sort}};
        if (time) {initialQueryString = {...initialQueryString, time: time}};
        if (over18) {initialQueryString = {...initialQueryString, over18: over18}}
        return initialQueryString;
    }

    const [ queryString, setQueryString ] = useState(getInitialQuery());
    const [ searchData, setSearchData ] = useState({});
    const [ stickyContent, setStickyContent ] = useState();
    const [ loadingData, setLoadingData ] = useState(false);
    const [ allDataLoaded, setAllDataLoaded ] = useState(false);
    const [ noData, setNoData ] = useState(false);

    const location = useLocation().pathname + useLocation().search;

    const fetchData = async (afterData) => {
        setQueryString(getInitialQuery())
        setLoadingData(true)
        let t = '';
        if (type === 'posts') {
            t = '';
        } else if (type === 'subreddits') {
            t = 'sr';
        } else if (type === 'users') {
            t = 'user';
        }
        try {
            const data = await reddit.fetchSearch(query, 25, sort, time, t, over18, afterData);
            if (!data) {
                setSearchData({
                    ...searchData,
                    noResults: true
                })
            } else if (data && (!searchData.after || searchData.location !== location)) {
                setSearchData({
                    results: data.data.children,
                    after: data.data.children[data.data.children.length - 1].data.name,
                    location: location
                })   
            } else if (data && searchData.after && searchData.location === location) {
                setSearchData({
                    ...searchData,
                    results: searchData.results.concat(data.data.children),
                    after: data.data.children[data.data.children.length - 1].data.name,
                })
            }
            if (data.data.children.length < 25) {
                setAllDataLoaded(true);
            }
            setNoData(false)
        } catch (e) {
            setNoData(true);
        }
        setLoadingData(false)
    }

    useEffect(() => {
        setAllDataLoaded(false)
        if (!loadingData) {
            dispatch(clearMainPageState());
            returnToTop();
            setSearchData({});
            fetchData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sort, time, type, over18, query])

    useEffect(() => {
        setMountSticky(false)
        setReadyToMount(false)
        if (type === 'posts') {
            const getStickyContent = async () => {
                const subreddits = await reddit.fetchSearch(query, 5, 'relevance', 'all', 'sr', over18);
                const users = await reddit.fetchSearch(query, 5, 'relevance', 'all', 'user', over18);
                const content = {
                    subreddits: subreddits.data.children ? subreddits.data.children : [],
                    users: users.data.children ? users.data.children : []
                }
                setStickyContent(content);
            }
            getStickyContent()
        } else {
            setStickyContent({});
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[over18, location])

    window.onscroll = () => {
        const loadMore = document.getElementsByClassName('mainLoadMore');
        if (loadMore.length > 0 && location.includes('/search/') && !allDataLoaded) {
            const loadPosition = loadMore[0].offsetTop - 400;
            const scrollPosition = window.scrollY + window.innerHeight;
            if (loadPosition <= scrollPosition && !loadingData) {
                fetchData(searchData.after);
            }
        }
    }

    const setQueryParams = params => {
        const [ key, value ] = params
        const newQueryString = {
            ...queryString,
            [key]: value
        }
        setSearchParams(newQueryString)
        setQueryString(newQueryString)
    }

    const handleLinkClick = (e) => {
        // dispatch(clearMainPageState());
        setSearchData({});
        returnToTop(e);
        setQueryString({
            q: query
        });
    }

    const isActive = (key, value) => {
        if (key === value) {
            return ' active';
        }
        return ''
    }

    const handleToggleSafe = () => {
        setSearchData({})
        if (over18) {
            setOver18(false);
            handleSortClick(['over18', 'false']);
        } else {
            setOver18(true);
            handleSortClick(['over18', 'true']);
        }
    }

    const styleSafe = over18 ? {left: '6px'} : {left: '0px'};

    const handleSortClick = (params, e) => {
        dispatch(clearMainPageState());
        returnToTop(e);
        setQueryParams(params);
    }

    const renderNoReultsMessage = () => {
        if (type === 'posts') {
            return <span><Link to={`/search/subreddits?q=${query}`}>Subreddits</Link> or <Link to={`/search/users?q=${query}`}>Users</Link></span>
        } else if (type === 'subreddits') {
            return <span><Link to={`/search/posts?q=${query}`}>Posts</Link> or <Link to={`/search/users?q=${query}`}>Users</Link></span>
        } else {
            return <span><Link to={`/search/posts?q=${query}`}>Posts</Link> or <Link to={`/search/subreddits?q=${query}`}>Subreddits</Link></span>
        }
    }

    const renderCommunities = () => {
        return (
            <div className='searchRightStickyCommunities'>
                {
                    stickyContent.subreddits.map(community => {
                        return (
                            <div key={community.data.id} className='searchRightStickyItem'>
                                <div className='searchRightStickyItemLeft'>
                                    <Link to={`/${community.data.display_name_prefixed}`}>
                                        {reddit.getIconImg(community)}
                                    </Link>
                                    <div className='searchRightStickyItemText'>
                                        <Link to={`/${community.data.display_name_prefixed}`}>
                                            <p className='bold'>
                                                {community.data.display_name_prefixed}
                                                {community.data.over18 ? <span> NSFW</span> : undefined}
                                            </p>
                                        </Link>
                                        <p>
                                            {community.data.subscribers ? community.data.subscribers + ' subscribers' : '0 subscribers'}
                                        </p>
                                    </div>
                                </div>
                                <button className='searchRightStickyButton' type='button'>Join</button>
                            </div>
                            
                        )
                    })
                }
            </div>
        )
    }

    const renderUsers = () => {
        return (
            <div className='searchRightStickyCommunities'>
                {
                    stickyContent.users.map(user => {
                        if (user.data.subreddit) {
                            return (
                            <div key={user.data.id} className='searchRightStickyItem'>
                                <div className='searchRightStickyItemLeft'>
                                    <Link to={`/${user.data.subreddit.display_name_prefixed}`}>
                                        {reddit.getIconImg(user)}
                                    </Link>
                                    <div className='searchRightStickyItemText'>
                                        <Link to={`/${user.data.subreddit.display_name_prefixed}`}>
                                            <p className='bold'>
                                                {user.data.subreddit.display_name_prefixed} {user.data.subreddit.over_18 ? <span> NSFW</span> : undefined}
                                            </p>
                                        </Link>
                                        <p>
                                            {user.data.link_karma ? user.data.link_karma + ' karma' : '0 karma'}
                                        </p>
                                    </div>
                                </div>
                                <button className='searchRightStickyButton' type='button'>Follow</button>
                            </div>
                            
                            )
                        }
                        return undefined
                    })
                }
            </div>
        )
    }

    const [ mountSticky, setMountSticky ] = useState(false);
    const [ readyToMount, setReadyToMount ] = useState(false);

    useEffect(() => {
        if (stickyContent && (stickyContent.subreddits && stickyContent.users) && (stickyContent.subreddits.length > 0 || stickyContent.users.length > 0)) {
            setMountSticky(true)
        }
    },[stickyContent])

    return (
        <CSSTransition in={true} appear={true} timeout={300} classNames='tran4'>
            <div className='search'>
                <div className='searchParams'>
                    <div className='searchParamsWrapper'>
                        <div className='searchParamsSelect'>
                            <div className='isActive dropdown'>
                                <p className={isActive(type, 'posts')}>Posts</p>
                                <p className={isActive(type, 'subreddits')}>Subreddits</p>
                                <p className={isActive(type, 'users')}>Users</p>
                                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M7 10l5 5 5-5H7z"/></svg>
                            </div>
                            <div className='dropdownList'>
                                <Link className={'dropdown' + isActive(type, 'posts')} to={`/search/posts?q=${query}`} onClick={handleLinkClick}><p>Posts</p></Link>
                                <Link className={'dropdown' + isActive(type, 'subreddits')} to={`/search/subreddits?q=${query}`} onClick={handleLinkClick}><p>Subreddits</p></Link>
                                <Link className={'dropdown' + isActive(type, 'users')} to={`/search/users?q=${query}`} onClick={handleLinkClick}><p>Users</p></Link>
                            </div>
                        </div>
                        {type === 'posts' ?
                        <div className='searchParamsSelectHidden'>
                        <div className='searchParamsSelect'>
                            <div className='searchParamsSortItem isActive dropdown'>
                                <p className={isActive(sort, null)}>Sort By...</p>
                                <p className={isActive(sort, 'relevance')}>Relevance</p>
                                <p className={isActive(sort, 'hot')}>Hot</p>
                                <p className={isActive(sort, 'top')}>Top</p>
                                <p className={isActive(sort, 'new')}>New</p>
                                <p className={isActive(sort, 'comments')}>Comments</p>
                                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M7 10l5 5 5-5H7z"/></svg>
                            </div>
                            <ul className='dropdownList'>
                                <li onClick={() => handleSortClick(['sort', 'relevance'])} className={'searchParamsSortItem dropdown' + isActive(sort, 'relevance')}>
                                    <p>Relevance</p>
                                </li>
                                <li onClick={() => handleSortClick(['sort', 'hot'])} className={'searchParamsSortItem dropdown' + isActive(sort, 'hot')}>
                                    <p>Hot</p>
                                </li>
                                <li onClick={() => handleSortClick(['sort', 'top'])} className={'searchParamsSortItem dropdown' + isActive(sort, 'top')}>
                                    <p>Top</p>
                                </li>
                                <li onClick={() => handleSortClick(['sort', 'new'])} className={'searchParamsSortItem dropdown' + isActive(sort, 'new')}>
                                    <p>New</p>
                                </li>
                                <li onClick={() => handleSortClick(['sort', 'comments'])} className={'searchParamsSortItem dropdown' + isActive(sort, 'comments')}>
                                    <p>Comments</p>
                                </li>
                            </ul>
                        </div>
                        <div className='searchParamsSelect'>
                            <div className='searchParamsTimeItem dropdown isActive'>
                                <p className={isActive(time, null)}>Age...</p>
                                <p className={isActive(time, 'all')}>All</p>
                                <p className={isActive(time, 'year')}>Year</p>
                                <p className={isActive(time, 'month')}>Month</p>
                                <p className={isActive(time, 'week')}>Week</p>
                                <p className={isActive(time, 'day')}>Day</p>
                                <p className={isActive(time, 'hour')}>Hour</p>
                                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M7 10l5 5 5-5H7z"/></svg>
                            </div>
                            <ul className='dropdownList'>
                                <li onClick={() => handleSortClick(['time', 'all'])} className={'searchParamsTimeItem dropdown' + isActive(time, 'all')}>
                                    <p>All</p>
                                </li>
                                <li onClick={() => handleSortClick(['time', 'year'])} className={'searchParamsTimeItem dropdown' + isActive(time, 'year')}>
                                    <p>Year</p>
                                </li>
                                <li onClick={() => handleSortClick(['time', 'month'])} className={'searchParamsTimeItem dropdown' + isActive(time, 'month')}>
                                    <p>Month</p>
                                </li>
                                <li onClick={() => handleSortClick(['time', 'week'])} className={'searchParamsTimeItem dropdown' + isActive(time, 'week')}>
                                    <p>Week</p>
                                </li>
                                <li onClick={() => handleSortClick(['time', 'day'])} className={'searchParamsTimeItem dropdown' + isActive(time, 'day')}>
                                    <p>Day</p>
                                </li>
                                <li onClick={() => handleSortClick(['time', 'hour'])} className={'searchParamsTimeItem dropdown' + isActive(time, 'hour')}>
                                    <p>Hour</p>
                                </li>
                            </ul>
                        </div>
                        </div> : undefined
                        }
                    </div>
                    <div className='searchSafe'>
                        <p>Safe Search</p>
                        <div className='searchSafeToggle' onClick={handleToggleSafe}>
                            <div className='searchSafeToggleButton' style={styleSafe}></div>
                        </div>
                    </div>
                </div>
                <p className='searchSearchingFor'>Searching for <strong>{type}</strong> related to <strong>{query}</strong>.</p>
                <div className='searchContent'>
                    <div className='content'>
                        {type === 'posts' && searchData && searchData.results && searchData.location.includes('/posts?') ? <SearchPosts setReadyToMount={setReadyToMount} setLoadingData={setLoadingData} searchData={searchData} loadingData={loadingData}/> : undefined}
                        {type === 'subreddits' ? <SearchSubreddits setLoadingData={setLoadingData} searchData={searchData} loadingData={loadingData}/> : undefined}
                        {type === 'users' ? <SearchUsers setLoadingData={setLoadingData} searchData={searchData} loadingData={loadingData}/> : undefined}
                        {loadingData ? <div className="mainLoading"><img className="loader" src={loader} alt='Loader' /><p>Loading...</p></div> : undefined}
                        {allDataLoaded ? <p className="mainLoading">No more results.</p> : <div className="mainLoadMore"></div>}
                        {noData ? <div className="mainLoading"><p>There are no results for your search. Look in {renderNoReultsMessage()}?</p></div> : undefined}
                    </div>
                    {
                        type === 'posts' && stickyContent && stickyContent.subreddits && stickyContent.users ?
                        <div className='searchContentRight'>
                            <CSSTransition in={mountSticky && readyToMount} timeout={600} classNames='tran11' mountOnEnter={true} unmountOnExit={true} onExited={() => setStickyContent()}>
                            <div className='searchContentRightSticky'>
                                {
                                    stickyContent.subreddits && stickyContent.subreddits.length > 0 ?
                                    <div className='searchContentRightStickyCommunitiesWrapper'>
                                        <div className='searchContentRightHeader'>
                                            <p className='searchContentRightHeading'>
                                                Communities
                                            </p>
                                            <Link to={`/search/subreddits?q=${query}`}>
                                                View More
                                            </Link>
                                        </div>
                                        <div className='searchContentRightMain'>
                                            {stickyContent && stickyContent.subreddits ? renderCommunities() : undefined}
                                        </div>
                                    </div> : undefined
                                }
                                {
                                    stickyContent.users && stickyContent.users.length > 0 ?
                                    <div className='searchContentRightStickyUsersWrapper'>
                                        <div className='searchContentRightHeader'>
                                            <p className='searchContentRightHeading'>
                                                Users
                                            </p>
                                            <Link to={`/search/users?q=${query}`}>
                                                View More
                                            </Link>
                                        </div>
                                        <div className='searchContentRightMain'>
                                            {stickyContent && stickyContent.users ? renderUsers(): undefined}
                                        </div>
                                    </div> : undefined
                                }
                            </div>
                            </CSSTransition>
                        </div> : undefined
                    }
                </div>
            </div>
        </CSSTransition>
        
    )
}

const SearchUsers = (props) => {

    const [ mount, setMount ] = useState(false);

    const { searchData } = props;
    const users = useMemo(() => searchData.results ? searchData.results : [],[searchData]);

    useEffect(() => {
        if (users.length > 0) {
            setMount(true);
        }
    },[users])

    const renderUsers = () => {
        return (
            users.map(result => {
                return (
                    !result.data.is_suspended ?
                    <CSSTransition 
                            key={result.data.id} 
                            in={mount}
                            timeout={300} 
                            classNames={'tran5'} 
                            mountOnEnter={true} 
                            unmountOnExit={true}
                    >
                        <div className='searchSubredditsResultsItem'>
                            <div className='searchSubredditsResultsData'>
                                <div className='searchSubredditsResultsDataLeft'>
                                    <Link to={`/${result.data.subreddit.display_name_prefixed}`}>
                                        {reddit.getIconImg(result)}
                                    </Link>
                                    <div>
                                        <Link to={`/${result.data.subreddit.display_name_prefixed}`}>
                                            <p className='bold'>{result.data.name} {result.data.subreddit.over_18 ? <span> NSFW</span>: undefined}</p>
                                        </Link>
                                        <p style={{fontSize: '.6rem', lineHeight: '1'}}>{result.data.subreddit.display_name_prefixed}</p>
                                        <p>{result.data.link_karma} karma</p>
                                    </div>
                                </div>
                                <button className='searchRightStickyButton' type='button'>Join</button>
                            </div>
                            <div className='searchSubredditsResultsItemBottom'>
                                {result.data.subreddit.public_description ? <Text text={result.data.subreddit.public_description} length='125'/> : <div className='spacer'></div>}
                            </div>
                            
                        </div>
                    </CSSTransition>
                    : undefined
                )
            })
        )
    }

    return (
        <div className='searchSubreddits'>
            <div className='searchSubredditsResults'>
                {users ? renderUsers() : undefined}
            </div>
        </div>
    )
}

const SearchSubreddits = (props) => {

    const [ mount, setMount ] = useState(false);
    
    const { searchData } = props;
    const subreddits = useMemo(() => searchData.results ? searchData.results : [],[searchData]);

    useEffect(() => {
        if (subreddits.length > 0) {
            setMount(true)
        }
    },[subreddits])

    const renderSubreddits = () => {
        return (
            subreddits.map(result => {
                return (
                    <CSSTransition 
                            key={result.data.id} 
                            in={mount}
                            timeout={300} 
                            classNames={'tran5'} 
                            mountOnEnter={true} 
                            unmountOnExit={true}
                    >
                        <div className='searchSubredditsResultsItem'>
                            <div className='searchSubredditsResultsData'>
                                <div className='searchSubredditsResultsDataLeft'>
                                    <Link to={`/${result.data.display_name_prefixed}`}>
                                        {reddit.getIconImg(result)}
                                    </Link>
                                    <div>
                                        <Link to={`/${result.data.display_name_prefixed}`}>
                                            <p className='bold'>{result.data.display_name} {result.data.over18 ? <span>NSFW</span>: undefined}</p>
                                        </Link>
                                        <p style={{fontSize: '.6rem', lineHeight: '1'}}>{result.data.display_name_prefixed}</p>
                                        <p>{result.data.subscribers} subscribers</p>
                                    </div>
                                </div>
                                <button className='searchRightStickyButton' type='button'>Join</button>
                            </div>
                            <div className='searchSubredditsResultsItemBottom'>
                            {result.data.public_description ? <Text text={result.data.public_description} length='125'/> : <div className='spacer'></div>}
                            </div>
                            
                        </div>
                    </CSSTransition>
                )
            })
        )
    }

    return (
        <div className='searchSubreddits'>
            <div className='searchSubredditsResults'>
                {renderSubreddits()}
            </div>
        </div>
    )
}

const SearchPosts = (props) => {

    const dispatch = useDispatch();

    const [ mount, setMount ] = useState(false);

    const { searchData, loadingData, setReadyToMount } = props;
    const posts = useMemo(() => searchData.results ? searchData.results : [],[searchData]);

    useEffect(() => {
        if (posts && !loadingData) {
            const content = posts.slice(-25);
            dispatch(fetchComments({
                comments: content
            }));
            dispatch(fetchSubreddits({
                subreddits: content
            }))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[loadingData])

    useEffect(() => {
        if (posts) {
            setMount(true)
        }
    },[posts])

    const renderPosts = () => {
            return posts.map((article, index) => {
                    return (
                        <CSSTransition 
                            key={article.data.id + index} 
                            in={mount}
                            timeout={300} 
                            classNames={'tran5'} 
                            mountOnEnter={true} 
                            unmountOnExit={true}
                            onEntered={() => setReadyToMount(true)}
                        >
                        <div key={article.data.id + index} className='searchPostsResult'>
                            <ContentTile i={index} article={article}/>
                        </div>
                        </CSSTransition>
                    )
                }
            )
    }

    return (
        <div className='searchPosts'>
            <div className='searchPostsResults'>
                {renderPosts()}
            </div>
        </div>
    )
}

export const searchSort = () => {
    
}

export default Search;