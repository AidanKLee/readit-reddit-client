import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchContent, selectMain } from '../../../containers/Main/mainSlice';
import ContentTile from '../../../components/ContentTile/ContentTile';

const New = (props) => {

    const dispatch = useDispatch();

    const main = useSelector(selectMain);

    useEffect(() => {
        dispatch(fetchContent({
            limit: 25,
            url: props.page + 'new'
        }))
    },[dispatch, props.page])

    return (
        <div className='new'>
            {
                main.page.content && main.page.content.data && main.page.content.data.children ?

                main.page.content.data.children.map(article => <ContentTile key={article.data.id} article={article}/>) : undefined
            }
        </div>
    )
}

export default New;