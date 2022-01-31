import React, { useMemo } from 'react';
import './communities.css';
import { useSelector, useDispatch } from 'react-redux';
import { selectLogin } from '../LogIn/loginSlice';
import { selectMenu } from '../../containers/Menu/menuSlice';
import loader from '../../assets/loader.svg';
import reddit from '../../utilities/redditAPI';
import { search, selectCommunities } from './communitiesSlice';
import { Link } from 'react-router-dom';
import { returnToTop } from '../../utilities/functions';
import Subscribe from '../Subscribe/Subscribe';

const Communities = (props) => {

    const dispatch = useDispatch();

    const { hasButtons, moderated } = props;

    const login = useSelector(selectLogin);
    const menu = useSelector(selectMenu);
    const communities = useSelector(selectCommunities);

    const moderatedNames = useMemo(() => login.authorization && login.authorization.moderated ? login.authorization.moderated.map(subreddit => subreddit.name) : [],[login])

    const handleChange = (e) => {
        dispatch(search(e.target.value));
    }

    const renderCommunities = () => {
        if (login.authorization && login.authorization.communities && login.authorization.communities.data && login.authorization.communities.data.children) {
            let communitiesCopy = login.authorization.communities.data.children.slice();

            if (moderated) {
                communitiesCopy = communitiesCopy.filter(community => {
                    let match = false;
                    moderatedNames.forEach(name => {
                        if (community.data.name === name) {
                            match = true;
                        }
                    })
                    return match
                })
            }

            communitiesCopy = communitiesCopy.filter(community => community.data.display_name.toLowerCase().includes(communities.search.toLowerCase()))
                
            communitiesCopy = communitiesCopy.sort((a, b) => {
                let nameA = a.data.display_name.toUpperCase();
                let nameB = b.data.display_name.toUpperCase();
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }
                return 0;
            });

            return communitiesCopy.map(community => {
                return (
                    
                    <li key={community.data.id} className="communitiesDropdownListItem" data-test='communitiesListItem'>
                        <Link onClick={(e) => returnToTop(e)} to={'/' + community.data.display_name_prefixed}>
                            <div className='communitiesDropdownListItemLeft'>
                                {reddit.getIconImg(community)}
                                <div>
                                    <p>
                                    {community.data.display_name_prefixed}
                                    </p>
                                    <p>
                                        {community.data.subscribers} Subscribers
                                    </p>
                                </div>
                            </div>
                        </Link>
                        {hasButtons ? <Subscribe moderated={moderated} text='Join' name={community.data.name} subreddit={community} /> : undefined}
                    </li>

                    
                )
            });
        };
    };

    const returnHeight = () => {
        if (login.authorization && menu.menuOpen && login.isLoading) {
            const top = document.getElementsByClassName('communitiesDropdownList')[1].offsetTop;
            const windowHeight = window.innerHeight;
            let height = windowHeight - top;
            return height + 'px';
        } else if (login.authorization && menu.menuOpen && login.isLoading) {
            const top = document.getElementsByClassName('communitiesDropdownList')[1].offsetTop;
            const windowHeight = window.innerHeight;
            let height = windowHeight - top;
            return height + 'px';
        }

        return '';
    };


    return (
        <div className='communities'>
            <div className='communitiesWrapper'>
                {!login.isLoading ? <svg className='communitiesSvg' data-test='communitiesSvgs' xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24"><rect fill="none" height="24" width="24"/><g><path d="M4,13c1.1,0,2-0.9,2-2c0-1.1-0.9-2-2-2s-2,0.9-2,2C2,12.1,2.9,13,4,13z M5.13,14.1C4.76,14.04,4.39,14,4,14 c-0.99,0-1.93,0.21-2.78,0.58C0.48,14.9,0,15.62,0,16.43V18l4.5,0v-1.61C4.5,15.56,4.73,14.78,5.13,14.1z M20,13c1.1,0,2-0.9,2-2 c0-1.1-0.9-2-2-2s-2,0.9-2,2C18,12.1,18.9,13,20,13z M24,16.43c0-0.81-0.48-1.53-1.22-1.85C21.93,14.21,20.99,14,20,14 c-0.39,0-0.76,0.04-1.13,0.1c0.4,0.68,0.63,1.46,0.63,2.29V18l4.5,0V16.43z M16.24,13.65c-1.17-0.52-2.61-0.9-4.24-0.9 c-1.63,0-3.07,0.39-4.24,0.9C6.68,14.13,6,15.21,6,16.39V18h12v-1.61C18,15.21,17.32,14.13,16.24,13.65z M8.07,16 c0.09-0.23,0.13-0.39,0.91-0.69c0.97-0.38,1.99-0.56,3.02-0.56s2.05,0.18,3.02,0.56c0.77,0.3,0.81,0.46,0.91,0.69H8.07z M12,8 c0.55,0,1,0.45,1,1s-0.45,1-1,1s-1-0.45-1-1S11.45,8,12,8 M12,6c-1.66,0-3,1.34-3,3c0,1.66,1.34,3,3,3s3-1.34,3-3 C15,7.34,13.66,6,12,6L12,6z"/></g></svg> : undefined}
                {login.isLoading ? <img className="loader" src={loader} alt='Loader' /> : undefined}
                {!login.isLoading ? <svg className='communitiesExpand' data-test='communitiesSvgs' xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M24 24H0V0h24v24z" fill="none" opacity=".87"/><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6-1.41-1.41z"/></svg> : undefined}
            </div>
            <div className='communitiesDropdown'>
                <input onChange={handleChange} value={communities.search} type='search' placeholder="Search Communities..." data-test='communitiesInput'/>
                <ul className='communitiesDropdownList' style={menu.menuOpen && login.isLoading ? {height: ''} : {height: returnHeight()}} data-test='communitiesList'>
                    {renderCommunities()}
                </ul>
            </div>
        </div>
    );
};

export default Communities;