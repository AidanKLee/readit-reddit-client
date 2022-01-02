import React, { useState } from 'react';

const CommentList = (props) => {

    const { comments, children, style, isReplies } = props;
    const [ commentsShowing, setCommentsShowing ] = useState(1);

    const handleViewMoreClick = () => {
        if (commentsShowing <= comments.length - 2) {
            setCommentsShowing(commentsShowing + 2)
        } else if (commentsShowing > comments.length - 2 && commentsShowing < comments.length) {
            setCommentsShowing(commentsShowing + 1)
        } 
    }

    const handleViewLessClick = () => {
        if (commentsShowing > 2) {
            setCommentsShowing(commentsShowing - 2)
        } else if (commentsShowing === 2) {
            setCommentsShowing(commentsShowing - 1)
        }
    }

    return (
        <div className='comments' style={style}>
            <ul className='commentsList'>
                {children ? children.map((child, i) => {
                    if (i < commentsShowing) {
                        return child
                    }
                    else return undefined
                }) : undefined}
            </ul>
            {comments && commentsShowing !== comments.length ? <p className='commentsRemaining'>{comments.length - commentsShowing} {isReplies ? 'replies' : 'comments'} remaining</p> : undefined}
            <div className='commentsActions'>
                {commentsShowing !== comments.length ? <p onClick={handleViewMoreClick}>VIEW MORE...</p> : undefined}
                {commentsShowing !== 1 ? <p onClick={handleViewLessClick}>VIEW LESS...</p> : undefined}
            </div>
        </div>
    )  
}

export default CommentList;