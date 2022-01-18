import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { showNewComment } from '../../containers/Main/mainSlice';
import reddit from '../../utilities/redditAPI';

const CommentSubmit = (props) => {

    const dispatch = useDispatch();

    const { parentName, id, isReply } = props;

    const [ comment, setComment ] = useState('');

    const handleChange = (e) => {
        setComment(e.target.value);
        e.target.style.height = '0px'
        e.target.style.height = e.target.scrollHeight + 'px'
    }

    const submitComment = async () => {
        if (comment.length > 0) {
            const newComment = await reddit.submitNewComment({text: comment, thing_id: parentName});
            setComment('');
            dispatch(showNewComment(newComment));
            console.log(newComment)
        }
    }

    const handleKeyDown = (e) => {
        if (e.shiftKey && e.keyCode === 13) {
            e.preventDefault();
            submitComment();
        }
    }

    return (
        <div className='commentSubmit'>
            <div className='commentSubmitTextWrapper'>
                <textarea id={id} onKeyDown={handleKeyDown} onChange={handleChange} placeholder={isReply ? 'Reply To This Comment...' : 'Post A Comment...'} value={comment}/>
            </div>
            <div className='commentSubmitButtonWrapper'>
                <svg onClick={submitComment} xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M4.01 6.03l7.51 3.22-7.52-1 .01-2.22m7.5 8.72L4 17.97v-2.22l7.51-1M2.01 3L2 10l15 2-15 2 .01 7L23 12 2.01 3z"/></svg>
            </div>     
            {comment.length > 0 && document.activeElement === document.getElementById(id) ? <div className='commentSubmitHelp'><p>Shift + Enter to Submit Comment</p></div> : undefined}     
        </div>
    )
}

export default CommentSubmit;