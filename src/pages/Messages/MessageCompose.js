import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectLogin } from '../../components/LogIn/loginSlice';
import reddit from '../../utilities/redditAPI';

const MessageCompose = (props) => {

    const login = useSelector(selectLogin);
    const { user, moderated } = login && login.authorization ? login.authorization : {}

    const { state: [ state, setState ], toggleCompose, handleSend } = props;
    const { minimized, expanded, from_sr, subject, text } = state;

    // const [ selectedFrom, setSelectedFrom] = useState({});

    useEffect(() => {
        if (user && user.name) {
            setState({...state, from_sr: user.name})
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[user])

    const getImg = () => {
        if (from_sr && user) {
            if (from_sr === user.name) {
                return reddit.getIconImg(user)
            } else {
                const subreddit = moderated.filter(subreddit => from_sr.includes(subreddit.sr))
                return reddit.getIconImg(subreddit[0])
            }
        }
    }

    const toggleMinimized = () => {
            setState({ ...state, minimized: !minimized})
    }

    const toggleExpanded = () => {
        setState({ ...state, expanded: !expanded})
    }

    const handleChange = (e) => {
        const key = e.target.name;
        const value = e.target.value;
        setState({
            ...state,
            [key]: value
        })
    }

    const selectAll = (e) => {
        if (e.keyCode === 65 && e.ctrlKey) {
            e.preventDefault();
            e.target.select();
        }
    }

    return (
        <div className='compose' style={minimized ? {height: '33px'} : expanded ? {transform: 'translateX(50%)', right: '50%', bottom: '0', height: 'calc(100vh - 96px)', maxWidth: '100%'} : {}}>
            <div className='composeBar'>
                <div onClick={handleSend} className='composeBarButton composeBarLeft'>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M4.01 6.03l7.51 3.22-7.52-1 .01-2.22m7.5 8.72L4 17.97v-2.22l7.51-1M2.01 3L2 10l15 2-15 2 .01 7L23 12 2.01 3z"/></svg>
                    <p>Send</p>
                </div>
                <div className='composeBarRight'>
                    <div className='composeBarButton'>
                        {minimized ? <svg onClick={toggleMinimized} xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M3 3h18v2H3V3z"/></svg> : <svg onClick={toggleMinimized} xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M6 19h12v2H6v-2z"/></svg>}
                    </div>
                    <div className='composeBarButton'>
                        {expanded ? <svg onClick={toggleExpanded} xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24"><rect fill="none" height="24" width="24"/><path d="M22,3.41l-5.29,5.29L20,12h-8V4l3.29,3.29L20.59,2L22,3.41z M3.41,22l5.29-5.29L12,20v-8H4l3.29,3.29L2,20.59L3.41,22z"/></svg> : <svg onClick={toggleExpanded} xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24"><rect fill="none" height="24" width="24"/><polygon points="21,11 21,3 13,3 16.29,6.29 6.29,16.29 3,13 3,21 11,21 7.71,17.71 17.71,7.71"/></svg>}
                    </div>
                    <div className='composeBarButton'>
                        <svg onClick={toggleCompose} xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>
                    </div>
                </div>
            </div>
            <div className='composeBodyWrapper' style={minimized ? {height: '0px'} : {}}>
                <div className='composeBody'>
                    <div className='composeBodyInput taller'>
                        {getImg()}
                        <select onChange={handleChange} name='from_sr' placeholder='From...' className='composeBodyInput taller'>
                            {user ? <option value={user.name}>{user.name}</option> : undefined}
                            {
                                moderated && moderated.length > 0 ?
                                    moderated.map(subreddit => <option key={subreddit.name} value={subreddit.display_name}>{subreddit.display_name_prefixed}</option>)
                                : undefined
                            }
                        </select>
                    </div>
                    
                    <input onKeyDown={selectAll} onChange={handleChange} name='to' placeholder='To... /r/SubredditName or UserName' className='composeBodyInput'/>
                    <input onKeyDown={selectAll} onChange={handleChange} name='subject' placeholder='Subject...' className='composeBodyInput' defaultValue={subject}/>
                    <textarea onKeyDown={selectAll} onChange={handleChange} name='text' placeholder='Your Message...' className='composeBodyText' defaultValue={text}/>
                </div>
            </div>
        </div>
    )

}

export default MessageCompose;