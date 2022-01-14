import React from "react";
import { useDispatch } from "react-redux";
import './newPost.css';
import { toggleNewPost } from "./newPostSlice";

const NewPost = () => {
    
    const dispatch = useDispatch();

    const handleClick = () => {
        dispatch(toggleNewPost());
    }

    return (
        <button onClick={handleClick} type='button' className='newPost' data-test='newPost'>
            <svg className='newPostSvg' data-test='newPostSvg' xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
            <p className='newPostText'>Create New Post</p>
        </button>
    );
};

export default NewPost;