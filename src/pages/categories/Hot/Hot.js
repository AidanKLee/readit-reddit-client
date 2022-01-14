import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ContentTile from '../../../components/ContentTile/ContentTile';
import { fetchComments, fetchSubreddits, fetchContent, selectMain } from "../../../containers/Main/mainSlice";
import loader from '../../../assets/loader.svg';
import { selectLogin } from '../../../components/LogIn/loginSlice';

const Hot = (props) => {

    const dispatch = useDispatch();

    const main = useSelector(selectMain);
    const login = useSelector(selectLogin);

    const [ loadMore, setLoadMore ] = useState(false);

    useEffect(() => {
        if (login.initialLoginAttempt) {
            dispatch(fetchContent({
            limit: 25,
            url: props.page + 'hot',
            loggedIn: login && login.authorization && login.authorization.accessToken ? true : false
            }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[props.page, login.initialLoginAttempt])

    useEffect(() => {
        if (main.contentReady && main.page && main.page.content && main.page.content.data) {
            setLoadMore(false);
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

    useEffect(() => {
        if (loadMore) {
            const after = Array.from(main.page.content.data.children.slice(-25));
            dispatch(fetchContent({
                limit: 25,
                url: props.page + 'best',
                after: after[after.length - 1].data.name
            }))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loadMore])

    window.onscroll = () => {
        const loadMore = document.getElementsByClassName('mainLoadMore');
        if (loadMore.length > 0 && main.page.url.includes(props.page + 'hot')) {
            const loadPosition = loadMore[0].offsetTop - 400;
            const scrollPosition = window.scrollY + window.innerHeight;
            if (loadPosition <= scrollPosition && !main.page.allLoaded) {
                setLoadMore(true);
            }
        }
    }

    return (
        <div className='hot'>
            {
                main.page.content && main.page.content.data && main.page.content.data.children ?

                main.page.content.data.children.map((article, index) => <ContentTile key={article.data.id + index} i={index} article={article}/>) : undefined
            }
            {main.isLoading ? <div className="mainLoading"><img className="loader" src={loader} alt='Loader' /><p>Loading...</p></div> : undefined}
            {main.page.allLoaded && !main.isLoading ? <p className="mainLoading">No more results.</p> : <div className="mainLoadMore"></div>}
        </div>
    )
}

export default Hot;