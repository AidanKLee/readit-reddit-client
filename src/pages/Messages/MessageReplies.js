import React from 'react';
import CommentItem from '../../components/Comments/CommentItem';

const MessageReplies = (props) => {

    const { replies } = props;

    let repliesArray;
    let originalMessage;

    if (replies && replies.comments && replies.comments.length > 0) {
        if (replies.comments[0].data.replies.data) {
            repliesArray = [...replies.comments[0].data.replies.data.children]
            repliesArray = repliesArray.reverse().slice(1)

            originalMessage = replies.comments[0]
            originalMessage = {...originalMessage, data: {...originalMessage.data, replies: ''}}
        }
    }
    

    return (
        <div className='messageReplies'>
            {
                repliesArray ? repliesArray.map(reply => {
                    return <CommentItem key={reply.data.id} comment={reply} isMessage={true}/>
                })
                : undefined
            }

            {repliesArray ? <CommentItem comment={originalMessage} isMessage={true}/> : undefined}
        </div>
    )
}

export default MessageReplies;