import React, { useMemo } from 'react';
import './communities.css';
import { useSelector, useDispatch } from 'react-redux';
import { selectLogin } from '../LogIn/loginSlice';
import { selectMenu } from '../../containers/Menu/menuSlice';
import loader from '../../assets/loader.svg';
import reddit from '../../utilities/redditAPI';
import { search, selectCommunities, toggleBuild } from './communitiesSlice';
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
                    <li onClick={() => dispatch(toggleBuild())} className="communitiesDropdownListItem" data-test='communitiesListItem'>
                            <div className='communitiesDropdownListItemLeft'>
                                <svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24"><g><rect fill="none" height="24" width="24"/></g><g><g><rect height="8.48" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -6.8717 17.6255)" width="3" x="16.34" y="12.87"/><path d="M17.5,10c1.93,0,3.5-1.57,3.5-3.5c0-0.58-0.16-1.12-0.41-1.6l-2.7,2.7L16.4,6.11l2.7-2.7C18.62,3.16,18.08,3,17.5,3 C15.57,3,14,4.57,14,6.5c0,0.41,0.08,0.8,0.21,1.16l-1.85,1.85l-1.78-1.78l0.71-0.71L9.88,5.61L12,3.49 c-1.17-1.17-3.07-1.17-4.24,0L4.22,7.03l1.41,1.41H2.81L2.1,9.15l3.54,3.54l0.71-0.71V9.15l1.41,1.41l0.71-0.71l1.78,1.78 l-7.41,7.41l2.12,2.12L16.34,9.79C16.7,9.92,17.09,10,17.5,10z"/></g></g></svg>
                                <div>
                                    <p>
                                        Build a New Community
                                    </p>
                                </div>
                            </div>
                    </li>
                    {renderCommunities()}
                </ul>
            </div>
        </div>
    );
};

export default Communities;