import React from 'react';
import { Link } from 'react-router-dom';
import { Text } from '../ContentTile/ContentTile';
import { getTimePosted, returnToTop } from '../../utilities/functions';

const CommentItem = (props) => {

    const { comment, children, style } = props;

    return (
        <li className='commentsItem' style={style} key={comment.data.id}>
            <p><Text text={comment.data.body} length={150}/></p>
            <p><strong>Posted {getTimePosted(comment.data.created)}</strong> by <Link onClick={returnToTop} to={`/u/${comment.data.author}`}>{'u/' + comment.data.author}</Link></p>
            {children}
        </li>
    )
}

export default CommentItem;