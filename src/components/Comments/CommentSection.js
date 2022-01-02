import React from 'react';
import './comments.css';
import CommentList from './CommentList';
import CommentItem from './CommentItem';

const CommentSection = (props) => {

    let { comments, getTimePosted } = props;

    if (comments) {
        comments = comments.slice(0).reverse().slice(1)
    }
    
    const renderComments = (comment) => {
        if (comment.data.replies && comment.data.replies.data.children[0].data.body) {
            let replies = comment.data.replies.data.children.slice(0).reverse();
            if (!replies[0].data.subreddit_id) {
                replies = replies.slice(1)
            }
            return (
                <CommentItem key={comment.data.id} comment={comment} getTimePosted={getTimePosted}>
                    <CommentList isReplies={true} comments={replies}>
                        {replies.map(reply => renderComments(reply))}
                    </CommentList>
                </CommentItem>
            )
        } else {
            return <CommentItem key={comment.data.id} comment={comment} getTimePosted={getTimePosted}/>
        }
    }

    return (
        <CommentList comments={comments} style={{padding: '0 8px 8px 8px'}}>
            {comments ? comments.map(comment => renderComments(comment)) : undefined}
        </CommentList>
    )
}

export default CommentSection;