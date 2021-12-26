import React, { useEffect } from 'react';
import './searchBar.css';
import { selectSearchBar, search, fetchSearch, fetchSubredditSearch } from './searchBarSlice';
import { useSelector, useDispatch } from 'react-redux';

const SearchBar = () => {

    const dispatch = useDispatch();

    const searchBar = useSelector(selectSearchBar);

    const handleChange = (e) => {
        dispatch(search(e.target.value));
    }

    useEffect(() => {
        dispatch(fetchSearch(searchBar.search));
        dispatch(fetchSubredditSearch(searchBar.search));
    },[dispatch, searchBar.search])

    const renderSearchResults = () => {
        if (searchBar.results && searchBar.results.data && searchBar.results.data.children.length > 0) {
            return (
                <div>
                    <span className='searchBarTitle'>SEARCH RESULTS</span>
                    {
                        searchBar.results.data.children.map(result => {
                            return (
                                <li key={result.data.id} className='searchBarResultsItem'>
                                    <p>
                                        <span className='searchBarResultsItemSubredditName'>{result.data.subreddit_name_prefixed}: </span>{result.data.title}
                                    </p>
                                </li>
                            )
                        })
                    }
                    <p className='searchBarViewMore'>VIEW MORE...</p>
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
                                <li key={subreddit.data.id} className='searchBarSubredditsItem'>
                                    <p className='searchBarSubredditsItemTitle'>{subreddit.data.display_name} {subreddit.data.over18 ? <span>NSFW</span> : ''}</p>
                                    <p className='searchBarSubredditsItemCount'>Subscribers: {subreddit.data.subscribers}</p>
                                </li>
                            )
                        })
                    }
                    <p className='searchBarViewMore'>VIEW MORE...</p>
                </div>
            )
        }
        return;
    }

    return (
        <div className='searchBar'>
            <label htmlFor='searchBarInput'>
                <svg className='searchBarSvg' data-test='searchBarSvg' xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
            </label>
            <input onChange={handleChange} className='searchBarInput searchInput' type='search' placeholder="Search..." data-test='searchBar' />
            <ul className='searchBarResults'>
                {renderSubredditsResults()}
                {renderSearchResults()}
            </ul>
        </div>
    );
};

export default SearchBar;