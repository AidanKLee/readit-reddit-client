import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ContentTile from '../../../components/ContentTile/ContentTile';
import { fetchContent, selectMain } from "../../../containers/Main/mainSlice";

const Rising = (props) => {
    
    const dispatch = useDispatch();

    const main = useSelector(selectMain);

    useEffect(() => {
        dispatch(fetchContent({
            limit: 25,
            url: props.page + 'rising'
        }))
    },[dispatch, props.page])

    return (
        <div className='rising'>
            {
                main.page.content && main.page.content.data && main.page.content.data.children ?

                main.page.content.data.children.map(article => <ContentTile key={article.data.id} article={article}/>) : undefined
            }
        </div>
    )
}

export default Rising;