import React, { useEffect, useState } from 'react';
import './post.css';
import { Link } from 'react-router-dom';
import { isImage } from '../../utilities/functions';
import reddit from '../../utilities/redditAPI';
import { Text } from '../../components/ContentTile/ContentTile';
import Awards from '../../components/Awards/Awards';
import CommentSection from '../../components/Comments/CommentSection';
import { useDispatch, useSelector } from 'react-redux';
import { selectLogin } from '../../components/LogIn/loginSlice';
import Votes from '../../components/Votes/Votes';
import { setArticle } from '../../containers/Main/mainSlice';

const Post = (props) => {

    const dispatch = useDispatch();

    const login = useSelector(selectLogin);

    const { page } = props;

    const [ post, setPost ] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            const data = await reddit.fetchComment(page);
            const post = {
                data: data[0].data.children[0].data,
                comments: data[1].data.children
            }
            setPost(post);
            dispatch(setArticle(post));
        }
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[page])

    return (
        <div className='post'>
            <h2>
                {post && post.data ? <Text text={post.data.title} length={500}/> : undefined}
            </h2>
            <p className='postBy'>
                Posted by {post && post.data ? <Link to={`/u/${post.data.author}`}><strong>{post.data.author}</strong></Link> : undefined}
            </p>
            {post && post.data && post.data.selftext ? <p className=""><Text text={post.data.selftext} length={1500}/></p> : undefined}
            {post && post.data && post.data.url && post.data.url.length > 0 && (!post.data.url.includes('https://www.reddit.com') || (post.data.url.includes('https://www.reddit.com') && post.data.url.includes('gallery'))) && !isImage(post.data.url) && !post.data.url.includes('.gifv') && !post.data.is_video ? <p className="tileMainText"><a target='_blank' rel='noreferrer' href={post.data.url}>{post.data.url}</a></p> : undefined}
            <div className="tileObjectContainer video">
                {post && post.data && isImage(post.data.url) && post.data.url.includes('.gifv') ? <video className="tileMainVideo" autoPlay muted loop><source src={post.data.url.replace('.gifv', '.mp4')}/></video> : undefined}
                {post && post.data && post.data.is_video && post.data.media ? <video className="tileMainVideo" controls><source src={post.data.media.reddit_video.fallback_url} /></video> : undefined}
            </div>
            <div className="tileObjectContainer">
                {post && post.data && isImage(post.data.url) && !post.data.url.includes('.gifv') ? <a href={post.data.url} target='_blank' rel='noreferrer'><img className="tileMainImg" src={post.data.url} alt={post.data.id}/></a> : undefined}
            </div>
            <div className='postBar'>
                <div className="postActions">
                    {/* {
                        login.authorization ? */}
                        <div>
                            <div className="postAction">
                                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 12 7.4l3.38 4.6L17 10.83 14.92 8H20v6z"/></svg>
                                <p>Award</p>
                            </div>
                            <div className="postAction">
                                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM20 4v13.17L18.83 16H4V4h16zM6 12h12v2H6zm0-3h12v2H6zm0-3h12v2H6z"/></svg>
                                <p>Comment</p>
                            </div>
                        </div> 
                        {/* : undefined
                    } */}
                    <div className='postAction'>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92zM18 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM6 13c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm12 7.02c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/></svg>
                        <p>Share</p>
                    </div>
                </div>
                <div className='postVotes'>
                    {post && post.data ? <Votes ups={post.data.ups} downs={post.data.downs}/>: undefined}
                    {post && post.data ? <p>{Math.round((100 / (post.data.ups + post.data.downs)) * post.data.ups) + '% '}Upvoted</p> : undefined}
                </div>
            </div>
            {post && post.data && post.data.all_awardings.length > 0 ? <Awards article={post}/> : undefined}
            {post && post.data && post.comments ? <div><h3>Comments</h3><CommentSection showing='all' article={post} comments={post.comments}/></div> : undefined}
        </div>
    )
}

export default Post;