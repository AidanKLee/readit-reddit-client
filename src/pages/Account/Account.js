import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import Communities from '../../components/Communities/Communities';
import { selectLogin, setUpdate, toggleImageUpload } from '../../components/LogIn/loginSlice';
import { getTimePosted } from '../../utilities/functions';
import { returnToTop } from '../../utilities/functions';
import reddit from '../../utilities/redditAPI';
import './account.css';

const Account = () => {
    
    const dispatch = useDispatch();

    const login = useSelector(selectLogin);
    const update = useMemo(() => login.update,[login]);

    const [ account, setAccount ] = useState({});
    const [ communitiesOpen, setCommunitiesOpen ] = useState(true);
    const [ firstLoad, setFirstLoad ] = useState(false);
    const [ moderated, setModerated ] = useState(false);
    const [ updated, setUpdated ] = useState(false);
    const [ change, setChange ] = useState(false);
    const [ mountDetails, setMountDetails ] = useState(false);

    const fetchAccount = async () => {
        const account = await reddit.fetchAccountDetails(login.authorization.user.subreddit.display_name);
        setAccount(account.data);
    }

    useEffect(() => {
        if (login.initialLoginAttempt && !login.isLoading) {
            fetchAccount();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[login])

    useEffect(() => {
        if (update) {
            fetchAccount();
            dispatch(setUpdate());
            setUpdated(true)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[update])

    useEffect(() => {
        if (login.authorization && account && !mountDetails) {
            setMountDetails(true)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[account])


    useEffect(() => {
        if (updated) {
            const timer = setTimeout(() => {
                setUpdated(false)
            },[3000])
            return () => clearTimeout(timer)
        }
    },[updated])

    useEffect(() => {
        if (!firstLoad && account.wikimode) {
            setFirstLoad(!firstLoad)
        }
        if (firstLoad && change) {
            setChange(false);
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

        await reddit.changeAccountDetails(newAccount).then(() => dispatch(setUpdate()));
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
        setChange(true)
    }

    const handleOpenClick = (e) => {
        // const name = e.target.id;
        setCommunitiesOpen(!communitiesOpen)
    }

    return (
        <div className='account'>
            <div className='accountLeft'>
                <CSSTransition in={mountDetails} timeout={300} classNames='tran5' mountOnEnter={true} unmountOnExit={true}>
                    <UserDetails account={account}/>
                </CSSTransition>
                <CSSTransition in={mountDetails} timeout={300} classNames='tran5' mountOnEnter={true} unmountOnExit={true}>
                <div className='accountCommunitiesWrapper'>
                    <div className='accountHeader'>
                        <div className='accountCommunitiesLeft'>
                            <div className='accountCommunitiesLeftLeft'>
                                {moderated ? <p style={{fontWeight: 'normal', fontSize: '.6rem'}}>Moderated</p> : undefined}
                                <p>Communities</p>
                            </div>
                            
                            <p onClick={() => setModerated(!moderated)} className='accountModerated' style={moderated ? {color: 'var(--prim1)', border: '2px solid var(--prim1)'} : {}}>
                                M
                            </p>
                        </div>
                        
                        <svg id={'accountCommunities'} onClick={handleOpenClick} xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 13H5v-2h14v2z"/></svg>
                    </div>
                    {communitiesOpen ? <Communities moderated={moderated} hasButtons={true}/> : undefined}
                </div>
                </CSSTransition>
            </div>
            <CSSTransition in={mountDetails} timeout={300} classNames='tran5' mountOnEnter={true} unmountOnExit={true}>
                <div className='accountAboutWrapper'>
                    <div className='accountHeader'>
                        <p>Account</p>
                    </div>
                    <AccountAbout handleChange={handleChange} account={account}/>
                </div>
            </CSSTransition>
            <div className='updateWarning' style={updated ? {bottom: '32px', opacity: 1} : {}}>
                <svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24"><g><rect fill="none" height="24" width="24"/></g><g><g><path d="M11,8v5l4.25,2.52l0.77-1.28l-3.52-2.09V8H11z M21,10V3l-2.64,2.64C16.74,4.01,14.49,3,12,3c-4.97,0-9,4.03-9,9 s4.03,9,9,9s9-4.03,9-9h-2c0,3.86-3.14,7-7,7s-7-3.14-7-7s3.14-7,7-7c1.93,0,3.68,0.79,4.95,2.05L14,10H21z"/></g></g></svg>
                <p>Changes Saved</p>
            </div>                     
        </div>
    )
}

const UserDetails = (props) => {

    const dispatch = useDispatch();

    const { account } = props;

    const login = useSelector(selectLogin);

    const toggleUpload = (upload_type) => {
        dispatch(toggleImageUpload({upload_type: upload_type, subreddit: login.authorization.user.subreddit.display_name}))
    }

    return (
        <div className='userDetails'>
            <div className='userDetailsBanner'>
                {login.authorization && login.authorization.user.subreddit.banner_img ? <img src={login.authorization.user.subreddit.banner_img.includes('?') ? login.authorization.user.subreddit.banner_img.split('?')[0] : login.authorization.user.subreddit.banner_img} alt={'Banner'}/> : undefined}
                {login.authorization ? <svg className='iconUpload' onClick={() => toggleUpload('banner')} xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M14.12 4l1.83 2H20v12H4V6h4.05l1.83-2h4.24M15 2H9L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2zm-3 7c1.65 0 3 1.35 3 3s-1.35 3-3 3-3-1.35-3-3 1.35-3 3-3m0-2c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z"/></svg> : undefined}
            </div>
            <div className='userDetailsIcon'>
                <div className='userDetailsIconBorder'>
                    {login && login.authorization && login.authorization.user.snoovatar_img ? <img src={login.authorization.user.snoovatar_img} alt={'My Snoovatar'}/> : reddit.getIconImg(login.authorization ? login.authorization.user : undefined)}
                </div>
                {login.authorization ? <svg className='iconUpload' onClick={() => toggleUpload('icon')} xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M14.12 4l1.83 2H20v12H4V6h4.05l1.83-2h4.24M15 2H9L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2zm-3 7c1.65 0 3 1.35 3 3s-1.35 3-3 3-3-1.35-3-3 1.35-3 3-3m0-2c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z"/></svg> : undefined}
                <Link onClick={(e) => returnToTop(e)} to={'/settings'}><svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19.43 12.98c.04-.32.07-.64.07-.98 0-.34-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.09-.16-.26-.25-.44-.25-.06 0-.12.01-.17.03l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.06-.02-.12-.03-.18-.03-.17 0-.34.09-.43.25l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98 0 .33.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.09.16.26.25.44.25.06 0 .12-.01.17-.03l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.06.02.12.03.18.03.17 0 .34-.09.43-.25l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zm-1.98-1.71c.04.31.05.52.05.73 0 .21-.02.43-.05.73l-.14 1.13.89.7 1.08.84-.7 1.21-1.27-.51-1.04-.42-.9.68c-.43.32-.84.56-1.25.73l-1.06.43-.16 1.13-.2 1.35h-1.4l-.19-1.35-.16-1.13-1.06-.43c-.43-.18-.83-.41-1.23-.71l-.91-.7-1.06.43-1.27.51-.7-1.21 1.08-.84.89-.7-.14-1.13c-.03-.31-.05-.54-.05-.74s.02-.43.05-.73l.14-1.13-.89-.7-1.08-.84.7-1.21 1.27.51 1.04.42.9-.68c.43-.32.84-.56 1.25-.73l1.06-.43.16-1.13.2-1.35h1.39l.19 1.35.16 1.13 1.06.43c.43.18.83.41 1.23.71l.91.7 1.06-.43 1.27-.51.7 1.21-1.07.85-.89.7.14 1.13zM12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/></svg></Link>
                <Link onClick={(e) => returnToTop(e)} to={'/messages/inbox'}><svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0l-8 4.99L4 6h16zm0 12H4V8l8 5 8-5v10z"/></svg></Link>
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
                <input onChange={handleChange} id='title' name='title' placeholder='Your Display Name... (Optional)' defaultValue={account ? account.title : undefined} maxLength={30}/>
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