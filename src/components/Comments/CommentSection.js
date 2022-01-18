import React from 'react';
import './comments.css';
import CommentList from './CommentList';
import CommentItem from './CommentItem';

const CommentSection = (props) => {

    let { comments, article, showing } = props;

    console.log(comments)

    if (!comments || comments.length === 0) {
        comments = [article];
    }

    if (comments) {
        comments = comments.slice(0).reverse();
        if (!comments[0].data.subreddit_id) {
            comments = comments.slice(1);
        }
    }
    
    const renderComments = (comment) => {
        if (comment.data.replies && comment.data.replies.data.children[0].data.body) {
            let replies = comment.data.replies.data.children.slice(0).reverse();
            if (!replies[0].data.subreddit_id) {
                replies = replies.slice(1)
            }
            return (
                <CommentItem style={{padding: '8px 8px 0'}} key={comment.data.id} comment={comment}>
                    <CommentList isReplies={true} comments={replies} showing={showing === 'all' ? replies.length : 0} minShowing={0}>
                        {replies.map(reply => renderComments(reply))}
                    </CommentList>
                </CommentItem>
            )
        } else {
            return <CommentItem key={comment.data.id} comment={comment}/>
        }
    }

    return (
        <CommentList comments={comments} style={{padding: '0 8px'} } showing={showing === 'all' ? comments.length : 1} minShowing={1}>
            {comments ? comments.map(comment => renderComments(comment)) : undefined}
        </CommentList>
    )
}

export default CommentSection;