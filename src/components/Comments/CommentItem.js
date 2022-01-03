import React from 'react';
import { Link } from 'react-router-dom';
import { getTimePosted, returnToTop } from '../../utilities/functions';

const CommentItem = (props) => {

    const { comment, children, style } = props;

    return (
        <li className='commentsItem' style={style} key={comment.data.id}>
            <p>{comment.data.body}</p>
            <p><strong>Posted {getTimePosted(comment.data.created)}</strong> by <Link onClick={returnToTop} to={`/u/${comment.data.author}`.toLowerCase()}>{'u/' + comment.data.author}</Link></p>
            {children}
        </li>
    )
}

export default CommentItem;