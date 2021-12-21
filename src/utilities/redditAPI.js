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
                window.history.pushState("Token Recieved", "Reddit Client", reddit.authorize.redirectUri);
                console.log(state, code)
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

        // console.log(jsonData)
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

    startTimer = () => {
        this.time = new Date().getTime()
        const timer = setInterval(() => {
            this.time += 1;
            // console.log(this.time)
            // console.log(this.authorize.access.expiresAt)
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

        // console.log(jsonData)
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
        // this.me = jsonData;
    }

}

const reddit = new redditAPI();

export default reddit;