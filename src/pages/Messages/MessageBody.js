import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import CommentSubmit from '../../components/Comments/CommentSubmit';
import { Text } from '../../components/ContentTile/ContentTile';
import { getTimePosted } from '../../utilities/functions';
import reddit from '../../utilities/redditAPI';
import MessageReplies from './MessageReplies';
import redditLogo from '../../assets/redditLogo.svg';
import { CSSTransition } from 'react-transition-group';

const MessageBody = (props) => {

    const {
        selected: [ selected, setSelected ],
        userImages: [ userImages ],
        handleWarning,
        smallScreen,
        markSelectedUnread,
        handleForward
    } = props

    const selectedId = useMemo(() => selected && selected.length > 0 ? selected[0][0].data.id : undefined,[selected]) 

    const [ replies, setReplies ] = useState({});
    const [ reply, setReply ] = useState(false);
    const [ mountHeader, setMountHeader ] = useState(false);
    const [ mountBody, setMountBody ] = useState(false);
    const [ mountReplies, setMountReplies ] = useState(false);

    useEffect(() => {
        const getReplies = async () => {
            const messageReplies = await reddit.fetchMessageReplies(selectedId);
            setReplies({...replies, comments: messageReplies.data.children})

        }
        setReplies({})
        getReplies();
        setMountHeader(false)
        setMountBody(false)
        setMountReplies(false)
        setReply(false)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[selectedId])

    const handleReplyClick = () => {
        setReply(!reply)
    }

    useEffect(() => {
        if (!mountHeader && replies && replies.comments && replies.comments.length > 0) {
            setMountHeader(true)
        }
    },[replies, mountHeader])

    useEffect(() => {
        if (selected.length === 1) {
            const messageReader = document.querySelector('.messagesRight');
            messageReader.style.opacity = '1';
        }
    },[selected])

    const handleBack = () => {
        const messageReader = document.querySelector('.messagesRight');
        messageReader.style.opacity = '0';
        const timeout = setTimeout(() => {
            setSelected([])
            clearTimeout(timeout)
        }, 500);
    }

    return (
        <div className='messagesRight'>
            <CSSTransition in={mountHeader} exit={false} timeout={300} classNames='tran6' mountOnEnter={true} unmountOnExit={true}>
                <div className='messagesRightHeader'>
                    <div className='messagesRightHeaderLeft'>
                        {smallScreen ? <svg onClick={handleBack} className='messagesRightHeaderLeftBack' xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg> : undefined}
                        {!smallScreen ? <p>{new Date(selected[0][0].data.created * 1000).toDateString() + ', ' + new Date(selected[0][0].data.created * 1000).toLocaleTimeString().slice(0, 5) + ' (' + getTimePosted(selected[0][0].data.created) + ')'}</p> : undefined}
                    </div>
                    <div className='messagesRightHeaderRight'>
                        <label onClick={handleReplyClick} className='messagesRightHeaderActions' htmlFor='messageRightReply'><svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z"/></svg></label>
                        <div onClick={() => handleForward(selected[0][0].data.subject, selected[0][0].data.body, selected[0][0].data.author ? selected[0][0].data.author : selected[0][0].data.subreddit, selected[0][0].data.dest)} className='messagesRightHeaderActions'><svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M14 8.83L17.17 12 14 15.17V14H6v-4h8V8.83M12 4v4H4v8h8v4l8-8-8-8z"/></svg></div>
                        <div onClick={handleWarning} className='messagesRightHeaderActions delete'><svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z"/></svg></div>
                        <div onClick={markSelectedUnread} className='messagesRightHeaderActions'><svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M20 6H10v2h10v12H4V8h2v4h2V4h6V0H6v6H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z"/></svg></div>
                    </div>
                </div>
            </CSSTransition>
            <CSSTransition in={mountHeader} exit={false} timeout={300} classNames='tran6' mountOnEnter={true} unmountOnExit={true} onEntered={() => setMountBody(true)}>
            <div className='messagesRightDetails'>
                {smallScreen ? <p className='messageRightDetailsDate'>{new Date(selected[0][0].data.created * 1000).toDateString() + ', ' + new Date(selected[0][0].data.created * 1000).toLocaleTimeString().slice(0, 5) + ' (' + getTimePosted(selected[0][0].data.created) + ')'}</p> : undefined}
                <p className='messageRightDetailsSubject'>
                    {selected[0][0].data.subject}
                </p>
                <div className='messageRightDetailsUsers'>
                    {userImages[selected[0][1]] ? userImages[selected[0][1]] : <img src={redditLogo} alt={'User Avatar'}/>}
                    <div className='messageRightDetailsUsersText'>
                        {selected[0][0].data.author ? <p><strong>{selected[0][0].data.author}</strong> - <Link to={'/u/' + selected[0][0].data.author}>{' u/' + selected[0][0].data.author}</Link></p> : <p><strong>{selected[0][0].data.subreddit}</strong> - <Link to={'/r/' + selected[0][0].data.subreddit}>{' r/' + selected[0][0].data.subreddit}</Link></p>}
                        to {selected[0][0].data.dest}
                    </div>
                </div>
            </div>
            </CSSTransition>
            <CSSTransition in={reply} timeout={300} classNames={'tran6'} mountOnEnter={true} unmountOnExit={true}><CommentSubmit id='messageRightReply' isMessage={true} parentName={selected[0][0].data.name}/></CSSTransition>
            <CSSTransition in={mountBody} exit={false} timeout={300} classNames='tran6' mountOnEnter={true} unmountOnExit={true}  onEntered={() => setMountReplies(true)}>
                <div className='messagesRightBody'>
                    <Text text={selected[0][0].data.body} length={selected[0][0].data.body}/>
                </div>
            </CSSTransition>
            <div className='messagesRightReplies'>
                <CSSTransition in={mountReplies} exit={false} timeout={300} classNames='tran6' mountOnEnter={true} unmountOnExit={true}><MessageReplies replies={replies}/></CSSTransition>
            </div>
        </div>
    )
}

export default MessageBody;