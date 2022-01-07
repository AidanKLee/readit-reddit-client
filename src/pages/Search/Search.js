import React, { useEffect, useState } from 'react';
import './search.css';
import { useLocation, useParams, useSearchParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { returnToTop } from '../../utilities/functions';
import reddit from '../../utilities/redditAPI';
import ContentTile from '../../components/ContentTile/ContentTile';
import { useDispatch, useSelector } from 'react-redux';
import { fetchComments, fetchSubreddits, selectMain } from '../../containers/Main/mainSlice';

const Search = () => {

    const [ searchParams, setSearchParams ] = useSearchParams();

    const query = searchParams.get('q');
    const sort = searchParams.get('sort');
    const time = searchParams.get('time');
    const type = useParams().searchType;
    const [ over18, setOver18 ] = useState(searchParams.get('over18'));

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
    const [ loadingData, setLoadingData ] = useState(false);

    console.log(loadingData)

    // console.log(searchData)

    const location = useLocation().pathname + useLocation().search;

    const fetchData = async () => {
        setLoadingData(true)
        console.log('running')
        let t = '';
        if (type === 'posts') {
            t = '';
        } else if (type === 'subreddits') {
            t = 'sr';
        } else if (type === 'users') {
            t = 'user';
        }
        const data = await reddit.fetchSearch(query, 25, sort, time, t, over18, searchData.after);
        if (!data) {
            setSearchData({
                ...searchData,
                noResults: true
            })
        } else if (data && (!searchData.after || searchData.location !== location)) {
            setSearchData({
                results: data.data.children,
                after: data.data.children[data.data.children.length - 1].data.id,
                location: location
            })   
        } else if (data && searchData.after && searchData.location === location) {
            setSearchData({
                ...searchData,
                results: searchData.results.concat(data.data.children),
                after: data.data.children[data.data.children.length - 1].data.id,
            })
        }
        setLoadingData(false)
    }

    useEffect(() => {
        if (!loadingData) {
            fetchData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sort, time, type, over18, query])

    window.onscroll = () => {
        const loadMore = document.getElementsByClassName('mainLoadMore');
        if (loadMore.length > 0 && location.includes('/search/')) {
            const loadPosition = loadMore[0].offsetTop - 400;
            const scrollPosition = window.scrollY + window.innerHeight;
            console.log(loadPosition, scrollPosition)
            if (loadPosition <= scrollPosition && !loadingData) {
                fetchData();
            }
        }
    }

    const setQueryParams = param => {
        const [ key, value ] = param
        const newQueryString = {
            ...queryString,
            [key]: value
        }
        setSearchParams(newQueryString)
        setQueryString(newQueryString)
    }

    const handleLinkClick = () => {
        returnToTop();
        setQueryString({
            q: query
        })
    }

    const isActive = (key, value) => {
        if (key === value) {
            return ' active';
        }
        return ''
    }

    const handleToggleSafe = () => {
        const button = document.getElementsByClassName('searchSafeToggleButton')[0];
        button.style.left === '6px' ? button.style.left = '0px' : button.style.left = '6px';
        if (over18) {
            setOver18(false);
            setQueryParams(['over18', 'false']);
        } else {
            setOver18(true);
            setQueryParams(['over18', 'true']);
        }
    }

    return (
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
                            <li onClick={() => setQueryParams(['sort', 'relevance'])} className={'searchParamsSortItem dropdown' + isActive(sort, 'relevance')}>
                                <p>Relevance</p>
                            </li>
                            <li onClick={() => setQueryParams(['sort', 'hot'])} className={'searchParamsSortItem dropdown' + isActive(sort, 'hot')}>
                                <p>Hot</p>
                            </li>
                            <li onClick={() => setQueryParams(['sort', 'top'])} className={'searchParamsSortItem dropdown' + isActive(sort, 'top')}>
                                <p>Top</p>
                            </li>
                            <li onClick={() => setQueryParams(['sort', 'new'])} className={'searchParamsSortItem dropdown' + isActive(sort, 'new')}>
                                <p>New</p>
                            </li>
                            <li onClick={() => setQueryParams(['sort', 'comments'])} className={'searchParamsSortItem dropdown' + isActive(sort, 'comments')}>
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
                            <li onClick={() => setQueryParams(['time', 'all'])} className={'searchParamsTimeItem dropdown' + isActive(time, 'all')}>
                                <p>All</p>
                            </li>
                            <li onClick={() => setQueryParams(['time', 'year'])} className={'searchParamsTimeItem dropdown' + isActive(time, 'year')}>
                                <p>Year</p>
                            </li>
                            <li onClick={() => setQueryParams(['time', 'month'])} className={'searchParamsTimeItem dropdown' + isActive(time, 'month')}>
                                <p>Month</p>
                            </li>
                            <li onClick={() => setQueryParams(['time', 'week'])} className={'searchParamsTimeItem dropdown' + isActive(time, 'week')}>
                                <p>Week</p>
                            </li>
                            <li onClick={() => setQueryParams(['time', 'day'])} className={'searchParamsTimeItem dropdown' + isActive(time, 'day')}>
                                <p>Day</p>
                            </li>
                            <li onClick={() => setQueryParams(['time', 'hour'])} className={'searchParamsTimeItem dropdown' + isActive(time, 'hour')}>
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
                        <div className='searchSafeToggleButton'></div>
                    </div>
                </div>
            </div>
            <p className='searchSearchingFor'>Searching for <strong>{type}</strong> related to <strong>{query}</strong>.</p>
            <div className='content'>
            
                {type === 'posts' ? <SearchPosts setLoadingData={setLoadingData} searchData={searchData} loadingData={loadingData}/> : undefined}
                {type === 'subreddits' ? <SearchSubreddits setLoadingData={setLoadingData} searchData={searchData} loadingData={loadingData}/> : undefined}
                {type === 'users' ? <SearchUsers setLoadingData={setLoadingData} searchData={searchData} loadingData={loadingData}/> : undefined}
            </div>
            
        </div>
        
    )
}

const SearchUsers = (props) => {
    return (
        <div className='searchUsers'>
            Users
        </div>
    )
}

const SearchSubreddits = (props) => {
    return (
        <div className='searchSubreddits'>
            Subreddits
        </div>
    )
}

const SearchPosts = (props) => {

    const dispatch = useDispatch();

    const { searchData, setLoadingData } = props;
    const posts = searchData.results;

    const [ contentReady, setContentReady ] = useState(false);

    const main = useSelector(selectMain);

    // console.log(main)

    // useEffect(() => {
    //     if (posts && contentReady) {
    //         console.log('running other')
    //         const content = posts.slice(-25);
    //         dispatch(fetchComments({
    //             comments: content
    //         }));
    //         dispatch(fetchSubreddits({
    //             subreddits: content
    //         }))
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // },[contentReady])

    const renderPosts = () => {
        if (posts) {
            // setLoadingData(false);
            // setContentReady(true);
            return posts.map((article, index) => {
                    return (
                        <div key={article.data.id + index} className='searchPostsResult'>
                            <ContentTile i={index} article={article}/>
                        </div>
                    )
                }
            )
        }
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