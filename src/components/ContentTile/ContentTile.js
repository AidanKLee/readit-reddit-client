import React, { useState } from "react";
import './contentTIle.css';
import { useDispatch, useSelector } from "react-redux";
import { getTimePosted, returnToTop, isImage, over18Style } from "../../utilities/functions";
import { addNewComment, selectMain } from "../../containers/Main/mainSlice";
import CommentSection from "../Comments/CommentSection";
import { selectLogin } from '../LogIn/loginSlice';
import { Link } from "react-router-dom";
import reddit from "../../utilities/redditAPI";
import Awards from "../Awards/Awards";
import Votes from "../Votes/Votes";
import showdown from 'showdown';
import CommentSubmit from "../Comments/CommentSubmit";
import DeleteButton from "../DeleteButton/DeleteButton";

const ContentTile = (props) => {

    const dispatch = useDispatch();

    const article = props.article;
    const i = props.i;
    const main = useSelector(selectMain);
    const login = useSelector(selectLogin);

    const [ newComment, setNewComment ] = useState(false);

    const handleLinkClick = (e) => {
        // dispatch(clearMainPageState());
        returnToTop(e);
    }

    const toggleNewComment = () => {
        setNewComment(!newComment);
    }

    return (
        <div className="tile" key={article.data.id}>
            <Votes ups={article.data.ups} article={article}/>
            
            <div className="tileContent">
                <div className="tileHeader">
                    <Link onClick={handleLinkClick} to={'/' + article.data.subreddit_name_prefixed}>                
                        {reddit.getIconImg(main.page.subreddits[i])}
                    </Link>
                    <p className="tileHeaderText"><Link onClick={handleLinkClick} to={'/' + article.data.subreddit_name_prefixed}><span className="bold">{article.data.subreddit_name_prefixed}</span></Link> - Posted by <Link onClick={handleLinkClick} to={`/u/${article.data.link_author ? article.data.link_author : article.data.author}`}>u/{article.data.link_author ? article.data.link_author : article.data.author}</Link> {getTimePosted(article.data.created)}</p>
                </div>
                <div className="tileMain">
                    {article.data.permalink ? <Link onClick={handleLinkClick} to={article.data.permalink.slice(3, 5).includes('u_') ? '/u/' + article.data.permalink.slice(5) : article.data.permalink}><p className="tileMainTitle">{article.data.over_18 ? <span className="blue">NSFW </span> : undefined}<Text text={article.data.title} length={1000}/></p></Link> : undefined}
                    {
                        article.data.link_permalink ? 
                        <div>
                            <p className="tileMainText">
                                <Link onClick={handleLinkClick} to={'/u/' + article.data.author}>
                                    <strong>{article.data.author + ' '}</strong>
                                </Link> 
                                posted a comment on 
                                <Link onClick={handleLinkClick} to={'/u/' + article.data.link_author}>
                                    <strong>{' ' + article.data.link_author}</strong>
                                </Link>
                                's post:
                            </p>
                            <Link onClick={handleLinkClick} to={article.data.permalink.slice(3, 5).includes('u_') ? '/u/' + article.data.permalink.slice(5).split('/').slice(0, article.data.permalink.split('/').length - 4).join('/') : article.data.permalink.split('/').slice(0, article.data.permalink.split('/').length - 2).join('/')}>
                                <p className="tileMainTitle">{<Text text={article.data.link_title} length={1000}/>}</p>
                            </Link>
                        </div> 
                        : 
                        undefined
                    }
                    {article.data.selftext ? <p className="tileMainText"><Text text={article.data.selftext} length={500}/></p> : undefined}
                    {article.data.url && article.data.url.length > 0 && (!article.data.url.includes('https://www.reddit.com') || (article.data.url.includes('https://www.reddit.com') && article.data.url.includes('gallery'))) && !isImage(article.data.url) && !article.data.url.includes('.gifv') && !article.data.is_video ? <p className="tileMainText"><a target='_blank' rel='noreferrer' href={article.data.url}>{article.data.url}</a></p> : undefined}
                    <div className="tileObjectContainer video">
                        {isImage(article.data.url) && article.data.url.includes('.gifv') ? <video style={over18Style(article, login)} className="tileMainVideo" autoPlay muted loop><source src={article.data.url.replace('.gifv', '.mp4')}/></video> : undefined}
                        {article.data.is_video && article.data.media ? <video style={over18Style(article, login)} className="tileMainVideo" controls><source src={article.data.media.reddit_video.fallback_url} /></video> : undefined}
                    </div>
                    <div className="tileObjectContainer">
                        {isImage(article.data.url) && !article.data.url.includes('.gifv') ? <img style={over18Style(article, login)} className="tileMainImg" src={article.data.url} alt={article.data.id}/> : undefined}
                    </div>
                </div>
                {article.data.all_awardings.length > 0 ? <Awards article={article}/> : undefined}
                {
                    login.authorization ?
                        <div className="tileActions">
                        <div className="tileActionsLeft">
                            <div className="tileActionsAward">
                                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 12 7.4l3.38 4.6L17 10.83 14.92 8H20v6z"/></svg>
                                <p>Award</p>
                            </div>
                            <label htmlFor={'tileComment' + article.data.id} onClick={toggleNewComment} className="tileActionsAward">
                                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM20 4v13.17L18.83 16H4V4h16zM6 12h12v2H6zm0-3h12v2H6zm0-3h12v2H6z"/></svg>
                                <p>Comment</p>
                            </label>
                        </div>
                            
                            {login.authorization && login.authorization.user && article.data && article.data.author_fullname && 't2_' + login.authorization.user.id === article.data.author_fullname ? <div className="tileActionsAward"><DeleteButton name={article.data.name} type={'post'} text={false}/></div> : undefined}
                        </div> : undefined
                }
                {newComment ? <CommentSubmit id={'tileComment' + article.data.id} parentName={article.data.name} rootCommentList={main.page.comments[i]} stateSetter={addNewComment} dispatcher={dispatch} comments={main.page.comments[i]} x={i}/> : undefined}
                {(main.page.comments && main.page.comments[i] && main.page.comments[i].length > 0) || article.data.body ? <CommentSection rootCommentList={main.page.comments[i]} stateSetter={addNewComment} dispatcher={dispatch} comments={main.page.comments[i]} x={i} article={article}/> : undefined}
            </div>
        </div>
    )
}

export const Text = (props) => {

    let { text, length } = props;
    const [ showMore, setShowMore ] = useState(false);
    const converter = new showdown.Converter();

    let html = converter.makeHtml(text);

    if (html) {
        html = html
        .replaceAll('h6', 'strong').replaceAll('h5', 'strong')
        .replaceAll('h4', 'h6').replaceAll('h3', 'h5')
        .replaceAll('h2', 'h4').replaceAll('h1', 'h3')
        .replaceAll('<a ', '<a target="_blank" rel="noreferrer" ');
    }

    const toggleShowMore = () => {
        showMore ? setShowMore(false) : setShowMore(true);
    }

    const renderText = () => {
        if (text && text.length > length) {
            return showMore ? <span><span className="markdown" dangerouslySetInnerHTML={{__html: html + ' '}}/><span className="readMore" onClick={toggleShowMore}>Show Less</span></span> : <span><span className="markdown" dangerouslySetInnerHTML={{__html: html.slice(0, length) + '... '}}/><span className="readMore" onClick={toggleShowMore}>Read More</span></span>
        } else if (!text) {
            return ''
        }
        return <span className="markdown" dangerouslySetInnerHTML={{__html: html}}/>;
    }

    return renderText();
}

export default ContentTile;