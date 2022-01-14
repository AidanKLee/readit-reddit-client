export const getTimePosted = (t) => {
    const date = new Date(t * 1000);
    const dateNow = new Date();

    const dateInSeconds = date.getTime() / 1000;
    const nowInSeconds = dateNow.getTime() / 1000;

    const secondsAgo = Math.floor(nowInSeconds - dateInSeconds);
    const minutesAgo = Math.floor(secondsAgo / 60);
    const hoursAgo = Math.floor(minutesAgo / 60);
    const daysAgo = Math.floor(hoursAgo / 24);
    const weeksAgo = Math.floor(daysAgo / 7);
    const monthsAgo = Math.floor(daysAgo / (365 / 12));
    const yearsAgo = Math.floor(daysAgo / 365);
    const decadesAgo = Math.floor(yearsAgo / 10);

    if (secondsAgo < 60) {
        return secondsAgo === 1 ? secondsAgo.toString() + ' second ago' : secondsAgo.toString() + ' seconds ago';
    } else if (secondsAgo < 60 * 60) {
        return minutesAgo === 1 ? minutesAgo.toString() + ' minute ago' : minutesAgo.toString() + ' minutes ago';
    } else if (secondsAgo < 60 * 60 * 24) {
        return hoursAgo === 1 ? hoursAgo.toString() + ' hour ago' : hoursAgo.toString() + ' hours ago';
    } else if (secondsAgo < 60 * 60 * 24 * (364 / 52)) {
        return daysAgo === 1 ? daysAgo.toString() + ' day ago' : daysAgo.toString() + ' days ago';
    } else if (secondsAgo < 60 * 60 * 24 * (365 / 12)) {
        return weeksAgo === 1 ? weeksAgo.toString() + ' week ago' : weeksAgo.toString() + ' weeks ago';
    } else if (secondsAgo < 60 * 60 * 24 * 365) {
        return monthsAgo === 1 ? monthsAgo.toString() + ' month ago' : monthsAgo.toString() + ' months ago';
    } else if (secondsAgo < 60 * 60 * 24 * 365 * 10) {
        return yearsAgo === 1 ? yearsAgo.toString() + ' year ago' : yearsAgo.toString() + ' years ago';
    }
    return decadesAgo === 1 ? yearsAgo.toString() / 10 + ' decade ago' :  yearsAgo.toString() / 10 + ' decades ago';
}

export const returnToTop = () => {
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
    });
}

export const getHeight = (setter) => {
    const element = document.getElementsByClassName('subContentRightRecommendedLinks')[0];
    let parent = document.getElementsByClassName('subContentRightSticky')[0];
    if (!parent) {
        parent = document.getElementsByClassName('userContentRightSticky')[0];
    }
    if (element) {
        const position = element.offsetTop;
        let height = (parent.offsetHeight - position).toString() + 'px';
        setter({maxHeight: height});
    } 
}

export const isImage = (string) => {
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

export const getUpVotes = (votes) => {
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

export const over18Style = (article, login) => {
    if (article.data.over_18 === true) {
        if (article.data.over_18 && (!login.authorization || (login.authorization && login.authorization.settings && !login.authorization.settings.over_18))) {
            return {filter: 'blur(32px)', pointerEvents: 'none'}
        }
    } else if (article.data.over18 === true) {
        if (article.data.over18 && (!login.authorization || (login.authorization && login.authorization.settings && !login.authorization.settings.over_18))) {
            return {filter: 'blur(32px)', pointerEvents: 'none'}
        }
    } else if (article.data.subreddit && article.data.subreddit.over_18 === true) {
        if (article.data.subreddit.over_18 && (!login.authorization || (login.authorization && login.authorization.settings && !login.authorization.settings.over_18))) {
            return {filter: 'blur(32px)', pointerEvents: 'none'}
        }
    } else if (article.data.subreddit && article.data.subreddit.over18 === true) {
        if (article.data.subreddit.over18 && (!login.authorization || (login.authorization && login.authorization.settings && !login.authorization.settings.over_18))) {
            return {filter: 'blur(32px)', pointerEvents: 'none'}
        }
    }
    
    return {}
}