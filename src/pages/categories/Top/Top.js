import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ContentTile from '../../../components/ContentTile/ContentTile';
import { fetchContent, selectMain } from "../../../containers/Main/mainSlice";

const Top = (props) => {
        
    const dispatch = useDispatch();

    const main = useSelector(selectMain);

    useEffect(() => {
        dispatch(fetchContent({
            limit: 25,
            url: props.page + 'top'
        }))
    },[dispatch, props.page])

    return (
        <div className='top'>
            {
                main.page.content && main.page.content.data && main.page.content.data.children ?

                main.page.content.data.children.map(article => <ContentTile key={article.data.id} article={article}/>) : undefined
            }
        </div>
    )
}

export default Top;