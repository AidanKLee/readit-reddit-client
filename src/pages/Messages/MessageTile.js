import React from 'react';

const MessageTile = (props) => {

    const { 
        messages: [ messages, setMessages], 
        userImages: [ userImages, setUserImages ], 
        selected: [ selected, setSelected],
        loader, 
        getTime 
    } = props

    const handleTileClick = (message, i, e) => {
        console.log(e)
        
        if (selected && selected[0] && selected[0].data.id === message.data.id ) {
            return setSelected([])
        }
        setSelected([ message, i ])
    }

    return (
        <div className='messageTile'>
            {
                messages.data.children.map((message, i) => {
                    return (
                        <li onClick={(e) => handleTileClick(message, i, e)} key={message.data.id} className='messagesListItem' style={selected && selected[0] && selected[0].data.id === message.data.id ? {backgroundColor: 'var(--bg3)', border: '1px solid var(--over2'} : {}}>
                            <div className='messagesListItemLeft'>
                                {userImages && userImages[i] ? userImages[i] : <img src={loader} alt='Loading Message'/>}
                            </div>
                            <div className='messagesListItemRight'>
                                <div className='messagesListItemLine'>
                                    <div className='messagesListItemLineLeft'>
                                        <p className='author' style={message.data.new ? {fontWeight: 'bold'} : undefined}>{message.data.author}</p>
                                        {message.data.new ? <p className='new'>New</p> : undefined}
                                    </div>
                                    
                                    <p className='created' style={message.data.new ? {fontWeight: 'bold'} : undefined}>{getTime(message.data.created)}</p>
                                </div>
                                <div className='messagesListItemLine'>
                                    <p className='subject' style={message.data.new ? {fontWeight: 'bold'} : undefined}>{message.data.subject}</p>
                                </div>
                                <div className='messagesListItemLine'>
                                    <p className='messagesListItemLineBody'>{message.data.body}</p>
                                    <div className='bodyFade' style={selected && selected[0] && selected[0].data.id === message.data.id ? {background: 'linear-gradient(90deg, rgba(40,40,40,0) 0%, var(--bg3) 100%)'} : {}}></div>
                                </div>
                            </div>
                            
                            
                        </li>
                    )
                })
            }
        </div>
    )
}

export default MessageTile;