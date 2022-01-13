import React, { useEffect } from 'react';
import './searchBar.css';
import { returnToTop } from '../../utilities/functions';
import { selectSearchBar, search, fetchSearch, fetchSubredditSearch, fetchUsersSearch, setInitialSearchBarState } from './searchBarSlice';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { selectLogin } from '../LogIn/loginSlice';

const SearchBar = (props) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const searchBar = useSelector(selectSearchBar);
    const login = useSelector(selectLogin);

    const dispatchSearch = () => {
        if (searchBar.search.length > 0) {
            dispatch(fetchSearch({
                search: searchBar.search,
                limit: 10,
                over18: login.authorization && login.authorization.user && login.authorization.user.over_18 ? true : false
            }));
            dispatch(fetchSubredditSearch({
                search: searchBar.search,
                limit: 5,
                over18: login.authorization && login.authorization.user && login.authorization.user.over_18 ? true : false
            }));
            dispatch(fetchUsersSearch({
                search: searchBar.search,
                limit: 5,
                over18: login.authorization && login.authorization.user && login.authorization.user.over_18 ? true : false
            }));
        }
    }

    const handleChange = (e) => {
        dispatch(search(e.target.value));
    }
    const searchBarElement = document.getElementsByClassName('searchBarInput')[0];
    const handleLinkClick = () => {
        // dispatch(clearMainPageState())
        returnToTop();
        searchBarElement.value = '';
        dispatch(setInitialSearchBarState())
    }

    useEffect(() => {
        if (searchBar.search) {
            const searchTimeout = setTimeout(dispatchSearch, 1000);
            return () => {
                clearTimeout(searchTimeout);
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[searchBar.search])

    const renderSearchResults = () => {
        if (searchBar.results && searchBar.results.data && searchBar.results.data.children.length > 0) {
            return (
                <div>
                    <span className='searchBarTitle'>SEARCH RESULTS</span>
                    {
                        searchBar.results.data.children.map(result => {
                            return (
                                <Link onClick={handleLinkClick} key={result.data.id} to={result.data.permalink.slice(0, result.data.permalink.length - 1)}>
                                    <li className='searchBarResultsItem'>
                                        <p>
                                            <span className='searchBarResultsItemSubredditName'>{result.data.subreddit_name_prefixed}: </span>{result.data.title}
                                        </p>
                                    </li>
                                </Link>
                            )
                        })
                    }
                    <Link onClick={handleLinkClick} to={`search/posts?q=${searchBar.search}`}><p className='searchBarViewMore'>VIEW MORE...</p></Link>
                </div>
            )
        }
        return;
    }

    const renderSubredditsResults = () => {
        if (searchBar.subreddits && searchBar.subreddits.data && searchBar.subreddits.data.children.length > 0) {
            return (
                <div>
                    <span className='searchBarTitle'>COMMUNITIES</span>
                    {
                        searchBar.subreddits.data.children.map(subreddit => {
                            return (
                                <Link onClick={handleLinkClick} key={subreddit.data.id} to={subreddit.data.url.slice(0, subreddit.data.url.length - 1)}>
                                    <li className='searchBarSubredditsItem'>
                                        <p className='searchBarSubredditsItemTitle'>{subreddit.data.display_name} {subreddit.data.over18 ? <span>NSFW</span> : ''}</p>
                                        <p className='searchBarSubredditsItemCount'>Subscribers: {subreddit.data.subscribers}</p>
                                    </li>
                                </Link>
                            )
                        })
                    }
                    <Link onClick={handleLinkClick} to={`search/subreddits?q=${searchBar.search}`}><p className='searchBarViewMore'>VIEW MORE...</p></Link>
                </div>
            )
        }
        return;
    }

    const renderUsersResults = () => {
        if (searchBar.users && searchBar.users.data && searchBar.users.data.children.length > 0) {
            return (
                <div>
                    <span className='searchBarTitle'>USERS</span>
                    {
                        searchBar.users.data.children.map(user => {
                            return (
                                <Link onClick={handleLinkClick} to={`u/${user.data.name}`} key={user.data.id}>
                                    <li className='searchBarSubredditsItem'>
                                        <p className='searchBarSubredditsItemTitle'>{user.data.name} {user.data.over18 ? <span>NSFW</span> : ''}</p>
                                        <p className='searchBarSubredditsItemCount'>Karma: {user.data.link_karma}</p>
                                    </li>
                                </Link>
                            )
                        })
                    }
                    <Link onClick={handleLinkClick} to={`search/users?q=${searchBar.search}`}><p className='searchBarViewMore'>VIEW MORE...</p></Link>
                </div>
            )
        }
        return;
    }

    const handleKeyDown = (e) => {
        if (e.keyCode === 13) {
            e.preventDefault();
            navigate(`/search/posts?q=${e.target.value}`, {replace: false});
            e.target.value = '';
            dispatch(setInitialSearchBarState())
        }
    }

    return (
        <div className='searchBar'>
            <label htmlFor='searchBarInput'>
                <svg className='searchBarSvg' data-test='searchBarSvg' xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
            </label>
            <input onKeyDown={handleKeyDown} onChange={handleChange} className='searchBarInput searchInput' type='search' placeholder="Search..." data-test='searchBar' autoComplete='on'/>
            <ul className='searchBarResults'>
                {renderSubredditsResults()}
                {renderSearchResults()}
                {renderUsersResults()}
            </ul>
        </div>
    );
};

export default SearchBar;