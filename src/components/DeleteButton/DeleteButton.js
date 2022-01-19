import React, { useState } from 'react';
import reddit from '../../utilities/redditAPI';
import './deleteButton.css';

const DeleteButton = (props) => {

    const { name, text, type } = props;

    const [ warning, setWarning ] = useState(false);

    const handleDelete = () => {
        reddit.delete(name);
        setWarning(false);
    }

    const handleWarning = () => {
        setWarning(!warning)
    }

    if (warning) {
        document.querySelector('body').style.overflow = 'hidden';
    } else {
        document.querySelector('body').style.overflow = 'auto';
    }

    return (
        <div className='delete'>
            {warning ? <div className='deleteWarning'>Delete this {type}?<div onClick={handleDelete}>Yes</div><div onClick={handleWarning}>No</div></div> : undefined}
            <div onClick={handleWarning} className='deleteButton'>
                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z"/></svg>
                {text ? <p>Delete</p> : undefined}
            </div>
        </div> 
    )
}

export default DeleteButton;