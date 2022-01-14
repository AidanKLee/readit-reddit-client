import React from 'react';
import { Link } from 'react-router-dom';
import { Text } from '../ContentTile/ContentTile';
import { getTimePosted, returnToTop } from '../../utilities/functions';
import Votes from '../Votes/Votes';
import Awards from '../Awards/Awards';
// import { useDispatch } from 'react-redux';
// import { clearMainPageState } from '../../containers/Main/mainSlice';

const CommentItem = (props) => {

    // const dispatch = useDispatch();

    const { comment, children, style } = props;

    const handleClick = () => {
        returnToTop();
        // dispatch(clearMainPageState());
    }

    return (
        <li className='commentsItem' style={style} key={comment.data.id}>
            <p><Text text={comment.data.body} length={150}/></p>
            <p><strong>Posted {getTimePosted(comment.data.created)}</strong> by <Link onClick={handleClick} to={`/u/${comment.data.author}`}>{'u/' + comment.data.author}</Link></p>
            <div className='commentsItemVotes'>
                <Votes ups={comment.data.ups} downs={comment.data.downs} article={comment}/>
                {comment.data && comment.data.all_awardings.length > 0 ? <Awards article={comment}/> : undefined}
            </div>
            
            {children}
        </li>
    )
}

export default CommentItem;