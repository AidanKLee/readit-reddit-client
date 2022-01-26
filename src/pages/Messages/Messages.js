import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { selectLogin } from '../../components/LogIn/loginSlice';
import reddit from '../../utilities/redditAPI';
import './messages.css';

const Messages = () => {

    const location = useLocation().pathname;

    const getHeader = () => {
        let header = location.split('/')[2]
        header = header ? header.slice(0, 1).toUpperCase() + header.slice(1) : 'Inbox'
        return header
    }
    const header = getHeader();

    const login = useSelector(selectLogin)

    const [ inbox, setInbox ] = useState({});
    const [ unread, setUnread ] = useState({});
    const [ sent, setSent ] = useState({});
    const [ selected, setSelected ] = useState([]);
    const [ outletMessages, setOutletMessages ] = useState([])

    console.log(inbox)

    useEffect(() => {
        if (login.authorization && login.authorization.accessToken) {
            getMessages(reddit.fetchInbox, setInbox);
            getMessages(reddit.fetchUnread, setUnread);
            getMessages(reddit.fetchSent, setSent);
        }
        
    },[login])

    const getMessages = async (type, setter, params) => {
        const messages = await type({params})
        setter(messages)
    }

    useEffect(() => {
        if (location.includes('inbox') && inbox && inbox.data) {
            setOutletMessages({inbox: [ inbox, setInbox ], selected: [ selected, setSelected]})
        } else if (location.includes('unread') && unread && unread.data) {
            setOutletMessages({unread: [ unread, setUnread ], selected: [ selected, setSelected]})
        } else if (location.includes('sent') && sent && sent.data) {
            setOutletMessages({sent: [ sent, setSent ], selected: [ selected, setSelected]})
        }
    },[location, inbox, unread, sent, selected])
        

    return (
        <div className='messages'>
            <div className='messagesMenu'>
                <Link to={'/messages/new'}>
                    <div className='messagesMenuNew'>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
                        <p>Compose New Message</p>
                    </div>
                </Link>
                
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
            </div>
            <div className='messagesContent'>
                <div className='messagesLeft'>
                    <div className='messagesLeftHeader'>
                        <p>{header}</p>
                    </div>
                    {
                        (outletMessages.inbox && outletMessages.inbox.length === 2) || 
                        (outletMessages.unread && outletMessages.unread.length === 2) || 
                        (outletMessages.sent && outletMessages.sent.length === 2) 
                        ? <Outlet context={outletMessages}/> 
                        : undefined
                    }
                </div>
                
            </div>
        </div>
    )
}

export default Messages;