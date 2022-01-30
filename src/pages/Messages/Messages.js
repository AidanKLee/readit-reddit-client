import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { selectLogin } from '../../components/LogIn/loginSlice';
import reddit from '../../utilities/redditAPI';
import MessageBody from './MessageBody';
import MessageCompose from './MessageCompose';
import loader from '../../assets/loader.svg';
import './messages.css';

const Messages = () => {

    const location = useLocation().pathname;
    const navigate = useNavigate();

    const login = useSelector(selectLogin)

    const [ inbox, setInbox ] = useState({});
    const [ unread, setUnread ] = useState({});
    const [ sent, setSent ] = useState({});
    const [ selected, setSelected ] = useState([]);
    const [ selecting, setSelecting ] = useState(false)
    const [ outletMessages, setOutletMessages ] = useState([]);
    const [ userImages, setUserImages ] = useState([]);
    const [ warning, setWarning ] = useState(false);
    const [ smallScreen, setSmallScreen ] = useState(false);
    const [ loadingMore, setLoadingMore ] = useState(false);
    const [ loading, setLoading ] = useState(true);
    const [ allLoaded, setAllLoaded ] = useState(false);
    const [ compose, setCompose ] = useState({
        open: false,
        minimized: false,
        expanded: false,
        from_sr: '',
        subject: '',
        text: '',
        to: ''
    });

    const composeOpen = useMemo(() => compose.open, [compose])
    const composeMinimized = useMemo(() => compose.minimized, [compose])

    const header = useMemo(() => {
        let header = location.split('/')[2];
        if (header === 'inbox' || header === 'unread' || header === 'sent') {
            header = header ? header.slice(0, 1).toUpperCase() + header.slice(1) : 'Inbox';
            return header;
        }
        return ''
    },[location])

    const currentMailbox = useMemo(() => {
        const mailbox =  header.toLowerCase();
        if (mailbox === 'inbox') { return [ inbox, setInbox ] }
        else if (mailbox === 'unread') { return [ unread, setUnread ] }
        else if (mailbox === 'sent') { return [ sent, setSent ] }
        else { return [] }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[inbox, unread, sent, header])

    const [ mailbox, setMailbox ] = currentMailbox;

    const messagesCopy = useMemo(() => mailbox && mailbox.data && mailbox.data.children.length > 0 ? [ ...mailbox.data.children ] : undefined, [mailbox]);

    const selectedNames = useMemo(() => selected.map((message, i) => {
        return message[0].data.name
    }),[selected])

    const after = useMemo(() => mailbox && mailbox.data && mailbox.data.children.length > 0 ? mailbox.data.children[mailbox.data.children.length-1].data.name : undefined,[mailbox])

    useEffect(() => {
        const getImages = async () => {
            setUserImages([])
            let images = await Promise.all(messagesCopy.map(async (message) => {
                let userData;
                let image;
                if (message.data && message.data.author) {
                    userData = await reddit.fetchSubreddit(`user/${message.data.author}`)
                    image = reddit.getIconImg(userData)
                } if (message.data && message.data.subreddit) {
                    userData = await reddit.fetchSubreddit(`r/${message.data.subreddit}`)
                    image = reddit.getIconImg(userData)
                }
                return image
            }))
            setUserImages(images)
        }
        if (messagesCopy) {
            getImages();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[messagesCopy])

    useEffect(() => {
        if (login.authorization && login.authorization.accessToken) {
            if (header.toLowerCase() === 'inbox') {getMessages(reddit.fetchInbox, setInbox)}
            else if (header.toLowerCase() === 'unread') {getMessages(reddit.fetchUnread, setUnread)}
            else if (header.toLowerCase() === 'sent') {getMessages(reddit.fetchSent, setSent)}
            else {
                navigate('/messages/inbox', {replace: true})
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[login, header])

    useEffect(() => {
        const changeView = (e) => {
            window.innerWidth < 881 ? setSmallScreen(true) : setSmallScreen(false)
        }
        changeView()
        window.addEventListener('resize', changeView)
        return () => window.removeEventListener('resize', changeView)
    },[])

    useEffect(() => {
        setLoading(true);
        if (allLoaded) {
            setAllLoaded(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[header])

    const getMessages = async (type, setter, after) => {
        const messages = await type(after ? after : undefined)
        if (!loadingMore) {
            setter(messages)
            setLoading(false)
        } else if (loadingMore) {
            setter({
                ...mailbox, data: {
                    ...mailbox.data, children: [
                        ...mailbox.data.children,
                        ...messages.data.children
                    ]
                }
            })
            setLoadingMore(false)
        } 
        if (messages.data.children.length < 50) {
            setAllLoaded(true)
        }
        
    }

    useEffect(() => {
            setOutletMessages({
                mailbox: [ mailbox, setMailbox ], 
                selected: [ selected, setSelected],
                selecting: [ selecting, setSelecting ],
                userImages: [ userImages, setUserImages], 
                markSelectedUnread: markSelectedUnread,
                handleLoadMore: handleLoadMore,
                loadingMore,
                allLoaded
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[location, mailbox, selected, userImages])

    useEffect(() => {
        if (!composeOpen || composeMinimized) {
            const selectAllMessages = (e) => {
                if (e.ctrlKey && e.keyCode === 65) {
                    e.preventDefault();
                    if (messagesCopy) {
                        const selectAll = messagesCopy.map((message, i) => [ message, i ])
                        setSelected(selectAll)
                    }
                }
            }
            window.addEventListener('keydown', selectAllMessages)
            return () => window.removeEventListener('keydown', selectAllMessages)
        }        
    },[messagesCopy, composeOpen, composeMinimized])

    useEffect(() => {
        if (selected.length === 0 && selecting) {
            setSelecting(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[selected])

    const handleWarning = () => {
        setWarning(!warning);
    }

    const deleteMessages = async () => {
        const deletedMessages = await Promise.all(selectedNames.map(async name => {
            const deleted = await reddit.deleteMessage(name)
            return deleted;
        }))
        const newMailbox = messagesCopy.filter((message, i) => {
            return !selectedNames.includes(message.data.name)
        })
        setMailbox({
            ...mailbox, data: {
                ...mailbox.data, children: newMailbox
            }
        })
        setSelected([])
        if (warning) {
            setWarning(false);
        }
        if (selecting) {
            setSelecting(false)
        }
        console.log(deletedMessages)
    }

    const markAllMessagesRead = async () => {
        const readMessages = await reddit.markAllRead().catch(e => console.log(e));
        console.log(readMessages)
        const newMailbox = messagesCopy.map(message => {
            return { ...message, data: { ...message.data, new: false} }
        })
        setMailbox({
            ...mailbox, data: {
                ...mailbox.data, children: newMailbox
            }
        })
    }

    const markSelectedUnread = async (unread) => {
        const messages = await reddit.markUnread(unread, selectedNames)
        console.log(messages)
        const newMailbox = messagesCopy.map((message, i) => {
            let isSelected = false;
            selected.forEach(selected => {
                if (selected[1] === i) {
                    isSelected = true
                }
            })
            if (isSelected) {
                return { ...message, data: { ...message.data, new: unread} }
            } else {
                return message;
            }
        })
        setMailbox({
            ...mailbox, data: {
                ...mailbox.data, children: newMailbox
            }
        })
        if (selecting) {
            setSelecting(false)
        }
    }

    const toggleCompose = () => {
        setCompose({
            open: !composeOpen,
            minimized: false,
            expanded: false,
            from_sr: '',
            subject: '',
            text: '',
            to: ''
        })
    }

    const handleSend = async () => {
        let params = { ...compose };
        delete params.open;
        delete params.minimized;
        delete params.expanded;
        if (params.from_sr === login.authorization.user.name) {
            params = { ...params, from_sr: ''}
        };
        const sentMessage = await reddit.composeMessage(params)
        console.log(sentMessage)
        toggleCompose();
    }

    const cancelSelecting = () => {
        if (selecting) {
            setSelected([])
            setSelecting(false)
        }
    }

    const handleLoadMore = (e) => {
        const tiles = document.querySelector('.messageTile')
        if (e.target.scrollTop + e.target.offsetHeight - 16 >= tiles.offsetHeight && !loadingMore && !allLoaded) {
            setLoadingMore(true)
        }
    }

    useEffect(() => {
        if (loadingMore) {
            if (header.toLowerCase() === 'inbox') {getMessages(reddit.fetchInbox, setInbox, after)}
            else if (header.toLowerCase() === 'unread') {getMessages(reddit.fetchUnread, setUnread, after)}
            else if (header.toLowerCase() === 'sent') {getMessages(reddit.fetchSent, setSent, after)}
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[loadingMore])

    const renderMessageReader = () => {
        if ((!smallScreen || selected.length === 1) && !selecting) {
            if (selected[0] && selected[0][0].data && selected.length === 1) {
                return <MessageBody markSelectedUnread={markSelectedUnread} smallScreen={smallScreen} handleWarning={handleWarning} deleteMessage={deleteMessages} userImages={[ userImages, setUserImages ]} selected={[ selected, setSelected ]}/>
            } else if (selected.length !== 1 ) {
                return (
                    <div className='messagesRight messagesSelectedMessage'>
                        {
                            selected.length === 0 ? 
                                <div className='messagesSelectedMessageText'>
                                    <p className='messagesSelectedMessageTitle'>You haven't selected a message yet.</p>
                                    <p>Ctrl + Click to select multiple messages.</p>
                                    <p>Shift + Click to select a group of messages</p>
                                    {!composeOpen || composeMinimized ? <p>Ctrl + A to select all messages.</p> : undefined}
                                </div> 
                                : 
                                <div className='messagesSelectedMessageText'>
                                    <p className='messagesSelectedMessageTitle'>Multiple messages selected...</p>
                                    <div className='messagesSelectedMessageActions'>
                                        <div className='delete' onClick={handleWarning}>
                                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z"/></svg>
                                        </div>
                                        <div onClick={() => markSelectedUnread(false)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24"><g><rect fill="none" height="24" width="24" x="0"/><path d="M22,8.98V18c0,1.1-0.9,2-2,2H4c-1.1,0-2-0.9-2-2L2.01,6C2.01,4.9,2.9,4,4,4h10.1C14.04,4.32,14,4.66,14,5s0.04,0.68,0.1,1 H4l8,5l3.67-2.29c0.47,0.43,1.02,0.76,1.63,0.98L12,13L4,8v10h16V9.9C20.74,9.75,21.42,9.42,22,8.98z M16,5c0,1.66,1.34,3,3,3 s3-1.34,3-3s-1.34-3-3-3S16,3.34,16,5z"/></g></svg>
                                        </div>
                                        <div onClick={() => markSelectedUnread(true)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M20 6H10v2h10v12H4V8h2v4h2V4h6V0H6v6H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z"/></svg>
                                        </div>
                                    </div>
                                </div>
                        }
                    </div>
                )
            }
        }
    }

    return (
        <div className='messages'>
            <div className='messagesMenu'>
                    <div onClick={toggleCompose} className='messagesMenuNew'>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
                        <p>Compose New Message</p>
                    </div>
                
                <ul className='messagesMenuList'>
                    <Link to='/messages/inbox'>
                        <li className='messagesMenuItem'>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5v-3h3.56c.69 1.19 1.97 2 3.45 2s2.75-.81 3.45-2H19v3zm0-5h-4.99c0 1.1-.9 2-2 2s-2-.9-2-2H5V5h14v9z"/></svg>
                            <p>Inbox</p>
                        </li>
                    </Link>
                    <Link to='/messages/unread'>
                        <li className='messagesMenuItem'>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M20 6H10v2h10v12H4V8h2v4h2V4h6V0H6v6H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z"/></svg>
                            <p>Unread</p>
                        </li>
                    </Link>
                    <Link to='/messages/sent'>
                        <li className='messagesMenuItem'>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M4.01 6.03l7.51 3.22-7.52-1 .01-2.22m7.5 8.72L4 17.97v-2.22l7.51-1M2.01 3L2 10l15 2-15 2 .01 7L23 12 2.01 3z"/></svg>
                            <p>Sent</p>
                        </li>
                    </Link>
                </ul>

                <ul className='messagesMenuList messagesActions'>
                    <li onClick={handleWarning} className='messagesMenuItem'>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z"/></svg>
                        <p>Delete</p>
                    </li>
                    <li onClick={markAllMessagesRead} className='messagesMenuItem'>
                        <svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24"><g><path d="M0,0h24v24H0V0z" fill="none"/></g><g><g><path d="M16.23,7h2.6c-0.06-0.47-0.36-0.94-0.79-1.17L10.5,2L2.8,5.83C2.32,6.09,2,6.64,2,7.17V15c0,1.1,0.9,2,2,2V7.4L10.5,4 L16.23,7z"/><path d="M20,8H7c-1.1,0-2,0.9-2,2v9c0,1.1,0.9,2,2,2h13c1.1,0,2-0.9,2-2v-9C22,8.9,21.1,8,20,8z M20,19H7v-7l6.5,3.33L20,12V19z M13.5,13.33L7,10h13L13.5,13.33z"/></g></g></svg>
                        <p>Mark All Read</p>
                    </li>
                    <li onClick={() => markSelectedUnread(false)} className='messagesMenuItem'>
                        <svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24"><g><rect fill="none" height="24" width="24" x="0"/><path d="M22,8.98V18c0,1.1-0.9,2-2,2H4c-1.1,0-2-0.9-2-2L2.01,6C2.01,4.9,2.9,4,4,4h10.1C14.04,4.32,14,4.66,14,5s0.04,0.68,0.1,1 H4l8,5l3.67-2.29c0.47,0.43,1.02,0.76,1.63,0.98L12,13L4,8v10h16V9.9C20.74,9.75,21.42,9.42,22,8.98z M16,5c0,1.66,1.34,3,3,3 s3-1.34,3-3s-1.34-3-3-3S16,3.34,16,5z"/></g></svg>
                        <p>Mark Read</p>
                    </li>
                    <li onClick={() => markSelectedUnread(true)} className='messagesMenuItem'>
                        <svg onClick={() => markSelectedUnread(true)} xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M20 6H10v2h10v12H4V8h2v4h2V4h6V0H6v6H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z"/></svg>
                        <p>Mark Unread</p>
                    </li>
                </ul>
            </div>
            <div className='messagesContent'>
                <div className='messagesLeft'>
                    <div className='messagesLeftHeader'>
                        <p>{header}</p>
                        <svg onClick={cancelSelecting} style={selecting ? {opacity: '1'} : {}} xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none" opacity=".87"/><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.59-13L12 10.59 8.41 7 7 8.41 10.59 12 7 15.59 8.41 17 12 13.41 15.59 17 17 15.59 13.41 12 17 8.41z"/></svg>
                    </div>
                    {
                        (outletMessages && outletMessages.mailbox && outletMessages.mailbox[0] && outletMessages.mailbox[0].data && outletMessages.mailbox[0].data.children.length > 0) ? <Outlet context={outletMessages}/> : !loading && !loadingMore ? <p className='messagesNone'>No Messages in {header}</p> : undefined
                    }
                    {loadingMore || loading ? <div className="messagesLoading"><img className="loader" src={loader} alt='Loader' /><p>Loading...</p></div> : undefined}
                </div>
                {renderMessageReader()}      
            </div>
            {composeOpen ? <MessageCompose state={[compose, setCompose]} toggleCompose={toggleCompose} handleSend={handleSend}/> : undefined}
            {warning ? <div className='deleteWarning'>Delete {selected.length === 1 ? 'this message' : 'these ' + selected.length.toString() + ' messages'}?<div onClick={deleteMessages}>Yes</div><div onClick={handleWarning}>No</div></div> : undefined}
        </div>
    )
}

export default Messages;