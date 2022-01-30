import React from 'react';
import { useOutletContext } from 'react-router-dom';
import loader from '../../assets/redditLogo.svg';
import MessageTile from './MessageTile';

const Mailbox = () => {

    const {
        mailbox: [ mailbox, setMailbox ], 
        selected: [ selected, setSelected ],
        selecting: [ selecting, setSelecting ],
        userImages: [ userImages, setUserImages],
        markSelectedUnread,
        handleLoadMore,
        loadingMore,
        allLoaded
    } = useOutletContext();

    const getTime = (t) => {
        t = new Date(t * 1000)
        const sent = t.toString().slice(0, 15)
        const today = new Date(Date.now()).toString().slice(0, 15);

        if (sent === today) {
            let hours = t.getHours();
            let minutes = t.getMinutes();

            if (hours.toString().length === 1) {
                hours = '0' + hours.toString()
            }
            if (minutes.toString().length === 1) {
                minutes = '0' + minutes.toString();
            }

            t = hours + ':' + minutes
        } else {
            let day = t.getDate();
            let month = t.getMonth() + 1;
            const year = t.getFullYear().toString().slice(2);

            if (day.toString().length === 1) {
                day = '0' + day.toString()
            }
            if (month.toString().length === 1) {
                month = '0' + month.toString();
            }

            t = day + '.' + month + '.' + year;
        }
        return t.toString()
    }

    return (
        <ul onScroll={handleLoadMore} className='messagesList'>
            <MessageTile 
                messages={[ mailbox, setMailbox ]}
                selected={[ selected, setSelected ]}
                selecting={[ selecting, setSelecting ]}
                userImages={[ userImages, setUserImages ]}
                loader={loader}
                getTime={getTime}
                markSelectedUnread={markSelectedUnread}
                loadingMore={loadingMore}
                allLoaded={allLoaded}
            />
            <div className='messagesLoadMore'></div>
        </ul>
    )
}

export default Mailbox;