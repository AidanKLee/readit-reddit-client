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

    window.onscroll = () => {
        const loadMore = document.getElementsByClassName('mainLoadMore');
        if (loadMore.length > 0 && main.page.url.includes(props.page + 'new')) {
            const loadPosition = loadMore[0].offsetTop;
            const scrollPosition = window.scrollY + (window.innerHeight - 44)
            const after = Array.from(main.page.content.data.children.slice());
            if (loadPosition <= scrollPosition) {
                dispatch(fetchContent({
                    limit: 25,
                    url: props.page + 'new',
                    after: after[after.length - 1].data.name
                }))
            }
        }
    }

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