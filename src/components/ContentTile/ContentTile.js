import React, { useState } from "react";
import './contentTIle.css';
import { useSelector } from "react-redux";
import { selectMain } from "../../containers/Main/mainSlice";
import { selectLogin } from '../LogIn/loginSlice';
import redditLogo from '../../assets/redditLogo.svg';

const ContentTile = (props) => {

    const article = props.article;
    const i = props.i;
    const main = useSelector(selectMain);
    const login = useSelector(selectLogin);

    const [ commentsShowing, setCommentsShowing ] = useState(1);

    const getTimePosted = (t) => {
        const date = new Date(t * 1000);
        const dateNow = new Date();
        let posted = new Date(dateNow - date);

        const hours = posted.getHours() - 1;
        const minutes = posted.getMinutes();
        const seconds = posted.getSeconds();

        if (hours === 0 && minutes === 0) {
            return seconds.toString() + ' seconds ago';
        } else if (hours === 0) {
            return minutes.toString() + ' minutes ago';
        } else if (hours < 2 && hours > 0) {
            return hours + ' hour ago';
        } else if (hours < 24 && hours > 1) {
            return hours + ' hours ago';
        } else {
            return Math.round(hours / 24).toString() + ' days ago';
        }
    }

    const getUpVotes = (votes) => {
        votes = votes.toString()
        if (votes < 1000) {
            return votes;
        } else if (votes > 1000 && votes < 1000000) {
            votes = votes / 100;
            votes = Math.round(votes);
            return (votes / 10) + 'k'
        } else {
            votes = votes / 100000;
            votes = Math.round(votes);
            return (votes / 10) + 'm'
        }
    }

    const isImage = (string) => {
        let isImage = false;
        const imageExt = ['.jpg', '.jpeg', '.jpe', '.jif', '.jfif', '.jfi', '.jp2', '.j2k', '.jpf', '.jpx', '.jpm', '.mj2', '.png', '.gif', '.webp', '.tiff', '.tif', '.bmp', '.dib',  '.svg', '.svgz', '.ai', '.eps']
        imageExt.forEach(ext => {
            if (string.includes(ext)) {
                isImage = true;
            }
        });
        return isImage;
    }

    const renderComments = () => {
        const commentsArray = main.page.comments[i].slice(0).reverse().slice(1, commentsShowing + 1)
        return (
            commentsArray.map((comment, x) => {
                return (
                    <li key={comment.data.id} className="tileComment">
                        <p>{comment.data.body}</p>
                        <span><strong>Posted {getTimePosted(main.page.comments[i][main.page.comments[i].length - 2].data.created)}</strong> by {'u/' + comment.data.author}</span>
                        {renderSubComments(comment)}
                    </li>
                )
            })            
        )  
    }

    const renderSubComments = (comment) => {
        return (
            <ul>
                {
                    comment && comment.data && comment.data.replies && comment.data.replies.data ?
                        comment.data.replies.data.children.map(subComment => {
                            if (subComment && subComment.data && subComment.data.body ) {
                                return (
                                    <li key={subComment.data.id} className="tileComment">
                                        <p>{subComment.data.body}</p>
                                        <span><strong>Posted {getTimePosted(subComment.data.created)}</strong> by {'u/' + subComment.data.author}</span>
                                    </li>
                                )
                            }
                            else {
                                return undefined
                            }
                        })
                        : undefined
                }
            </ul>
        )
        
    }

    const handleViewMoreClick = () => {
        if (commentsShowing <= main.page.comments[i].length - 3) {
            setCommentsShowing(commentsShowing + 2)
        } else if (commentsShowing > main.page.comments[i].length - 3) {
            setCommentsShowing(commentsShowing + 1)
        }
        
    }

    const handeViewLessClick = () => {
        if (commentsShowing > 2) {
            setCommentsShowing(commentsShowing - 2)
        } else if (commentsShowing <= 2) {
            setCommentsShowing(commentsShowing - 1)
        }
    }

    return (
        <article className="tile" key={article.data.id}>
            <div className="tileSide">
                <svg className="tileSideUp" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z"/></svg>
                <span>{getUpVotes(article.data.ups)}</span>
                <svg className="tileSideDown" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z"/></svg>
            </div>
            <div className="tileContent">
                <div className="tileHeader">
                    {main.page.subreddits && main.page.subreddits[i] && main.page.subreddits[i].icon_img ? <img className="tileHeaderImg" src={main.page.subreddits[i].icon_img} alt={main.page.subreddits.display_name}/> : <img className="tileHeaderImg" src={redditLogo} alt={article.data.subreddit}/>}
                    <p className="tileHeaderText"><span className="bold">{article.data.subreddit_name_prefixed}</span> - Posted by u/{article.data.author} {getTimePosted(article.data.created)}</p>
                </div>
                <div className="tileMain">
                    <p className="tileMainTitle">{article.data.title}</p>
                    {article.data.selftext ? <p className="tileMainText">{article.data.selftext}</p> : undefined}
                    <div className="tileObjectContainer video">
                        {isImage(article.data.url) && article.data.url.includes('.gifv') ? <iframe title={article.data.url} src={article.data.url.slice(0, -5)} width="200" height="220" scrolling="no" style={{border: 'none'}}></iframe> : undefined}
                        {article.data.is_video && article.data.media ? <video className="tileMainVideo" controls><source src={article.data.media.reddit_video.fallback_url} /></video> : undefined}
                    </div>
                    <div className="tileObjectContainer">
                        {isImage(article.data.url) && !article.data.url.includes('.gifv') ? <img className="tileMainImg" src={article.data.url} alt={article.data.id}/> : undefined}
                    </div>
                </div>
                <div className="tileAwards">
                    {
                        article.data.all_awardings.map(award => {
                            return (
                                <div className="tileAward" key={award.name}>
                                    <img src={award.icon_url} alt={award.name}/>
                                    <p>
                                        {award.count > 1 ? award.count : undefined}
                                    </p>
                                </div>
                            )
                        })
                    }
                </div>
                {
                    login.authorization ?
                        <div className="tileActions">
                            <div className="tileActionsAward">
                                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 12 7.4l3.38 4.6L17 10.83 14.92 8H20v6z"/></svg>
                                <p>Award</p>
                            </div>
                            <div className="tileActionsAward">
                                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM20 4v13.17L18.83 16H4V4h16zM6 12h12v2H6zm0-3h12v2H6zm0-3h12v2H6z"/></svg>
                                <p>Comment</p>
                            </div>
                        </div> : undefined
                }
                <ul className="tileComments">
                    {main.page.comments && main.page.comments[i] ? renderComments() : undefined}
                </ul>
                {main.page.comments && main.page.comments[i] && main.page.comments[i].length > 1 ? <p className="tileCommentsRemaining">{main.page.comments[i].length - 1 - commentsShowing} comments remaining</p> : undefined}
                <div className="tileCommentsView">
                    {
                        main.page.comments[i] && main.page.comments[i].length - 1 > commentsShowing ? <p className="tileCommentsViewMore" onClick={handleViewMoreClick}>VIEW MORE...</p> : undefined
                    }
                    {
                        main.page.comments[i] && commentsShowing > 1 ? <p className="tileCommentsViewMore" onClick={handeViewLessClick}>VIEW LESS...</p> : undefined
                    }
                </div>
            </div>
        </article>
    )
}

export default ContentTile;