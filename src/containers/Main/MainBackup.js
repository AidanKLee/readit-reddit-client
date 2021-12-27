import React, { useEffect } from "react";
import './main.css';
import { useSelector, useDispatch } from 'react-redux';
import { selectMenu } from "../Menu/menuSlice";
import { selectMain, fetchContent } from "./mainSlice";
import loader from '../../assets/loader.svg';

const Main = () => {

    const dispatch = useDispatch();

    const menu = useSelector(selectMenu);
    const main = useSelector(selectMain);

    const getTimePosted = (t) => {
        const date = new Date(t * 1000);
        const dateNow = new Date();
        let posted = new Date(dateNow - date);

        const hours = posted.getHours();
        const minutes = '0' + posted.getMinutes();
        const seconds = '0' + posted.getSeconds();

        if (!hours && !minutes) {
            return seconds.toString() + ' seconds ago';
        } else if (!hours) {
            return minutes.toString() + ' minutes ago';
        } else if (hours < 24) {
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

    useEffect(() => {
        dispatch(fetchContent({}))
    },[dispatch])

    const renderList = () => {
        if (main.page.content && main.page.content.data && main.page.content.data.children) {
            return main.page.content.data.children.map(article => {
                return (
                    <article className="mainArticle" key={article.data.id}>
                        <div className="mainArticleSide">
                            <svg className="mainArticleSideUp" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z"/></svg>
                            <span>{getUpVotes(article.data.ups)}</span>
                            <svg className="mainArticleSideDown" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z"/></svg>
                        </div>
                        <div className="mainArticleContent">
                            <div className="mainArticleHeader">
                                <p className="mainArticleHeaderTop"><span className="bold">{article.data.subreddit_name_prefixed}</span> - Posted by u/{article.data.author} {getTimePosted(article.data.created)}</p>
                            </div>
                            <div className="mainArticleMain">
                                <p className="mainArticleMainTitle">{article.data.title}</p>
                                {article.data.selftext ? <p className="mainArticleMainText">{article.data.selftext}</p> : undefined}
                                <div className="objectContainer">
                                    {isImage(article.data.url) && !article.data.url.includes('.gifv') ? <img className="mainArticleMainImg" src={article.data.url} alt={article.data.id}/> : undefined}
                                    {isImage(article.data.url) && article.data.url.includes('.gifv') ? <video className="mainArticleMainVideo" controls><source src={article.data.url}/></video> : undefined}
                                    {article.data.is_video && article.data.media ? <video className="mainArticleMainVideo" controls><source src={article.data.media.reddit_video.fallback_url}/></video> : undefined}
                                </div>
                            </div>
                        </div>
                    </article>
                )
            })
        }
    }

    return (
        <main className={menu.menuOpen ? 'blur' : ''}>
            <div className="mainWrapper">
                <div className="mainSelect">
                    <div className="mainSelectLeft">
                        <div className="mainSelectIconWrapper">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z"/></svg>
                            <span>Best</span>
                        </div>
                        <div className="mainSelectIconWrapper">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><g><rect fill="none" height="24" width="24" y="0"/></g><g><path d="M19.48,12.35c-1.57-4.08-7.16-4.3-5.81-10.23c0.1-0.44-0.37-0.78-0.75-0.55C9.29,3.71,6.68,8,8.87,13.62 c0.18,0.46-0.36,0.89-0.75,0.59c-1.81-1.37-2-3.34-1.84-4.75c0.06-0.52-0.62-0.77-0.91-0.34C4.69,10.16,4,11.84,4,14.37 c0.38,5.6,5.11,7.32,6.81,7.54c2.43,0.31,5.06-0.14,6.95-1.87C19.84,18.11,20.6,15.03,19.48,12.35z M10.2,17.38 c1.44-0.35,2.18-1.39,2.38-2.31c0.33-1.43-0.96-2.83-0.09-5.09c0.33,1.87,3.27,3.04,3.27,5.08C15.84,17.59,13.1,19.76,10.2,17.38z"/></g></svg>
                            <span>Hot</span>
                        </div>
                        <div className="mainSelectIconWrapper">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M23 12l-2.44-2.78.34-3.68-3.61-.82-1.89-3.18L12 3 8.6 1.54 6.71 4.72l-3.61.81.34 3.68L1 12l2.44 2.78-.34 3.69 3.61.82 1.89 3.18L12 21l3.4 1.46 1.89-3.18 3.61-.82-.34-3.68L23 12zm-4.51 2.11l.26 2.79-2.74.62-1.43 2.41L12 18.82l-2.58 1.11-1.43-2.41-2.74-.62.26-2.8L3.66 12l1.85-2.12-.26-2.78 2.74-.61 1.43-2.41L12 5.18l2.58-1.11 1.43 2.41 2.74.62-.26 2.79L20.34 12l-1.85 2.11zM11 15h2v2h-2zm0-8h2v6h-2z"/></svg>
                            <span>New</span>
                        </div>
                        <div className="mainSelectIconWrapper">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><rect fill="none" height="24" width="24"/><path d="M19,5h-2V3H7v2H5C3.9,5,3,5.9,3,7v1c0,2.55,1.92,4.63,4.39,4.94c0.63,1.5,1.98,2.63,3.61,2.96V19H7v2h10v-2h-4v-3.1 c1.63-0.33,2.98-1.46,3.61-2.96C19.08,12.63,21,10.55,21,8V7C21,5.9,20.1,5,19,5z M5,8V7h2v3.82C5.84,10.4,5,9.3,5,8z M12,14 c-1.65,0-3-1.35-3-3V5h6v6C15,12.65,13.65,14,12,14z M19,8c0,1.3-0.84,2.4-2,2.82V7h2V8z"/></svg>
                            <span>Top</span>
                        </div>
                        <div className="mainSelectIconWrapper">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6h-6z"/></svg>
                            <span>Rising</span>
                        </div>
                    </div>
                    <svg className="mainSelectMore" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
                </div>
                {renderList()}
                {main.isLoading ? <div className="mainLoading"><img className="loader" src={loader} alt='Loader' /><p>Loading...</p></div> : <div className="mainLoadMore"><p>Load More...</p></div>}
            </div>
        </main>
    );
};

export default Main;