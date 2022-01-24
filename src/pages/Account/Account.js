import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Communities from '../../components/Communities/Communities';
import { selectLogin } from '../../components/LogIn/loginSlice';
import { getTimePosted } from '../../utilities/functions';
import { returnToTop } from '../../utilities/functions';
import reddit from '../../utilities/redditAPI';
import './account.css';

const Account = () => {
    // 
    const login = useSelector(selectLogin);

    const [ account, setAccount ] = useState({});
    const [ communitiesOpen, setCommunitiesOpen ] = useState(true);
    const [ firstLoad, setFirstLoad ] = useState(false);

    useEffect(() => {
        if (login.initialLoginAttempt && !login.isLoading) {
            const fetchAccount = async () => {
                const account = await reddit.fetchAccountDetails(login.authorization.user.subreddit.display_name);
                setAccount(account.data);
            }
            fetchAccount();
        }
    },[login])

    useEffect(() => {
        if (!firstLoad && account.wikimode) {
            setFirstLoad(!firstLoad)
        }
        if (firstLoad) {
            const timeout = setTimeout(() => {
                submitNewAbout();
            },1000)

            return () => clearTimeout(timeout);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[account])

    const submitNewAbout = async () => {
        const newAccount = {
            ...account,
            admin_override_spam_comments: true,
            admin_override_spam_links: true,
            admin_override_spam_selfposts: true,
            allow_top: true,
            api_type: 'json',
            'g-recaptcha-response': '',
            'header-title': '',
            link_type: 'any',
            name: login.authorization.user.subreddit.display_name,
            sr: login.authorization.user.subreddit.name,
            type: 'user'
        }
        delete newAccount.default_set;
        delete newAccount.domain;
        delete newAccount.header_hover_text;
        delete newAccount.subreddit_id;
        delete newAccount.subreddit_type

        await reddit.changeAccountDetails(newAccount);
    }

    const handleChange = (e) => {
        const name = e.target.name;
        let value = e.target.value;
        const toggle = value === 'on';
        if (!toggle) {
            setAccount({
                ...account,
                [name]: value
            })
        } else if (toggle) {
            value = e.target.checked
            setAccount({
                ...account,
                [name]: value
            })
        }
    }

    const handleOpenClick = (e) => {
        // const name = e.target.id;
        setCommunitiesOpen(!communitiesOpen)
    }

    return (
        <div className='account'>
            <div className='accountLeft'>
                <UserDetails account={account}/>
                <div className='accountCommunitiesWrapper'>
                    <div className='accountHeader'>
                        <p>Communities</p>
                        <svg id={'accountCommunities'} onClick={handleOpenClick} xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 13H5v-2h14v2z"/></svg>
                    </div>
                    {communitiesOpen ? <Communities hasButtons={true}/> : undefined}
                </div>
            </div>
            
            <div className='accountAboutWrapper'>
                <div className='accountHeader'>
                    <p>Account</p>
                </div>
                <AccountAbout handleChange={handleChange} account={account}/>
            </div>                       
        </div>
    )
}

const UserDetails = (props) => {

    const { account } = props;

    const login = useSelector(selectLogin);

    return (
        <div className='userDetails'>
            <div className='userDetailsBanner'>
                {login.authorization && login.authorization.user.subreddit.banner_img ? <img src={login.authorization.user.subreddit.banner_img.includes('?') ? login.authorization.user.subreddit.banner_img.split('?')[0] : login.authorization.user.subreddit.banner_img} alt={'Banner'}/> : undefined}
            </div>
            <div className='userDetailsIcon'>
                <div className='userDetailsIconBorder'>
                    {login && login.authorization && login.authorization.user.snoovatar_img ? <img src={login.authorization.user.snoovatar_img} alt={'My Snoovatar'}/> : reddit.getIconImg(login.authorization ? login.authorization.user : undefined)}
                </div> 
                <Link onClick={(e) => returnToTop(e)} to={'/settings'}><svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19.43 12.98c.04-.32.07-.64.07-.98 0-.34-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.09-.16-.26-.25-.44-.25-.06 0-.12.01-.17.03l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.06-.02-.12-.03-.18-.03-.17 0-.34.09-.43.25l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98 0 .33.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.09.16.26.25.44.25.06 0 .12-.01.17-.03l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.06.02.12.03.18.03.17 0 .34-.09.43-.25l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zm-1.98-1.71c.04.31.05.52.05.73 0 .21-.02.43-.05.73l-.14 1.13.89.7 1.08.84-.7 1.21-1.27-.51-1.04-.42-.9.68c-.43.32-.84.56-1.25.73l-1.06.43-.16 1.13-.2 1.35h-1.4l-.19-1.35-.16-1.13-1.06-.43c-.43-.18-.83-.41-1.23-.71l-.91-.7-1.06.43-1.27.51-.7-1.21 1.08-.84.89-.7-.14-1.13c-.03-.31-.05-.54-.05-.74s.02-.43.05-.73l.14-1.13-.89-.7-1.08-.84.7-1.21 1.27.51 1.04.42.9-.68c.43-.32.84-.56 1.25-.73l1.06-.43.16-1.13.2-1.35h1.39l.19 1.35.16 1.13 1.06.43c.43.18.83.41 1.23.71l.91.7 1.06-.43 1.27-.51.7 1.21-1.07.85-.89.7.14 1.13zM12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/></svg></Link>
            </div>
                {account && account.over_18 ? <p className='userDetailsNsfw'>NSFW</p> : undefined}
            <div className='userDetailsText'>
                <p>
                    {login.authorization ? login.authorization.user.name : undefined}
                </p>
                <p>
                    {login.authorization ? login.authorization.user.subreddit.display_name_prefixed : undefined}
                </p>
                <p>
                    {login.authorization ? 'Joined ' + getTimePosted(login.authorization.user.created) : undefined}
                </p>
                <p>
                    {login.authorization ? `You have ${login.authorization.user.link_karma} karma` : undefined}
                </p>
                <div className="userDetailsCoins" data-test='userListItem'>
                    <svg data-test='userListSvg' xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M15 4c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zM3 12c0-2.61 1.67-4.83 4-5.65V4.26C3.55 5.15 1 8.27 1 12s2.55 6.85 6 7.74v-2.09c-2.33-.82-4-3.04-4-5.65z"/></svg>
                    You Have{login.authorization ? ` ${login.authorization.user.coins} ` : ` 0 `} Coins
                </div>
            </div>         
        </div>
    )
}

const AccountAbout = (props) => {

    const { account, handleChange } = props;

    return (
        <div className='accountAbout'>
            <div className='accountAboutItem'>
            <label htmlFor='title'>
                <p className='accountAboutSubheading'>
                    Display Name
                </p>
                <p className='accountAboutDesc'>
                    Set a display name. This does not change your username. (Optional)
                </p>
            </label>
                <input onChange={handleChange} id='title' name='title' placeholder='Your Display Name... (Optional)' defaultValue={account? account.title : undefined} maxLength={30}/>
                <p className='accountAboutDesc'>
                    {account.title ? 30 - account.title.length : 30} characters remaining.
                </p>
            </div>
            <div className='accountAboutItem'>
                <label htmlFor='public_description'>
                    <p className='accountAboutSubheading'>
                        About
                    </p>
                    <p className='accountAboutDesc'>
                        A brief description of yourself shown on your profile. Appears in search results and social media links. (Optional)
                    </p>
                </label>
                <textarea onChange={handleChange} id='public_description' name='public_description' maxLength={500} placeholder='About You... (Optional)' defaultValue={account? account.public_description : undefined}></textarea>
                <p className='accountAboutDesc'>
                    {account.public_description ? 500 - account.public_description.length : 500} characters remaining.
                </p>
            </div>
            {/* <div className='accountAboutItem'>
                <label htmlFor='description'>
                    <p className='accountAboutSubheading'>
                        Description
                    </p>
                    <p className='accountAboutDesc'>
                        An extended description of yourself. (Optional)
                    </p>
                </label>
                <textarea onChange={handleChange} id='description' name='description' maxLength={10240} placeholder='Description... (Optional)' defaultValue={account.description}></textarea>
                <p className='accountAboutDesc'>
                    {account.description ? 10240 - account.description.length : 10240} characters remaining.
                </p>
            </div> */}
            <div className='accountAboutItemToggle'>
                <label htmlFor='over_18'>
                    <p className='accountAboutSubheading'>
                        NSFW Profile
                    </p>
                    <p className='accountAboutDesc'>
                        The content on your profile is NSFW (may contain nudity, pornography, profanity or inappropriate content for those under 18)
                    </p>
                </label>
                <label className="switch">
                    <input onClick={handleChange} type='checkbox' name='over_18' id='over_18' defaultChecked={account.over_18}/>
                    <span className="slider"></span>
                </label>
            </div>
            <div className='accountAboutItemToggle'>
                <label htmlFor='allow_discovery'>
                    <p className='accountAboutSubheading'>
                        Allow Discovery
                    </p>
                    <p className='accountAboutDesc'>
                        Show up in high-traffic feeds: Allow your community to be in r/all, r/popular, and trending lists where it can be seen by the general Reddit population.
                    </p>
                </label>
                <label className="switch">
                    <input onClick={handleChange} type='checkbox' name='allow_discovery' id='allow_discovery' defaultChecked={account.allow_discovery}/>
                    <span className="slider"></span>
                </label>
            </div>
            <div className='accountAboutItemToggle'>
                <label htmlFor='allow_galleries'>
                    <p className='accountAboutSubheading'>
                        Allow Galleries
                    </p>
                    <p className='accountAboutDesc'>
                        Allow people to post multiple images per post.
                    </p>
                </label>
                <label className="switch">
                    <input onClick={handleChange} type='checkbox' name='allow_galleries' id='allow_galleries' defaultChecked={account.allow_galleries}/>
                    <span className="slider"></span>
                </label>
            </div>
            <div className='accountAboutItemToggle'>
                <label htmlFor='allow__images'>
                    <p className='accountAboutSubheading'>
                        Allow Images
                    </p>
                    <p className='accountAboutDesc'>
                        Allow image uploads and links to image hosting sites.
                    </p>
                </label>
                <label className="switch">
                    <input onClick={handleChange} type='checkbox' name='allow_images' id='allow_images' defaultChecked={account.allow_images}/>
                    <span className="slider"></span>
                </label>
            </div>
            <div className='accountAboutItemToggle'>
                <label htmlFor='allow_polls'>
                    <p className='accountAboutSubheading'>
                        Allow Polls
                    </p>
                    <p className='accountAboutDesc'>
                        Allow poll posts.
                    </p>
                </label>
                <label className="switch">
                    <input onClick={handleChange} type='checkbox' name='allow_polls' id='allow_polls' defaultChecked={account.allow_polls}/>
                    <span className="slider"></span>
                </label>
            </div>
            <div className='accountAboutItemToggle'>
                <label htmlFor='allow_videos'>
                    <p className='accountAboutSubheading'>
                        Allow Videos
                    </p>
                    <p className='accountAboutDesc'>
                        Allow video uploads and links to be posted.
                    </p>
                </label>
                <label className="switch">
                    <input onClick={handleChange} type='checkbox' name='allow_videos' id='allow_videos' defaultChecked={account.allow_videos}/>
                    <span className="slider"></span>
                </label>
            </div>
        </div>
    )
}

export default Account;