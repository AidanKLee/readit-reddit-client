import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toggleImageUpload } from '../LogIn/loginSlice';
import './fileUpload.css';

const FileUpload = () => {

    const dispatch = useDispatch();

    const [ fileData, setFileData ] = useState();
    const [ drag, setDrag ] = useState('');

    const handleChange = (e) => {
        let file = e.target.files[0]
        const src = URL.createObjectURL(e.target.files[0])
        const fullFile = {
            file: file,
            src: src
        }
        setFileData(fullFile)
    }

    console.log(fileData)

    const renderContent = () => {
        if (!fileData) {
            if (drag === 'dragging' || drag === 'drag-hover') {
                return <div className='fileUploadUnder'><p>Drop File</p></div>
            }
            return <div className='fileUploadUnder'><p>Click here to select an image or drag and drop here.</p><p>Maximum file size 500kb</p></div>
        } else if (fileData) {
            return (
                <div className='fileUploadOver'>
                    <img src={fileData.src} alt={'thumbnail'}/>
                    <p>Are you happy with this image?</p>
                    <div className='buildActions'>
                        <button>Submit</button>
                        <button className='red' onClick={handleCancel}>Cancel</button>
                    </div>
                </div>
            )
        }
    }

    const handleCancel = () => {
        setFileData()
    }

    const handleClose = () => {
        dispatch(toggleImageUpload())
    }

    const dragStyle = () => {
        if (drag === 'drag-hover') {
            return {backgroundColor: 'var(--drag1)'}
        } else {
            return {}
        }
    }

    return (
        <div className='fileUpload' style={dragStyle()}>
            {!fileData ? <input onDragEnter={() => setDrag('drag-hover')} onDragLeave={() => setDrag('')} onDragStart={() => setDrag('dragging')} onDragEnd={() => setDrag('')} onDrop={() => setDrag('')} onChange={handleChange} type='file' accept='image/png, image/jpeg'/> : undefined}
            {renderContent()}
            <svg onClick={handleClose} xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>
        </div>
    )
}

export default FileUpload;