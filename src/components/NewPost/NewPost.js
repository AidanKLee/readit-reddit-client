import React from "react";
import { useDispatch, useSelector } from "react-redux";
import './newPost.css';
import { selectNewPost, toggleNewPost } from "./newPostSlice";

const NewPost = () => {
    
    const dispatch = useDispatch();

    const newPost = useSelector(selectNewPost);

    const handleClick = () => {
        dispatch(toggleNewPost());

        setTimeout(() => {
            if (!newPost.open) {
                const scrollTop = document.getElementsByClassName('createPost')[0].offsetTop;
                window.scrollTo({
                    top: scrollTop - 80,
                    left: 0,
                    behavior: 'smooth'
                });
            }
        }, 50)
        
    }

    return (
        <button onClick={handleClick} type='button' className='newPost' data-test='newPost'>
            {newPost.open ? <svg className='newPostSvg' xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 13H5v-2h14v2z"/></svg> : <svg className='newPostSvg' data-test='newPostSvg' xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>}
            <p className='newPostText'>Create New Post</p>
        </button>
    );
};

export default NewPost;