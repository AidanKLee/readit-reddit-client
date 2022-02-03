import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ContentTile from '../../../components/ContentTile/ContentTile';
import { fetchComments, fetchSubreddits, fetchContent, selectMain } from "../../../containers/Main/mainSlice";
import loader from '../../../assets/loader.svg';
import { selectLogin } from '../../../components/LogIn/loginSlice';
import { CSSTransition } from 'react-transition-group';
import { useLocation } from 'react-router-dom';

const Top = (props) => {

    const dispatch = useDispatch();

    const main = useSelector(selectMain);
    const login = useSelector(selectLogin);

    const location = useLocation().pathname;

    const [ mount, setMount ] = useState(true);
    const [ loadMore, setLoadMore ] = useState(false);

    const articles = useMemo(() => main.page.content && main.page.content.data && main.page.content.data.children ? main.page.content.data.children : [],[main])

    useEffect(() => {
        if (login.initialLoginAttempt) {
            dispatch(fetchContent({
            limit: 25,
            url: props.page + 'top',
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
    
    // if location changes, unmount the tiles and start rendering the new ones when articles are ready
    useEffect(() => {
        if (mount) {
            console.log('unmounting')
            setMount(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[location])

    useEffect(() => {
        if (!mount && articles.length > 0) {
            console.log('mounting')
            const timer = setTimeout(() => {
                setMount(true)
            },300)
            return () => clearTimeout(timer)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[articles])

    useEffect(() => {
        if (loadMore) {
            const after = Array.from(main.page.content.data.children.slice(-25));
            dispatch(fetchContent({
                limit: 25,
                url: props.page + 'top',
                after: after[after.length - 1].data.name
            }))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loadMore])

    window.onscroll = () => {
        const loadAt = document.getElementsByClassName('mainLoadMore');
        if (loadAt.length > 0 && main.page.url.includes(props.page + 'top') && !loadMore) {
            const loadPosition = loadAt[0].offsetTop - 400;
            const scrollPosition = window.scrollY + window.innerHeight;
            if (loadPosition <= scrollPosition && !main.page.allLoaded) {
                setLoadMore(true);
            }
        }
    }

    return (
        <div className='top'>
            {
                main.page.content && main.page.content.data && main.page.content.data.children ?

                main.page.content.data.children.map((article, index) => {
                    return (
                        <CSSTransition key={article.data.id + index} in={mount && main.page.content.data.children.length > 0 && !main.isLoading} timeout={300} classNames={'tran5'} mountOnEnter={true} unmountOnExit={true}>
                            <ContentTile i={index} article={article}/>
                        </CSSTransition>
                    )   
                }) : undefined
            }
            {main.isLoading ? <div className="mainLoading"><img className="loader" src={loader} alt='Loader' /><p>Loading...</p></div> : undefined}
            {main.page.allLoaded && !main.isLoading ? <p className="mainLoading">No more results.</p> : <div className="mainLoadMore"></div>}
        </div>
    )
}

export default Top;