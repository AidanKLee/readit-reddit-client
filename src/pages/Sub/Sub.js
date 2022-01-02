import React, { useEffect, useLayoutEffect, useState } from 'react';
import './sub.css';
import { useParams, Outlet, Link } from 'react-router-dom';
import reddit from '../../utilities/redditAPI';
import Categories from '../../components/Categories/Categories';
import { useDispatch } from 'react-redux';
import { setSelectedSubreddit } from '../../containers/Main/mainSlice';

const Sub = (props) => {

    const dispatch = useDispatch();
    
    const params = useParams();
    const subredditUrl = params.subredditId;

    dispatch(setSelectedSubreddit(subredditUrl));

    const [ subreddit, setSubreddit ] = useState({});
    const [ height, setHeight ] = useState({})

    useEffect(() => {
        const fetchData = async () => {
            const data = await reddit.fetchSubreddit(`r/${subredditUrl}`);
            const subreddit = {
                data: data.data,
            }
            setSubreddit(subreddit);
        }
        fetchData()
    }, [subredditUrl])

    useEffect(() => {
        if (!subreddit.recommended && subreddit.data) {
            const fetchRecommended = async (name) => {
                const data = await reddit.fetchSubredditSearch(name, 11, null, subreddit.data.over18);
                setSubreddit({
                    ...subreddit,
                    recommended: data.data.children.splice(1),
                })
            }
            fetchRecommended(subreddit.data.display_name)
        }
    },[subreddit])

    useEffect(() => {
        getHeight();
    },[subreddit.recommended])

    useLayoutEffect(() => {
        window.addEventListener('resize', getHeight);
        getHeight();
        return () => window.removeEventListener('resize', getHeight());
    },[])

    const backgroundColor = subreddit.data && subreddit.data.banner_background_color ? {backgroundColor: subreddit.data.banner_background_color} : {backgroundColor: 'rgb(13, 121, 168)'};

    const getTextColor = () => {
        let hexColor = backgroundColor.backgroundColor;

        const componentToHex = (c) => {
            var hex = c.toString(16);
            return hex.length === 1 ? "0" + hex : hex;
        }

        if (hexColor.toLowerCase().includes('rgb')) {
            hexColor = hexColor.replace(/[^\d,]/g, '').split(',');
            const [ r, g, b ] = hexColor;
            hexColor = "#" + componentToHex(parseInt(r)) + componentToHex(parseInt(g)) + componentToHex(parseInt(b));
            
        }

        hexColor = hexColor.replace("#", "");
        var r = parseInt(hexColor.substr(0,2),16);
        var g = parseInt(hexColor.substr(2,2),16);
        var b = parseInt(hexColor.substr(4,2),16);
        var yiq = ((r*299)+(g*587)+(b*114))/1000;
        return (yiq >= 128) ? {color: '#1f1f1f'} : {color: '#f1f1f1'};
    }

    const getBannerImg = () => {
        if (subreddit.data) {
            if (subreddit.data.banner_img) {
                return <img src={subreddit.data.banner_img} alt={subreddit.data.title + ' Banner'}/>
            } else if (subreddit.data.banner_background_image) {
                let url = subreddit.data.banner_background_image.split('?')[0]
                return <img src={url} alt={subreddit.data.title + ' Banner'}/>
            };
        };
    };

    const handleClick = () => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
        setSubreddit({})
    }

    const getHeight = () => {
        const element = document.getElementsByClassName('subContentRightRecommendedLinks')[0];
        const parent = document.getElementsByClassName('subContentRightSticky')[0];
        if (element) {
            const position = element.offsetTop;
            let height = (parent.offsetHeight - position).toString() + 'px';
            setHeight({height: height});
        }
    }

    const renderRecommended = () => {      
        if (subreddit.recommended) {
            return (
                <div className='subContentRightRecommended' style={backgroundColor}>
                    <p className='bold subContentRightRecommendedHeading' style={getTextColor()}>
                        Recommended
                    </p>
                    <div className='subContentRightRecommendedLinks' style={height}>
                        {
                            subreddit.recommended.map(sub => {
                                return (
                                    <div className='subContentRightRecommendedLink' key={sub.data.id}>
                                        <div className='subContentRightRecommendedLinkLeft'>
                                            <Link onClick={handleClick} to={`/${sub.data.display_name_prefixed.toLowerCase()}`}>
                                                {reddit.getIconImg(sub)}
                                            </Link>
                                            <div className='subContentRightRecommendedLinkData'>
                                                <Link onClick={handleClick} to={`/${sub.data.display_name_prefixed.toLowerCase()}`}><p className='subHeading bold'>{sub.data.display_name_prefixed} {sub.data.over18 ? <span className='blue'>NSFW</span> : undefined}</p></Link>
                                                <p className='subHeading'>{sub.data.subscribers} members</p>
                                            </div>
                                        </div>
                                        <button type='button'>Join</button>
                                    </div>                                    
                                )
                            })
                        }
                    </div>
                </div>
            )   
        }
    }

    return (
        <div className='sub'>
            <div className='subBanner' style={backgroundColor}>
                {getBannerImg()}
                <button type='button'>Join</button>
            </div>
            <div className='subBannerUnder'>
                <div className='subBannerUnderWrapper'>
                    {reddit.getIconImg(subreddit)}
                    <div className='subBannerUnderText'>
                        <h1>
                            {subreddit.data ? subreddit.data.title : undefined}
                        </h1>
                        <p>
                            {subreddit.data ? subreddit.data.url : undefined}
                        </p>
                    </div>
                </div>
            </div>
            <div className='subContent'>
                <div className='content'>
                    <Categories page={'/r/' + subredditUrl}/>
                    <Outlet/>
                </div>
                <div className='subContentRight'>
                    <div className='subContentRightSticky'>
                        <div className='subContentRightHeader' style={backgroundColor}>
                            {subreddit.data ? <p className='bold' style={getTextColor()}>{subreddit.data.title}</p> : undefined}
                            {subreddit.data ? <p className='subHeading' style={getTextColor()}>{subreddit.data.url}</p> : undefined}

                            <div className='subContentRightHeaderStats'>
                                <div>
                                    {subreddit.data ? <p className='heading bold' style={getTextColor()}>{subreddit.data.subscribers}</p> : undefined}
                                    <p className='subHeading' style={getTextColor()}>Followers</p>
                                </div>
                                <div>
                                    {subreddit.data ? <p className='heading bold' style={getTextColor()}>{subreddit.data.accounts_active}</p> : undefined}
                                    <p className='subHeading' style={getTextColor()}>Online</p>
                                </div>
                            </div>
                        </div>
                        <div className='subContentRightMain'>
                            <p className='bold'>
                                About
                            </p>
                            {subreddit.data ? <div><p className='paragraph'>{subreddit.data.public_description}</p></div> : undefined}
                        </div>
                        {renderRecommended()}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Sub;