import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import reddit from '../../utilities/redditAPI';
import { selectLogin, setUpdate, toggleImageUpload } from '../LogIn/loginSlice';
import './fileUpload.css';

const FileUpload = () => {

    const dispatch = useDispatch();

    const login = useSelector(selectLogin);
    const initUploadData = useMemo(() => login.imageUpload, [login.imageUpload]);
    const userFullName = useMemo(() => login.authorization.user.subreddit.name,[login.authorization.user.subreddit.name]);
    const uploadType = useMemo(() => initUploadData.upload_type,[initUploadData]);
    const subreddit = useMemo(() => initUploadData.subreddit,[initUploadData]);

    const [ fileData, setFileData ] = useState();
    const fileType = useMemo(() => fileData ? fileData.file.type.includes('png') ? 'png' : 'jpg' : '',[fileData]);
    
    const [ drag, setDrag ] = useState('');
    const [ warning, setWarning ] = useState(false);

    const fileUploadData = useMemo(() => {
        if (fileData) {
            return {
                file: fileData.file,
                header: 0,
                img_type: fileType,
                name: `${userFullName}_${uploadType}.${fileType}`,
                subreddit: subreddit,
                upload_type: uploadType
            }
        }
    },[uploadType, fileData, fileType, userFullName, subreddit])

    const handleChange = (e) => {
        let file = e.target.files[0]
        const src = URL.createObjectURL(e.target.files[0])
        const fullFile = {
            file: file,
            src: src
        }
        setFileData(fullFile)
    }

    const handleCancel = () => {
        setFileData()
    }

    const handleUpload = async () => {
        const upload = await reddit.uploadImage(fileUploadData);
        if (upload.errors.length > 0) {
            setWarning(true)
            setFileData()
        } else {
            dispatch(toggleImageUpload())
            dispatch(setUpdate())
        }
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

    const warningStyle = {color: 'var(--sec1)', fontWeight: 'bold'}

    const renderContent = () => {
        if (!fileData) {
            if (drag === 'dragging' || drag === 'drag-hover') {
                return <div className='fileUploadUnder'><p>Drop File</p></div>
            }
            return <div className='fileUploadUnder'><p>Click here to select an image or drag and drop here.</p><ul><li>Maximum file size 500kb</li><li>Image must be PNG or JPEG</li>{initUploadData.upload_type === 'icon' ? <li style={warning ? warningStyle : {}}>Icons must be 256 x 256 pixels</li> : <li style={warning ? warningStyle : {}}>Banners must be 10:3 aspect ratio (e.g. 1280 x 384 pixels)</li>}</ul></div>
        } else if (fileData) {
            return (
                <div className='fileUploadOver'>
                    <img src={fileData.src} alt={'thumbnail'}/>
                    <p>Are you happy with this image?</p>
                    <div className='buildActions'>
                        <button onClick={handleUpload}>Submit</button>
                        <button className='red' onClick={handleCancel}>Cancel</button>
                    </div>
                </div>
            )
        }
    }

    useEffect(() => {
        const page = document.documentElement;
        page.style.overflow = 'hidden'
        return () => page.style.overflow = 'auto'
    },[])

    return (
        <div className='fileUpload' style={dragStyle()}>
            {!fileData ? <input onDragEnter={() => setDrag('drag-hover')} onDragLeave={() => setDrag('')} onDragStart={() => setDrag('dragging')} onDragEnd={() => setDrag('')} onDrop={() => setDrag('')} onChange={handleChange} type='file' accept='image/png, image/jpeg'/> : undefined}
            {renderContent()}
            <svg onClick={handleClose} xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>
        </div>
    )
}

export default FileUpload;