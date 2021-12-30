import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ContentTile from '../../../components/ContentTile/ContentTile';
import { fetchContent,fetchComments, selectMain } from "../../../containers/Main/mainSlice";

const Categories = (props) => {
        
    const dispatch = useDispatch();

    const main = useSelector(selectMain);

    useEffect(() => {
        dispatch(fetchContent({
            limit: 25,
            url: props.page + props.cat
        }))
    },[dispatch, props.page, props.cat])

    useEffect(() => {
        if (main.contentReady) {
            const newComments = main.page.content.data.children.slice(-25);
            dispatch(fetchComments({
                url: props.page + props.cat,
                comments: newComments
            }));
            console.log(main.page.content)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[main.contentReady])

    window.onscroll = () => {
        const loadMore = document.getElementsByClassName('mainLoadMore');
        if (loadMore.length > 0 && main.page.url.includes(props.page + props.cat)) {
            const loadPosition = loadMore[0].offsetTop;
            const scrollPosition = window.scrollY + (window.innerHeight - 44)
            const after = Array.from(main.page.content.data.children.slice());
            if (loadPosition <= scrollPosition) {
                dispatch(fetchContent({
                    limit: 25,
                    url: props.page + 'top',
                    after: after[after.length - 1].data.name
                }))
            }
        }
    }

    return (
        <div className='top'>
            {
                main.page.content && main.page.content.data && main.page.content.data.children ?

                main.page.content.data.children.map(article => <ContentTile key={article.data.id} article={article}/>) : undefined
            }
        </div>
    )
}

export default Categories;