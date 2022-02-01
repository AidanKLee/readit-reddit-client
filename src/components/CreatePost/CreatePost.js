import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import reddit from '../../utilities/redditAPI';
import { selectLogin } from '../LogIn/loginSlice';
import { selectNewPost, setPostKind, handleChange, toggleBooleanParams, handleCommunityChange, communitySearch, clearSearchResults, setSelectedSubreddit, clearSelectedSubreddit, submitPost, resetSubmit, clearLastPost } from '../NewPost/newPostSlice';
import './createPost.css';

const CreatePost = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    let location = useLocation().pathname;
    const newPost = useSelector(selectNewPost);
    const login = useSelector(selectLogin);

    const postKindStyle = (kind) => {
        if ((kind === 'image' || kind === 'video' || kind === 'videogif') && (newPost.params.kind === 'image' || newPost.params.kind === 'video' || newPost.params.kind === 'videogif')) {
            return {color: 'var(--bg1)', backgroundColor: 'var(--prim1)', fill: 'var(--bg1)'}
        }
        if (newPost.params.kind === kind) {
            return {color: 'var(--bg1)', backgroundColor: 'var(--prim1)', fill: 'var(--bg1)'}
        }
        return {}
    }

    const postMediaKindStyle = (kind) => {
        if (newPost.params.kind === kind) {
            return {backgroundColor: 'var(--over3)'}
        }
        return {}
    }

    const handleKindClick = (e) => {
        if (e.target.value !== newPost.params.kind) {
            dispatch(setPostKind(e.target.value))
        }
    }

    const handleParamChange = (e) => {
        let name = e.target.name;
        const value = e.target.value;
        if (name === 'title') {
            dispatch(handleChange({key: name, value: value}))
        } else if (name === 'self') {
            name = 'text';
            dispatch(handleChange({key: name, value: value}))
        } else {
            name = 'url';
            dispatch(handleChange({key: name, value: value}))
        }
        
    }

    const renderMediaType = () => {
        if (newPost.params.kind === 'image' || newPost.params.kind === 'video' || newPost.params.kind === 'videogif') {
            return (
                <div className='createPostMediaType'>
                    <button onClick={handleKindClick} value={'image'} style={postMediaKindStyle('image')}>
                        Image
                    </button>
                    <button onClick={handleKindClick} value={'video'}  style={postMediaKindStyle('video')}>
                        Video
                    </button>
                    <button onClick={handleKindClick} value={'videogif'} style={postMediaKindStyle('videogif')}>
                        Video Gif
                    </button>
                </div>
            )
        }
    }

    const handleBooleanToggle = (e) => {
        dispatch(toggleBooleanParams(e.target.name))
    }

    const handleBooleanStyle = (name, param) => {
        let params = {}
        if (newPost.params[name]) {
            params = {backgroundColor: 'var(--over1)', color: 'var(--bg1)', fill: 'var(--bg1)'}
        }
        if (param && newPost.community.selected && newPost.community.selected.data && !newPost.community.selected.data[param]) {
            params = {...params, pointerEvents: 'none', backgroundColor: 'rgba(0, 0, 0, 0.3)'}
        }
        return params
    }

    const handleComChange = (e) => {
        dispatch(handleCommunityChange(e.target.value))
        dispatch(clearSelectedSubreddit())
    }

    const dispatchSearch = () => {
        if (newPost.community.search.length > 0) {
            dispatch(communitySearch({
                search: newPost.community.search,
                limit: 25,
                over18: login.authorization.user.over_18
            }))
        }
    }

    const handleSubredditSelect = async (e) => {
        const value = await JSON.parse(e.target.value);
        dispatch(setSelectedSubreddit(value));
        value.data ? dispatch(handleCommunityChange(value.data.display_name_prefixed)) : dispatch(handleCommunityChange(value.subreddit.display_name_prefixed));
        dispatch(clearSearchResults());
    }

    const handleSubmit = () => {
        let params = {...newPost.params}
        if (params.sr) {
            if (params.kind === 'self') {
                delete params.url
            } else {
                delete params.text;
            }
            dispatch(submitPost(params))
            dispatch(resetSubmit())
        }
    }

    const handleCancel = () => {
        dispatch(resetSubmit())
    }

    useEffect(() => {
        if (newPost.community.search.length > 0) {
            const searchTimeout = setTimeout(dispatchSearch, 1000);
            return () => {
                clearTimeout(searchTimeout);
            }
        } else if (newPost.community.search.length === 0) {
            dispatch(clearSearchResults());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[newPost.community.search])

    useEffect(() => {
        if (newPost.lastPost && newPost.lastPost.json && newPost.lastPost.json.data) {
            let post = '/' + newPost.lastPost.json.data.url.split('/').slice(3).join('/');
            if (post.includes('/r/u_')) {
                post = post.replace('/r/u_', '/u/')
            }
            navigate(post, {replace: false})
            dispatch(clearLastPost())
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[newPost.lastPost])

    useEffect(() => {
        if (location.slice(0, 3).includes('/r/') || location.slice(0, 3).includes('/u/')) {
            let locationCheck = location;
            const setSubreddit = async () => {
                if (locationCheck.includes('/comments/')) {
                    locationCheck = location.split('/').slice(0, 3).join('/');
                }
                if (locationCheck.includes('/u/' + login.authorization.user.name)) {
                    locationCheck = locationCheck.replace('/u/', 'user/')
                    locationCheck = locationCheck.split('/').slice(0,2).join('/');
                }
                locationCheck = locationCheck.split('/').slice(0, 3).join('/')
                const subreddit = await reddit.fetchSubreddit(locationCheck);
                if (subreddit.data.subreddit) {
                    dispatch(handleCommunityChange(subreddit.data.subreddit.display_name_prefixed))
                    dispatch(setSelectedSubreddit(subreddit.data))
                } else {
                    dispatch(handleCommunityChange(subreddit.data.display_name_prefixed))
                    dispatch(setSelectedSubreddit(subreddit))
                }
            }
            setSubreddit();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[location, newPost.open])

    const renderSearchResults = () => {
        if (newPost.community.results.length > 0) {
            return (
                <div>
                    {newPost.community.results.map(result => {
                        return (
                            <li key={result.data.id} className='createPostCommunityItem'>
                                <button onClick={handleSubredditSelect} name={result.data.display_name} value={JSON.stringify(result)}>
                                    {reddit.getIconImg(result)}
                                    <div className='createPostCommunityItemText'>
                                        <p className='bold'>{result.data.display_name_prefixed}</p>
                                        <p>{result.data.subscribers} members</p>
                                    </div>
                                </button>
                            </li>
                        )
                    })}
                </div>
            )
        }
    }

    return (
        <div className='createPost'>
            <div className='createPostType'>
                <button onClick={handleKindClick} style={postKindStyle('self')} value={'self'}>
                    <svg style={postKindStyle('self')} xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24"><g><rect fill="none" height="24" width="24"/></g><g><g/><g><path d="M17,19.22H5V7h7V5H5C3.9,5,3,5.9,3,7v12c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2v-7h-2V19.22z"/><path d="M19,2h-2v3h-3c0.01,0.01,0,2,0,2h3v2.99c0.01,0.01,2,0,2,0V7h3V5h-3V2z"/><rect height="2" width="8" x="7" y="9"/><polygon points="7,12 7,14 15,14 15,12 12,12"/><rect height="2" width="8" x="7" y="15"/></g></g></svg>
                    Post
                </button>
                <button onClick={handleKindClick} style={postKindStyle('image')} value={'image'}>
                    <svg style={postKindStyle('image')} xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75 3.54-1.96-2.36L6.5 17h11l-3.54-4.71z"/></svg>
                    Media
                </button>
                <button onClick={handleKindClick} style={postKindStyle('link')} value={'link'}>
                    <svg style={postKindStyle('link')} xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M17 7h-4v2h4c1.65 0 3 1.35 3 3s-1.35 3-3 3h-4v2h4c2.76 0 5-2.24 5-5s-2.24-5-5-5zm-6 8H7c-1.65 0-3-1.35-3-3s1.35-3 3-3h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-2zm-3-4h8v2H8z"/></svg>
                    Link
                </button>
            </div>
            {renderMediaType()}
            <div className='createPostCommunity'>
                <label htmlFor='newPostCommunity'>
                    {newPost.community.selected.data || newPost.community.selected.subreddit ? newPost.community.selected.subreddit ? reddit.getIconImg(newPost.community.selected.subreddit) : reddit.getIconImg(newPost.community.selected) : <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>}
                </label>
                <input onChange={handleComChange} id='newPostCommunity' type='search' placeholder='Community..' value={newPost.community.search}/>
                <ul className='createPostCommunityList'>
                    {
                        !newPost.community.results[0] ?
                        <div>
                            <li key={login.authorization.user.id} className='createPostCommunityItem'>
                                <button onClick={handleSubredditSelect} name={login.authorization.user.subreddit.display_name} value={JSON.stringify(login.authorization.user)}>
                                    {reddit.getIconImg(login.authorization.user.subreddit)}
                                    <div className='createPostCommunityItemText'>
                                        <p className='bold'>{login.authorization.user.subreddit.display_name_prefixed}</p>
                                        <p>{login.authorization.user.subreddit.subscribers} members</p>
                                    </div>
                                </button>
                            </li>
                            {
                                login.authorization.communities.data.children.map(community => {
                                    return (
                                        <li key={community.data.id} className='createPostCommunityItem'>
                                            <button onClick={handleSubredditSelect} name={community.data.display_name} value={JSON.stringify(community)}>
                                                {reddit.getIconImg(community.data)}
                                                <div className='createPostCommunityItemText'>
                                                    <p className='bold'>{community.data.display_name_prefixed}</p>
                                                    <p>{community.data.subscribers} members</p>
                                                </div>
                                            </button>
                                        </li>
                                    )
                                })
                            }
                        </div> : undefined
                        
                    }
                    {renderSearchResults()}
                </ul>
            </div>
            <div className='createPostTitle'>
                <div className='createPostTitleInput'>
                    <input type='text' name={'title'} onChange={handleParamChange} placeholder='Title...' value={newPost.params.title} maxLength={300}/>
                    <p>{newPost.params.title.length}/300</p>
                </div>
            </div>
            <div className='createPostBody'>
                {newPost.params.kind === 'self' ? <textarea placeholder='Text...' onChange={handleParamChange} name={newPost.params.kind} value={newPost.params.text}></textarea> : <input type={'url'} placeholder='Link...' onChange={handleParamChange} name={newPost.params.kind} value={newPost.params.url}/>}
            </div>
            <div className='createPostTags'>
                <button name={'nsfw'} onClick={handleBooleanToggle} style={handleBooleanStyle('nsfw')}>
                    {newPost.params.nsfw ? <svg style={handleBooleanStyle('nsfw')} xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 13H5v-2h14v2z"/></svg> : <svg style={handleBooleanStyle('nsfw')} xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>}
                    NSFW
                </button>
                <button name={'spoiler'} onClick={handleBooleanToggle} style={handleBooleanStyle('spoiler')}>
                    {newPost.params.spoiler ? <svg style={handleBooleanStyle('spoiler', 'spoilers_enabled')} xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 13H5v-2h14v2z"/></svg> : <svg style={handleBooleanStyle('spoiler')} xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>}
                    SPOILERS
                </button>
                <button name={'original_content'} onClick={handleBooleanToggle} style={handleBooleanStyle('original_content', 'original_content_tag_enabled')}>
                    {newPost.params.original_content ? <svg style={handleBooleanStyle('original_content')} xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 13H5v-2h14v2z"/></svg> : <svg style={handleBooleanStyle('original_content')} xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>}
                    OC
                </button>
            </div>
            <div className='createPostActions'>
                <button onClick={handleSubmit}>
                    Submit
                </button>
                <button onClick={handleCancel}>
                    Cancel
                </button>
            </div>
        </div>
    )
}

export default CreatePost;