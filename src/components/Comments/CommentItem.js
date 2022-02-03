import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Text } from '../ContentTile/ContentTile';
import { getTimePosted, returnToTop } from '../../utilities/functions';
import Votes from '../Votes/Votes';
import Awards from '../Awards/Awards';
import CommentSubmit from './CommentSubmit';
import { selectLogin } from '../LogIn/loginSlice';
import { useSelector } from 'react-redux';
import DeleteButton from '../DeleteButton/DeleteButton';
import { CSSTransition } from 'react-transition-group';


const CommentItem = (props) => {

    const login = useSelector(selectLogin)

    const { comment, children, style, rootCommentList, prev, stateSetter, dispatcher, x, isMessage } = props;

    const [ newComment, setNewComment ] = useState(false);

    const handleClick = (e) => {
        returnToTop(e);
    }

    const toggleNewComment = () => {
        setNewComment(!newComment);
    }

    return (
        <li className='commentsItem' style={style} key={comment.data.id}>
            <p><Text text={comment.data.body} length={150}/></p>
            <p><strong>{!isMessage ? 'Posted' : 'Sent'} {getTimePosted(comment.data.created)}</strong> by <Link onClick={handleClick} to={`/u/${comment.data.author}`}>{'u/' + comment.data.author}</Link></p>
            <div className='commentsItemVotes'>
                {!isMessage ? <Votes isComment={true} ups={comment.data.ups} downs={comment.data.downs} article={comment}/> : undefined}
                <div className='commentsItemVotesRight'>
                    {!isMessage && login.authorization && login.authorization.user && 't2_' + login.authorization.user.id === comment.data.author_fullname ? <DeleteButton name={comment.data.name} type={'comment'} text={true}/> : undefined}
                    {
                        !isMessage && login.authorization ?
                        <label onClick={toggleNewComment} htmlFor={'commentComment' + comment.data.id}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z"/></svg>
                            <p>Reply</p>
                        </label> : undefined
                    }
                </div>
                
            </div>
            {!isMessage ? <CSSTransition in={newComment} timeout={300} classNames={'tran6'} mountOnEnter={true} unmountOnExit={true}><CommentSubmit id={'commentComment' + comment.data.id} isReply={true} parentName={comment.data.name} rootCommentList={rootCommentList} prev={prev} stateSetter={stateSetter} dispatcher={dispatcher} x={x}/></CSSTransition> : undefined}
            {!isMessage && comment.data && comment.data.all_awardings.length > 0 ? <Awards article={comment}/> : undefined}
            {children}
        </li>
    )
}

export default CommentItem;