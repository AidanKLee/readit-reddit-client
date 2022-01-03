import React from "react";
import './contentTIle.css';
import { useSelector } from "react-redux";
import { getTimePosted, returnToTop } from "../../utilities/functions";
import { selectMain } from "../../containers/Main/mainSlice";
import CommentSection from "../Comments/CommentSection";
import { selectLogin } from '../LogIn/loginSlice';
import { Link } from "react-router-dom";
import reddit from "../../utilities/redditAPI";

const ContentTile = (props) => {

    const article = props.article;
    const i = props.i;
    const main = useSelector(selectMain);
    const login = useSelector(selectLogin);

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
        if (typeof(string) === 'string') {
            let isImage = false;
            const imageExt = ['.jpg', '.jpeg', '.jpe', '.jif', '.jfif', '.jfi', '.jp2', '.j2k', '.jpf', '.jpx', '.jpm', '.mj2', '.png', '.gif', '.webp', '.tiff', '.tif', '.bmp', '.dib',  '.svg', '.svgz', '.ai', '.eps']
            imageExt.forEach(ext => {
                if (string.includes(ext)) {
                    isImage = true;
                }
            });
            return isImage;
        } 
    }

    const renderAwards = () => {
        if (article.data.all_awardings.length > 0) {
            return (
                <div className="tileAwards">
                    {
                        article.data.all_awardings.map(award => {
                            return (
                                <div className="tileAward" key={award.id}>
                                    <img src={award.icon_url} alt={award.name}/>
                                    <p>
                                        {award.count > 1 ? award.count : undefined}
                                    </p>
                                </div>
                            )
                        })
                    }
                </div>
            )
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
                    <Link onClick={returnToTop} to={'/' + article.data.subreddit_name_prefixed.toLowerCase()}>                
                        {reddit.getIconImg(main.page.subreddits[i])}
                    </Link>
                    <p className="tileHeaderText"><Link onClick={returnToTop} to={'/' + article.data.subreddit_name_prefixed.toLowerCase()}><span className="bold">{article.data.subreddit_name_prefixed}</span></Link> - Posted by <Link onClick={returnToTop} to={`/u/${article.data.author.toLowerCase()}`}>u/{article.data.author}</Link> {getTimePosted(article.data.created)}</p>
                </div>
                <div className="tileMain">
                    <Link onClick={returnToTop} to={'/' + article.data.permalink}><p className="tileMainTitle">{article.data.title}</p></Link>
                    {article.data.selftext ? <p className="tileMainText">{article.data.selftext}</p> : undefined}
                    <div className="tileObjectContainer video">
                        {isImage(article.data.url) && article.data.url.includes('.gifv') ? <iframe title={article.data.url} src={article.data.url.slice(0, -5)} width="200" height="220" scrolling="no" style={{border: 'none'}}></iframe> : undefined}
                        {article.data.is_video && article.data.media ? <video className="tileMainVideo" controls><source src={article.data.media.reddit_video.fallback_url} /></video> : undefined}
                    </div>
                    <div className="tileObjectContainer">
                        {isImage(article.data.url) && !article.data.url.includes('.gifv') ? <img className="tileMainImg" src={article.data.url} alt={article.data.id}/> : undefined}
                    </div>
                </div>
                {renderAwards()}
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
                {main.page.comments && main.page.comments[i] && main.page.comments[i].length > 0 ? <CommentSection comments={main.page.comments[i]}/> : undefined}
            </div>
        </article>
    )
}

export default ContentTile;