import React, { useState } from 'react';

const CommentList = (props) => {

    const { comments, children, style, isReplies, showing, minShowing } = props;
    const [ commentsShowing, setCommentsShowing ] = useState(showing);

    const handleViewMoreClick = () => {
        if (commentsShowing <= comments.length - 2) {
            setCommentsShowing(commentsShowing + 2)
        } else if (commentsShowing > comments.length - 2 && commentsShowing < comments.length) {
            setCommentsShowing(commentsShowing + 1)
        } 
    }

    const handleViewLessClick = () => {
        if (commentsShowing > minShowing + 1) {
            setCommentsShowing(commentsShowing - 2)
        } else if (commentsShowing === minShowing + 1) {
            setCommentsShowing(commentsShowing - 1)
        }
    }

    return (
        // <CSSTransition in={comments.length > 0} timeout={1000} classNames={'tran1'} mountOnEnter={true} unmountOnExit={true}>
            <div className='comments' style={style}>
                <ul className='commentsList'>
                    {children ? children.map((child, i) => {
                        if (i < commentsShowing) {
                            return child
                        }
                        else return undefined
                    }) : undefined}
                </ul>
                {comments && commentsShowing !== comments.length ? <p className='commentsRemaining'>{comments.length - commentsShowing} {isReplies ? comments.length - commentsShowing === 1 ? 'reply' : 'replies' : comments.length - commentsShowing === 1 ? 'comment' : 'comments'} remaining</p> : undefined}
                <div className='commentsActions'>
                    {comments && commentsShowing !== comments.length ? <p onClick={handleViewMoreClick}>VIEW MORE...</p> : undefined}
                    {comments && commentsShowing !== minShowing ? <p onClick={handleViewLessClick}>VIEW LESS...</p> : undefined}
                </div>
            </div>
        // </CSSTransition>
    )  
}

export default CommentList;