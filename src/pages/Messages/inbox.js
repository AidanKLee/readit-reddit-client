import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import reddit from '../../utilities/redditAPI';
import loader from '../../assets/loader.svg';
import MessageTile from './MessageTile';

const Inbox = () => {

    const {
        inbox: [ inbox, setInbox ], 
        selected: [ selected, setSelected ]
    } = useOutletContext();

    const [ userImages, setUserImages ] = useState([])

    console.log(inbox)

    useEffect(() => {
        const getImages = async () => {
            setUserImages([])
            let images = await Promise.all(inbox.data.children.map(async (message) => {
                let userData;
                let image;
                if (message.data.author) {
                    userData = await reddit.fetchSubreddit(`user/${message.data.author}`)
                    image = reddit.getIconImg(userData)
                }
                return image
            }))
            setUserImages(images)
        }
        getImages();
    },[inbox])

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
        <ul className='messagesList'>
            <MessageTile 
                messages={[ inbox, setInbox ]}
                selected={[selected, setSelected]}
                userImages={[ userImages, setUserImages ]}
                loader={loader}
                getTime={getTime}
            />
        </ul>
    )
}

export default Inbox;