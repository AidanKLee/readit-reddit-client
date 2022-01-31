import redditLogo from '../assets/redditLogo.svg';

export class redditAPI {
    constructor() {
        this.time = 0;
        this.authorize = {
            endpoint: 'https://www.reddit.com/api/v1/authorize.compact?',
            clientId: 'mqrFLNz5F4vxkIXPhNrqsg',
            clientSecret: '6492zUIQrshhKresh1k-pKiUCWzkbA',
            responseType: 'code',
            state: this.generateState(),
            redirectUri: 'http://localhost:3000/callback',
            duration: 'permanent',
            scope: 'account creddits edit flair history identity livemanage modconfig modcontributors modflair modlog modmail modothers modposts modself modwiki mysubreddits privatemessages read report save structuredstyles submit subscribe vote wikiedit wikiread',
            grantType: 'authorization_code',
            access: {},
            error: {
                isError: false,
                errorType: '',
            },
        };

        this.corsAnywhere = 'https://cors-anywhere.herokuapp.com/';
        this.fullAuthorizeEndpoint = `${this.authorize.endpoint}client_id=${this.authorize.clientId}&response_type=${this.authorize.responseType}&state=${this.authorize.state}&redirect_uri=${this.authorize.redirectUri}&duration=${this.authorize.duration}&scope=${this.authorize.scope}`;

    }

    generateState = () => {
        const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let state  = '';
        for (let i = 0; i < 16; i++) {
            const rand = Math.floor(Math.random() * characters.length);
            state += characters.charAt(rand);
        }
        return state;
    }

    handleLogin = () => {
        window.location.href = this.fullAuthorizeEndpoint;
    }

    handleCallback = window.onload = () => {
        //declare full url and query string
        const url = window.location.href
        const queryString = window.location.search
        //if the url contains a querystring and 'callback'
        if (queryString && url.includes('callback')) {
            // and if the url contains an error create new error and set error to true
            if (url.includes('error=access_denied')) {
                const err = new Error('You denied us access to your account.');
                this.authorize.error.isError = true;
                this.authorize.error.errorType = err;
                return console.log(err)
            } else if (url.includes('error')) {
                const err = new Error('There was a problem when authorizing your account.');
                this.authorize.error.isError = true;
                this.authorize.error.errorType = err;
                return console.log(err)
            }
            //if there is no error (and if submitted state is the same)
            if (!this.authorize.error.isError) {
                const searchParams = new URLSearchParams(queryString)
                const { code, state } = Object.fromEntries(searchParams.entries());
                console.log(state)
                window.history.replaceState(null, "Readit", window.location.origin);
                return code;
            }
        }
    }

    fetchToken = async (code) => {
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${btoa(this.authorize.clientId + ':' + this.authorize.clientSecret)}`
        }
        const body = `grant_type=${this.authorize.grantType}&code=${code}&redirect_uri=${this.authorize.redirectUri}`;
        const data = await fetch('https://www.reddit.com/api/v1/access_token', {
            method: 'POST',
            headers: headers,
            body: body
        });
        const jsonData = await data.json();

        if (Object.keys(jsonData).includes('error')) {
            const { error } = jsonData;
            this.authorize.error.isError = true;
            this.authorize.error.errorType = error;
            return console.log(error)
        };

        const accessToken = {
            accessToken: jsonData.access_token,
            expiresAt: jsonData.expires_in + new Date().getTime(),
            tokenType: jsonData.token_type,
            refreshToken: jsonData.refresh_token
        }

        this.authorize.access.token = jsonData.access_token;
        this.authorize.access.expiresAt = jsonData.expires_in + new Date().getTime();
        this.authorize.access.tokenType = jsonData.token_type;
        this.authorize.access.refreshToken = jsonData.refresh_token;

        return accessToken;
    }

    startTimer = () => {
        this.time = new Date().getTime()
        const timer = setInterval(() => {
            this.time += 1;
            if (this.authorize.access.expiresAt === this.time) {
                const refreshToken = this.authorize.access.refreshToken;
                clearInterval(timer)
                this.authorize.access = {};
                this.refreshAccessToken(refreshToken);
            }
        }, 1000)
    }

    refreshAccessToken = async (refreshToken) => {
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${btoa(this.authorize.clientId + ':' + this.authorize.clientSecret)}`
        }
        const body = `grant_type=refresh_token&refresh_token=${refreshToken}`;
        const data = await fetch('https://www.reddit.com/api/v1/access_token', {
            method: 'POST',
            headers: headers,
            body: body
        });
        const jsonData = await data.json();

        if (Object.keys(jsonData).includes('error')) {
            const { error } = jsonData;
            this.authorize.error.isError = true;
            this.authorize.error.errorType = error;
            return console.log(error)
        };

        const accessToken = {
            accessToken: jsonData.access_token,
            expiresAt: jsonData.expires_in + new Date().getTime(),
            tokenType: jsonData.token_type,
            refreshToken: jsonData.refresh_token
        }

        this.authorize.access.token = jsonData.access_token;
        this.authorize.access.expiresAt = jsonData.expires_in + new Date().getTime();
        this.authorize.access.tokenType = jsonData.token_type;
        this.authorize.access.refreshToken = jsonData.refresh_token;


        return accessToken;
        // this.fetchUser();

        // this.startTimer();
    }

    fetchUser = async () => {
        const data = await fetch('https://oauth.reddit.com/api/v1/me', {
            headers: {
                "Authorization": "Bearer " + this.authorize.access.token,
            }
        });
        const jsonData = await data.json();

        return jsonData;
    }

    fetchAccountDetails = async (account) => {
        const data = await fetch(`https://oauth.reddit.com/r/${account}/about/edit`, {
            headers: {
                "Authorization": "Bearer " + this.authorize.access.token,
            }
        });
        const jsonData = await data.json();
        return jsonData;
    }

    changeAccountDetails = async (account) => {
        let body = '';
        for (const param in account) {
            body = body + `&${param}=${account[param]}`
        }
        body = body.slice(1);
        const data = await fetch(`https://oauth.reddit.com/api/site_admin?raw_json=1&gilding_detail=1`, {
            method: 'POST',
            headers: {
                "Authorization": "Bearer " + this.authorize.access.token,
                "Content-type":  'application/x-www-form-urlencoded',
            },
            body: body,
            completed: true
        });
        const jsonData = await data.json();
        return jsonData;
    }

    changeSubredditDetails = async (account) => {
        let body = JSON.stringify(account);
        const data = await fetch(`https://oauth.reddit.com/api/v1/subreddit/update_settings?redditWebClient=desktop2x&app=desktop2x-client-production&raw_json=1&gilding_detail=1`, {
            method: 'PATCH',
            headers: {
                "Authorization": "Bearer " + this.authorize.access.token,
                "Content-type": "application/json; charset=UTF-8"
            },
            body: body,
            completed: true
        });
        const jsonData = await data.json();
        return jsonData;
    }

    fetchCommunities = async () => {
        const data = await fetch('https://oauth.reddit.com/subreddits/mine/subscriber?limit=1000', {
            headers: {
                "Authorization": "Bearer " + this.authorize.access.token,
            }
        });
        const jsonData = await data.json();

        return jsonData;
    }

    // other search parameters - sort = relevance / hot / top / new comments (most comments) : time - t = all / year / month / week / day / hour

    fetchSearch = async (search, limit = 5, sort = 'relevance', time = 'all', type = '', over18 = false, after = null) => {
        const endpoint = `https://www.reddit.com/search.json?q=${search}&exact=false&include_over_18=${over18}&include_unadvertisable=false&limit=${limit}&after=${after}&sort=${sort}&t=${time}&type=${type}`;

        const data = await fetch(endpoint);
        const jsonData = await data.json();

        return jsonData;
    }

    fetchSubredditSearch = async (search, limit = 5, after = null, over18 = false, sort = 'relevance', time = 'all') => {
        const endpoint = `https://www.reddit.com/subreddits/search.json?q=${search}&exact=false&include_over_18=${over18}&include_unadvertisable=false&limit=${limit}&after${after}&sort=${sort}&t=${time}`

        const data = await fetch(endpoint);
        const jsonData = await data.json();

        return jsonData;
    }

    fetchUsersSearch = async (search, limit = 5, after = null, over18 = false, sort = 'relevance', time = 'all') => {
        const endpoint = `https://www.reddit.com/users/search.json?q=${search}&exact=false&include_over_18=${over18}&include_unadvertisable=false&limit=${limit}&after${after}&sort=${sort}&t=${time}`

        const data = await fetch(endpoint);
        const jsonData = await data.json();

        return jsonData;
    }

    fetchContent = async (limit = 25, url = 'best', after = null, before = null) => {
        url = url.split('/');
        if (url[url.length - 1] === url[url.length - 2]) {
            url = url.slice(0, url.length - 1)
        }
        url = url.join('/');
        if (url.includes('//')) {
            url = url.replace('//', '/');
        }
        let endpoint = `https://www.reddit.com/${url}.json?limit=${limit}`;
        if (url.includes('user/')) {
            url = url.split('/');
            endpoint = `https://www.reddit.com/${`${url[0]}/${url[1]}/${url[2]}/`}.json?sort=${url[3]}&limit=${limit}`

        }
        const beforeAfter = `&before=${before}&after=${after}`;

        const data = await fetch(`${endpoint}${beforeAfter}`);
        const jsonData = await data.json();

        return jsonData;
    }

    fetchUserHome = async (limit = 25, url = 'best', after = null, before = null) => {
        let endpoint = `https://oauth.reddit.com/${url}.json?limit=${limit}`;
        const beforeAfter = `&before=${before}&after=${after}`;

        const data = await fetch(`${endpoint}${beforeAfter}`, {
            headers: {
                "Authorization": "Bearer " + this.authorize.access.token,
            }
        });

        const jsonData = await data.json();

        return jsonData;
    }

    fetchComment = async (link) => {
        link = link.slice(0, link.length - 1)
        const endpoint = `https://www.reddit.com${link}.json`;

        const data = await fetch(endpoint);
        const jsonData = await data.json();

        return jsonData;
    }

    fetchSubreddit = async (link) => {
        let endpoint = `https://www.reddit.com/${link}/about.json`;

        const data = await fetch(endpoint);
        const jsonData = await data.json();

        return jsonData;
    }

    fetchModeratorOf = async (link) => {
        const endpoint = `https://www.reddit.com${link}moderated_subreddits.json`;

        const data = await fetch(endpoint);
        const jsonData = await data.json();

        return jsonData;
    }

    fetchAccountSettings = async () => {
        const data = await fetch('https://oauth.reddit.com/api/v1/me/prefs', {
            headers: {
                "Authorization": "Bearer " + this.authorize.access.token,
            }
        });
        const jsonData = await data.json();

        return jsonData;
    }

    patchAccountSettings = async (setting) => {
        const updatedSetting = JSON.stringify(setting);
        const data = await fetch('https://oauth.reddit.com/api/v1/me/prefs', {
            method: 'PATCH',
            headers: {
                "Authorization": "Bearer " + this.authorize.access.token,
                "Content-type": "application/json; charset=UTF-8"
            },
            body: updatedSetting,
            completed: true
        });
        const jsonData = await data.json();

        return jsonData;
    }

    fetchVotes = async (name) => {
        const upVotes = await fetch(`https://oauth.reddit.com/user/${name}/upvoted`, {
            headers: {
                "Authorization": "Bearer " + this.authorize.access.token,
            }
        });
        const jsonUp = await upVotes.json();
        const downVotes = await fetch(`https://oauth.reddit.com/user/${name}/downvoted`, {
            headers: {
                "Authorization": "Bearer " + this.authorize.access.token,
            }
        });
        const jsonDown = await downVotes.json();
        
        const data = {
            upVotes: jsonUp,
            downVotes: jsonDown
        }
        return data;
    }

    placeVote = async (dir, name) => {
        const data = await fetch(`https://oauth.reddit.com/api/vote`, {
            method: 'POST',
            headers: {
                "Authorization": "Bearer " + this.authorize.access.token,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `id=${name}&dir=${dir}&api_type=json`
        })
        const jsonData = await data.json();
        return jsonData;
    }

    submitNewPost = async (params) => {
        const { api_type, kind, nsfw, original_content, sendreplies, spoiler, sr, submit_type, text, title, url, validate_on_submit } = params
        const data = await fetch(`https://oauth.reddit.com/api/submit?api_type=${api_type}&kind=${kind}&nsfw=${nsfw}&original_content=${original_content}&sendreplies=${sendreplies}&spoiler=${spoiler}&sr=${sr}&submit_type=${submit_type}&text=${text}&title=${title}&url=${url}&validate_on_submit=${validate_on_submit}`, {
            method: 'POST',
            headers: {
                "Authorization": "Bearer " + this.authorize.access.token,
                'Content-Type': 'application/json'
            }
        })
        const jsonData = await data.json();
        return jsonData
    }

    submitNewComment = async (params) => {
        const { text, thing_id } = params;
        const data = await fetch(`https://oauth.reddit.com/api/comment?api_type=json&return_rtjson=true&text=${text}&thing_id=${thing_id}`, {
            method: 'POST',
            headers: {
                "Authorization": "Bearer " + this.authorize.access.token,
                'Content-Type': 'application/json'
            }
        })
        const jsonData = await data.json();
        return jsonData;
    }

    delete = async (fullname) => {
        const data = await fetch(`https://oauth.reddit.com/api/del?id=${fullname}`, {
            method: 'POST',
            headers: {
                "Authorization": "Bearer " + this.authorize.access.token,
                'Content-Type': 'application/json'
            }
        })
        const jsonData = await data.json();
        console.log(jsonData);
    }

    setSubscriptionStatus = async (params) => {
        const {action, sr} = params
        const data = await fetch(`https://oauth.reddit.com/api/subscribe?action=${action}&sr=${sr}`, {
            method: 'POST',
            headers: {
                "Authorization": "Bearer " + this.authorize.access.token,
                'Content-Type': 'application/json'
            }
        })
        const jsonData = await data.json();
        console.log(jsonData)
    }

    fetchInbox = async (after, count = 0, limit = 50) => {
        const params = `?count=${count}&limit=${limit}&mark=false${after ? '&after=' + after : ''}&show=all`
        let inbox = await fetch(`https://oauth.reddit.com/message/inbox${params}`, {
            headers: {
                "Authorization": "Bearer " + this.authorize.access.token,
            }
        })
        inbox = await inbox.json();

        return inbox;
    }

    fetchUnread = async (after, count = 0, limit = 50) => {
        const params = `?count=${count}&limit=${limit}&mark=false${after ? '&after=' + after : ''}&show=all`
        let unread = await fetch(`https://oauth.reddit.com/message/unread${params}`, {
            headers: {
                "Authorization": "Bearer " + this.authorize.access.token,
            }
        })
        unread = await unread.json();

        return unread;
    }

    fetchSent = async (after, count = 0, limit = 50) => {
        const params = `?count=${count}&limit=${limit}&mark=false${after ? '&after=' + after : ''}&show=all`
        let sent = await fetch(`https://oauth.reddit.com/message/sent${params}`, {
            headers: {
                "Authorization": "Bearer " + this.authorize.access.token,
            }
        })
        sent = await sent.json();

        return sent;
    }

    fetchMessageReplies = async (id) => {
        let replies = await fetch(`https://oauth.reddit.com/message/messages/${id}.json`, {
            headers: {
                "Authorization": "Bearer " + this.authorize.access.token,
            }
        })
        replies = await replies.json();

        return replies;
    }

    deleteMessage = async (fullname) => {
        let deleted = await fetch(`https://oauth.reddit.com/api/del_msg?id=${fullname}`, {
            method: 'POST',
            headers: {
                "Authorization": "Bearer " + this.authorize.access.token,
            }
        })
        deleted = await deleted.json()

        return deleted;
    }

    markAllRead = async () => {
        let read = await fetch(`https://oauth.reddit.com/api/read_all_messages`, {
            method: 'POST',
            headers: {
                "Authorization": "Bearer " + this.authorize.access.token,
            }
        })

        console.log(read)
        read = await read.json()

        console.log(read)

        return read;
    }

    markUnread = async (unread, fullnames) => {
        unread ? unread = 'unread_message' : unread = 'read_message'
        fullnames = fullnames.join(',')
        let read = await fetch(`https://oauth.reddit.com/api/${unread}?id=${fullnames}`, {
            method: 'POST',
            headers: {
                "Authorization": "Bearer " + this.authorize.access.token,
            }
        })
        read = await read.json()

        return read;
    }

    composeMessage = async (params) => {
        let { from_sr, subject, text, to } = params;
        params = {
            api_type: 'json',
            from_sr: from_sr,
            subject: subject,
            text: text,
            to: to
        }
        if (!params.from_sr) {
            delete params.from_sr;
        }
        console.log(params)
        // params = JSON.stringify(params)
        let queryString = '';
        for (let key in params) {
            console.log(key, params[key])
            queryString = queryString + `&${key}=${params[key]}`
        }
        queryString = queryString.slice(1)
        console.log(queryString)
        let compose = await fetch(`https://oauth.reddit.com/api/compose`, {
            method: 'POST',
            headers: {
                "Authorization": "Bearer " + this.authorize.access.token,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: queryString
        })
        compose = await compose.json()

        return compose;
    }

    getIconImg = (community, style) => {
        if (community && community.data) {
            community = community.data;
        }
        if (community) { 
            if (community.icon_img) {
                if (community.icon_img.includes('?')) {
                    return <img style={style ? style : {}} src={community.icon_img.split('?')[0]} alt={community.display_name}/>
                }
                return <img style={style ? style : {}} src={community.icon_img} alt={community.display_name}/>
            } else if (community.community_icon) {
                let url = community.community_icon.split('?')[0]
                return <img style={style ? style : {}} src={url} alt={community.display_name}/>
            } else {
                return <img style={style ? style : {}} src={redditLogo} alt={community.display_name}/>
            }
        }

    }

    // getIconImg = (community) => {
    //     if (community && !community.data) {
    //         if (community) {
    //             if (community.icon_img) {
    //                 if (community.icon_img.includes('?')) {
    //                     return <img src={community.icon_img.split('?')[0]} alt={community.display_name}/>
    //                 }
    //                 return <img src={community.icon_img} alt={community.display_name}/>
    //             } else if (community.community_icon) {
    //                 let url = community.community_icon.split('?')[0]
    //                 return <img src={url} alt={community.display_name}/>
    //             } else {
    //                 return <img src={redditLogo} alt={community.display_name}/>
    //             }
    //         } 
    //     } else if (community && community.data) {
    //         if (community.data.icon_img) {
    //             return <img src={community.data.icon_img} alt={community.data.display_name}/>
    //         } else if (community.data.community_icon) {
    //             let url = community.data.community_icon.split('?')[0]
    //             return <img src={url} alt={community.data.display_name}/>
    //         } else {
    //             return <img src={redditLogo} alt={community.data.display_name}/>
    //         }
    //     } 
    // }
}

const reddit = new redditAPI();

export default reddit;