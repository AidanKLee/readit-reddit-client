import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Text } from '../ContentTile/ContentTile';
import { getTimePosted, returnToTop } from '../../utilities/functions';
import Votes from '../Votes/Votes';
import Awards from '../Awards/Awards';
import CommentSubmit from './CommentSubmit';
// import { useDispatch } from 'react-redux';
// import { clearMainPageState } from '../../containers/Main/mainSlice';

const CommentItem = (props) => {

    // const dispatch = useDispatch();

    const { comment, children, style } = props;

    const [ newComment, setNewComment ] = useState(false);

    const handleClick = () => {
        returnToTop();
        // dispatch(clearMainPageState());
    }

    const toggleNewComment = () => {
        setNewComment(!newComment);
    }

    return (
        <li className='commentsItem' style={style} key={comment.data.id}>
            <p><Text text={comment.data.body} length={150}/></p>
            <p><strong>Posted {getTimePosted(comment.data.created)}</strong> by <Link onClick={handleClick} to={`/u/${comment.data.author}`}>{'u/' + comment.data.author}</Link></p>
            <div className='commentsItemVotes'>
                <Votes ups={comment.data.ups} downs={comment.data.downs} article={comment}/>
                <label htmlFor={'commentComment' + comment.data.id}>
                    <svg onClick={toggleNewComment} xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z"/></svg>
                </label>
            </div>
            {newComment ? <CommentSubmit id={'commentComment' + comment.data.id} isReply={true} parentName={comment.data.name}/> : undefined}
            {comment.data && comment.data.all_awardings.length > 0 ? <Awards article={comment}/> : undefined}
            {children}
        </li>
    )
}

export default CommentItem;