import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ContentTile from '../../../components/ContentTile/ContentTile';
import { fetchComments, fetchSubreddits, fetchContent, selectMain } from "../../../containers/Main/mainSlice";

const Best = (props) => {

    const dispatch = useDispatch();

    const main = useSelector(selectMain);

    useEffect(() => {
        dispatch(fetchContent({
            limit: 25,
            url: props.page + 'best'
        }))
    },[dispatch, props.page])

    useEffect(() => {
        if (main.contentReady) {
            const content = main.page.content.data.children.slice(-25);
            dispatch(fetchComments({
                comments: content
            }));
            dispatch(fetchSubreddits({
                subreddits: content
            }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[main.contentReady])

    window.onscroll = () => {
        const loadMore = document.getElementsByClassName('mainLoadMore');
        if (loadMore.length > 0 && main.page.url.includes(props.page + 'best')) {
            const loadPosition = loadMore[0].offsetTop;
            const scrollPosition = window.scrollY + (window.innerHeight - 44)
            const after = Array.from(main.page.content.data.children.slice());
            if (loadPosition <= scrollPosition) {
                dispatch(fetchContent({
                    limit: 25,
                    url: props.page + 'best',
                    after: after[after.length - 1].data.name
                }))
            }
        }
    }

    return (
        <div className='best'>
            {
                main.page.content && main.page.content.data && main.page.content.data.children ?

                main.page.content.data.children.map((article, index) => <ContentTile key={article.data.id + index} i={index} article={article}/>) : undefined
            }
        </div>
    )
}

export default Best;