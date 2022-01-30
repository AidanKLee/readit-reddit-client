import React, { useEffect, useMemo } from 'react';

const MessageTile = (props) => {

    const { 
        messages: [ messages], 
        userImages: [ userImages ], 
        selected: [ selected, setSelected],
        loader, 
        getTime,
        markSelectedUnread,
        selecting: [ selecting, setSelecting ],
        allLoaded
    } = props

    let timer;

    const touchStart = (selected) => {
        timer = setTimeout(() => handleLongTouch(selected), 750)
    }
    const touchEnd = () => {
        if (timer) {
            clearTimeout(timer);
        }
    }
    const handleLongTouch = (selected) => {
        if (!selecting) {
            setSelecting(true)
            setSelected([ selected ])
        } else {
            setSelecting(false)
            setSelected([])
        }
        
    }

    const selectedNames = useMemo(() => selected.map((message, i) => {
        return message[0].data.name
    }),[selected])

    useEffect(() => {
        if (selectedNames.length === 1 && selected[0][0].data.new && !selecting) {
            markSelectedUnread(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[selectedNames])

    const isBetweenNumbers = (i, x, y) => {
        if (x < y) {
            if (i < x || i >= y) {
                return false;
            }
        } else if (y < x) {
            if (i <= y || i > x) {
                return false
            }
        }
        return true;
    }

    const handleTileClick = (message, i, e) => {
        if (selecting) {
            if (!isSelected(i)) {
                setSelected([...selected, [ message, i]])
            } else {
                const newSelected = selected.filter((m) => m[1] !== i)
                setSelected(newSelected)
            }
        } else if (isSelected(i) && selected.length > 1 && !e.ctrlKey && !e.shiftKey) {
            setSelected([[ message, i ]])
        } else if (e.shiftKey && isSelected(i)) {
            const newSelectedGroup = selected.filter((m, j) => isBetweenNumbers(m[1], i, selected[0][1]))
            setSelected([ selected[0], ...newSelectedGroup] )
        } else if (isSelected(i) || (e.ctrlKey && isSelected(i))) {
            const newSelected = selected.filter((m) => m[1] !== i)
            setSelected(newSelected)
        } else if (e.ctrlKey && !isSelected(i)) {
            setSelected([...selected, [ message, i ]])
        } else if (e.shiftKey && !isSelected(i)) {
            let selectedGroup = [ selected[0] ];
            if (selected.length > 0) {
                messages.data.children.forEach((m, j) => {
                    if (isBetweenNumbers(j, i, selected[0][1])) {
                        selectedGroup = [ ...selectedGroup, [ m, j ] ]
                    }
                })
            } else {
                selectedGroup = [[ message, i ]]
            }
            // console.log(selectedGroup)
            setSelected(selectedGroup)
        } else if (!isSelected(i)) {
            setSelected([[ message, i ]])
        }
    }

    // console.log(messages)

    const isSelected = (i) => {
        let isSelected = false;
        if (selected.length > 0) {
            selected.forEach(message => {
                if (i === message[1]) {
                    isSelected = true
                }
            })
        }
        
        return isSelected;
    }

    return (
        <div className='messageTile'>
            {
                messages.data.children.map((message, i) => {
                    return (
                        <li onContextMenu={(e) => e.preventDefault()} onTouchStart={() => touchStart([ message, i ])} onTouchEnd={touchEnd} onClick={(e) => handleTileClick(message, i, e)} key={message.data.id} className='messagesListItem' style={isSelected(i) ? {backgroundColor: 'var(--bg3)', border: '1px solid var(--over2)', boxShadow: '2px 2px 4px rgba(0, 0, 0, .6)'} : {}}>
                            <div className='messagesListItemLeft'>
                                {userImages && userImages[i] ? userImages[i] : <img src={loader} alt='Loading Message'/>}
                            </div>
                            <div className='messagesListItemRight'>
                                <div className='messagesListItemLine'>
                                    <div className='messagesListItemLineLeft'>
                                        <p className='author' style={message.data.new ? {fontWeight: 'bold'} : undefined}>{message.data.author ? message.data.author : message.data.subreddit}</p>
                                        {message.data.new ? <p className='new'>New</p> : undefined}
                                    </div>
                                    
                                    <p className='created' style={message.data.new ? {fontWeight: 'bold'} : undefined}>{getTime(message.data.created)}</p>
                                </div>
                                <div className='messagesListItemLine'>
                                    <p className='subject' style={message.data.new ? {fontWeight: 'bold'} : undefined}>{message.data.subject}</p>
                                </div>
                                <div className='messagesListItemLine'>
                                    <p className='messagesListItemLineBody'>{message.data.body}</p>
                                    <div className='bodyFade' style={isSelected(i) ? {background: 'linear-gradient(90deg, rgba(40,40,40,0) 0%, var(--bg3) 100%)'} : {}}></div>
                                </div>
                            </div>
                        </li>
                    )
                })
            }
            {allLoaded ? <div className="messagesLoaded"><p>End Of Messages.</p></div> : undefined}
        </div>
    )
}

export default MessageTile;