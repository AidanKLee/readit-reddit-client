import React from "react";

const ContentTile = (props) => {

    const article = props.article;

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
}

export default ContentTile;