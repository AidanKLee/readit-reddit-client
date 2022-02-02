import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectLogin, setSettings } from "../../components/LogIn/loginSlice";
import loader from '../../assets/loader.svg';
import './settings.css';
import reddit from "../../utilities/redditAPI";
import { selectDarkMode, setDarkMode, toggleDayModeEnabled } from "../../components/DarkMode/darkModeSlice";

const Settings = () => {

    const dispatch = useDispatch();

    const login = useSelector(selectLogin);
    const darkMode = useSelector(selectDarkMode);

    const countryCodes = ['AF', 'AX', 'AL', 'DZ', 'AS', 'AD', 'AO', 'AI', 'AQ', 'AG', 'AR', 'AM', 'AW', 'AU', 'AT', 'AZ', 'BS', 'BH', 'BD', 'BB', 'BY', 'BE', 'BZ', 'BJ', 'BM', 'BT', 'BO', 'BQ', 'BA', 'BW', 'BV', 'BR', 'IO', 'BN', 'BG', 'BF', 'BI', 'CV', 'KH', 'CM', 'CA', 'KY', 'CF', 'TD', 'CL', 'CN', 'CX', 'CC', 'CO', 'KM', 'CG', 'CD', 'CK', 'CR', 'CI', 'HR', 'CU', 'CW', 'CY', 'CZ', 'DK', 'DJ', 'DM', 'DO', 'EC', 'EG', 'SV', 'GQ', 'ER', 'EE', 'SZ', 'ET', 'FK', 'FO', 'FJ', 'FI', 'FR', 'GF', 'PF', 'TF', 'GA', 'GM', 'GE', 'DE', 'GH', 'GI', 'GR', 'GL', 'GD', 'GP', 'GU', 'GT', 'GG', 'GN', 'GW', 'GY', 'HT', 'HM', 'VA', 'HN', 'HK', 'HU', 'IS', 'IN', 'ID', 'IR', 'IQ', 'IE', 'IM', 'IL', 'IT', 'JM', 'JP', 'JE', 'JO', 'KZ', 'KE', 'KI', 'KP', 'KR', 'KW', 'KG', 'LA', 'LV', 'LB', 'LS', 'LR', 'LY', 'LI', 'LT', 'LU', 'MO', 'MG', 'MW', 'MY', 'MV', 'ML', 'MT', 'MH', 'MQ', 'MR', 'MU', 'YT', 'MX', 'FM', 'MD', 'MC', 'MN', 'ME', 'MS', 'MA', 'MZ', 'MM', 'NA', 'NR', 'NP', 'NL', 'NC', 'NZ', 'NI', 'NE', 'NG', 'NU', 'NF', 'MK', 'MP', 'NO', 'OM', 'PK', 'PW', 'PS', 'PA', 'PG', 'PY', 'PE', 'PH', 'PN', 'PL', 'PT', 'PR', 'QA', 'RE', 'RO', 'RU', 'RW', 'BL', 'SH', 'KN', 'LC', 'MF', 'PM', 'VC', 'WS', 'SM', 'ST', 'SA', 'SN', 'RS', 'SC', 'SL', 'SG', 'SX', 'SK', 'SI', 'SB', 'SO', 'ZA', 'GS', 'SS', 'ES', 'LK', 'SD', 'SR', 'SJ', 'SE', 'CH', 'SY', 'TW', 'TJ', 'TZ', 'TH', 'TL', 'TG', 'TK', 'TO', 'TT', 'TN', 'TR', 'TM', 'TC', 'TV', 'UG', 'UA', 'AE', 'GB', 'US', 'UM', 'UY', 'UZ', 'VU', 'VE', 'VN', 'VG', 'VI', 'WF', 'EH', 'YE', 'ZM', 'ZW']
    const countries = [`Afghanistan`, `Åland Islands`, `Albania`, `Algeria`, `American Samoa`, `Andorra`, `Angola`, `Anguilla`, `Antarctica`, `Antigua and Barbuda`, `Argentina`, `Armenia`, `Aruba`, `Australia`, `Austria`, `Azerbaijan`, `Bahamas`, `Bahrain`, `Bangladesh`, `Barbados`, `Belarus`, `Belgium`, `Belize`, `Benin`, `Bermuda`, `Bhutan`, `Bolivia (Plurinational State of)`, `Bonaire, Sint Eustatius and Saba[d]`, `Bosnia and Herzegovina`, `Botswana`, `Bouvet Island`, `Brazil`, `British Indian Ocean Territory`, `Brunei Darussalam`, `Bulgaria`, `Burkina Faso`, `Burundi`, `Cabo Verde`, `Cambodia`, `Cameroon`, `Canada`, `Cayman Islands`, `Central African Republic`, `Chad`, `Chile`, `China`, `Christmas Island`, `Cocos (Keeling) Islands`, `Colombia`, `Comoros`, `Congo`, `Congo, Democratic Republic of the`, `Cook Islands`, `Costa Rica`, `Côte d'Ivoire`, `Croatia`, `Cuba`, `Curaçao`, `Cyprus`, `Czechia`, `Denmark`, `Djibouti`, `Dominica`, `Dominican Republic`, `Ecuador`, `Egypt`, `El Salvador`, `Equatorial Guinea`, `Eritrea`, `Estonia`, `Eswatini`, `Ethiopia`, `Falkland Islands (Malvinas)`, `Faroe Islands`, `Fiji`, `Finland`, `France`, `French Guiana`, `French Polynesia`, `French Southern Territories`, `Gabon`, `Gambia`, `Georgia`, `Germany`, `Ghana`, `Gibraltar`, `Greece`, `Greenland`, `Grenada`, `Guadeloupe`, `Guam`, `Guatemala`, `Guernsey`, `Guinea`, `Guinea-Bissau`, `Guyana`, `Haiti`, `Heard Island and McDonald Islands`, `Holy See`, `Honduras`, `Hong Kong`, `Hungary`, `Iceland`, `India`, `Indonesia`, `Iran (Islamic Republic of)`, `Iraq`, `Ireland`, `Isle of Man`, `Israel`, `Italy`, `Jamaica`, `Japan`, `Jersey`, `Jordan`, `Kazakhstan`, `Kenya`, `Kiribati`, `Korea (Democratic People's Republic of)`, `Korea, Republic of`, `Kuwait`, `Kyrgyzstan`, `Lao People's Democratic Republic`, `Latvia`, `Lebanon`, `Lesotho`, `Liberia`, `Libya`, `Liechtenstein`, `Lithuania`, `Luxembourg`, `Macao`, `Madagascar`, `Malawi`, `Malaysia`, `Maldives`, `Mali`, `Malta`, `Marshall Islands`, `Martinique`, `Mauritania`, `Mauritius`, `Mayotte`, `Mexico`, `Micronesia (Federated States of)`, `Moldova, Republic of`, `Monaco`, `Mongolia`, `Montenegro`, `Montserrat`, `Morocco`, `Mozambique`, `Myanmar`, `Namibia`, `Nauru`, `Nepal`, `Netherlands`, `New Caledonia`, `New Zealand`, `Nicaragua`, `Niger`, `Nigeria`, `Niue`, `Norfolk Island`, `North Macedonia`, `Northern Mariana Islands`, `Norway`, `Oman`, `Pakistan`, `Palau`, `Palestine, State of`, `Panama`, `Papua New Guinea`, `Paraguay`, `Peru`, `Philippines`, `Pitcairn`, `Poland`, `Portugal`, `Puerto Rico`, `Qatar`, `Réunion`, `Romania`, `Russian Federation`, `Rwanda`, `Saint Barthélemy`, `Saint Helena, Ascension and Tristan da Cunha`, `Saint Kitts and Nevis`, `Saint Lucia`, `Saint Martin (French part)`, `Saint Pierre and Miquelon`, `Saint Vincent and the Grenadines`, `Samoa`, `San Marino`, `Sao Tome and Principe`, `Saudi Arabia`, `Senegal`, `Serbia`, `Seychelles`, `Sierra Leone`, `Singapore`, `Sint Maarten (Dutch part)`, `Slovakia`, `Slovenia`, `Solomon Islands`, `Somalia`, `South Africa`, `South Georgia and South Sandwich Islands`, `South Sudan`, `Spain`, `Sri Lanka`, `Sudan`, `Suriname`, `Svalbard and Jan Mayen`, `Sweden`, `Switzerland`, `Syrian Arab Republic`, `Taiwan, Province of China`, `Tajikistan`, `Tanzania, United Republic of`, `Thailand`, `Timor-Leste`, `Togo`, `Tokelau`, `Tonga`, `Trinidad and Tobago`, `Tunisia`, `Turkey`, `Turkmenistan`, `Turks and Caicos Islands`, `Tuvalu`, `Uganda`, `Ukraine`, `United Arab Emirates`, `United Kingdom`, `United States of America`, `United States Minor Outlying Islands`, `Uruguay`, `Uzbekistan`, `Vanuatu`, `Venezuela (Bolivarian Republic of)`, `Viet Nam`, `Virgin Islands (British)`, `Virgin Islands (U.S.)`, `Wallis and Futuna`, `Western Sahara`, `Yemen`, `Zambia`, `Zimbabwe`]

    const [ updated, setUpdated ] = useState(false);


    useEffect(() => {
        if (updated) {
            const timer = setTimeout(() => {
                setUpdated(false)
            },[3000])
            return () => clearTimeout(timer)
        }
    },[updated])

    useEffect(() => {
        if (login.initialLoginAttempt && darkMode.darkMode !== login.authorization.settings.nightmode)
        document.getElementById('darkMode').checked = darkMode.darkMode
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[darkMode.darkMode, login.initialLoginAttempt])

    const handleCheck = async (e) => {
        const name = e.target.name;
        const value = e.target.checked;

        if (name === 'over_18') {
            document.getElementById('over18Search').checked = value
        }

        if (name === 'nightmode') {
            dispatch(setDarkMode(value))
            localStorage.setItem('darkMode', value)
        }

        if (name === 'dayMode') {
            localStorage.setItem('dayModeEnabled', !darkMode.dayModeEnabled)
            return dispatch(toggleDayModeEnabled())
        }

        const settings = await reddit.patchAccountSettings({
            [name]: value
        });
        
        dispatch(setSettings(settings));
        setUpdated(true);
    }

    const handleSelect = async (e) => {
        const name = e.target.name;
        let value = e.target.value;
        if (!isNaN(Number(value))) {
            if (Number(value) > 100) {
                value = 100;
                e.target.value = 100;
            } else if (Number(value) < -100) {
                value = -100;
                e.target.value = -100;
            } else {
                value = Number(value);
            }
        }

        const settings = await reddit.patchAccountSettings({
            [name]: value
        });
        dispatch(setSettings(settings));
        setUpdated(true);
    }

    return (
        <div className="settings">
            <div className="settingsTop">
                <p className="settingsHeading">
                    Settings
                </p>
                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19.43 12.98c.04-.32.07-.64.07-.98 0-.34-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.09-.16-.26-.25-.44-.25-.06 0-.12.01-.17.03l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.06-.02-.12-.03-.18-.03-.17 0-.34.09-.43.25l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98 0 .33.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.09.16.26.25.44.25.06 0 .12-.01.17-.03l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.06.02.12.03.18.03.17 0 .34-.09.43-.25l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zm-1.98-1.71c.04.31.05.52.05.73 0 .21-.02.43-.05.73l-.14 1.13.89.7 1.08.84-.7 1.21-1.27-.51-1.04-.42-.9.68c-.43.32-.84.56-1.25.73l-1.06.43-.16 1.13-.2 1.35h-1.4l-.19-1.35-.16-1.13-1.06-.43c-.43-.18-.83-.41-1.23-.71l-.91-.7-1.06.43-1.27.51-.7-1.21 1.08-.84.89-.7-.14-1.13c-.03-.31-.05-.54-.05-.74s.02-.43.05-.73l.14-1.13-.89-.7-1.08-.84.7-1.21 1.27.51 1.04.42.9-.68c.43-.32.84-.56 1.25-.73l1.06-.43.16-1.13.2-1.35h1.39l.19 1.35.16 1.13 1.06.43c.43.18.83.41 1.23.71l.91.7 1.06-.43 1.27-.51.7 1.21-1.07.85-.89.7.14 1.13zM12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/></svg>
            </div>
            
            {
                login.authorization && login.authorization.settings ? 
                <div className="settingsSelect">
                    <p className="settingsSubHeading">General</p>
                    <div className="settingsItemToggle">
                        <label htmlFor="acceptPms">
                            <p>Accept Private Messages</p>
                        </label>
                        <label className="switch">
                            <input onClick={handleCheck} type='checkbox' name='accept_pms' id='acceptPms' defaultChecked={login.authorization.settings.accept_pms}/>
                            <span className="slider"></span>
                        </label>
                    </div>
                    <div className="settingsItemSelect">
                        <label htmlFor='country'><p>Country:</p></label>
                        <select onChange={handleSelect} name="country_code" id="country" defaultValue={login.authorization.settings.country_code}>
                            {
                                countryCodes.map((code, i) => {
                                    return <option key={countries[i]} value={code}>{countries[i]}</option>
                                })
                            }
                        </select>
                    </div>
                    <div className="settingsItemSelect">
                        <label htmlFor='sortComments'><p>Sort Comments By:</p></label>
                        <select onChange={handleSelect} name="default_comment_sort" id="sortComments" defaultValue={login.authorization.settings.default_comment_sort}>
                            <option value='confidence'>Confidence</option>
                            <option value='top'>Top</option>
                            <option value='new'>New</option>
                            <option value='controversial'>Controversial</option>
                            <option value='old'>Old</option>
                            <option value='random'>Random</option>
                            <option value='qa'>Questions & Answers</option>
                            <option value='live'>Live</option>
                        </select>
                    </div>
                    <div className="settingsItemToggle">
                        <label htmlFor='enableFollowers'>
                            <p>Enable Followers</p>
                        </label>
                        <label className="switch">
                            <input onClick={handleCheck} type='checkbox' name='enable_followers' id='enableFollowers' defaultChecked={login.authorization.settings.enable_followers}/>
                            <span className="slider"></span>
                        </label>
                    </div>
                    <div className="settingsItemToggle">
                            <label htmlFor="legacySearch">
                                <p>Enable Legacy Search</p>
                            </label>
                        <label className="switch">
                            <input onClick={handleCheck} type='checkbox' name='legacy_search' id='legacySearch' defaultChecked={login.authorization.settings.legacy_search}/>
                            <span className="slider"></span>
                        </label>
                    </div>
                    <div className="settingsItemToggle">
                        <label htmlFor="minLinkScore">
                            <p>Minimum Link Score</p>
                        </label>
                        <input onChange={handleSelect} type='number' name='min_link_score' id='minLinkScore' min='-100' max='100' defaultValue={login.authorization.settings.min_link_score}/>
                    </div>
                    <div className="settingsItemToggle">
                        <label htmlFor="minCommentScore">
                            <p>Minimum Comment Score</p>
                        </label>
                        <input onChange={handleSelect} type='number' name='min_comment_score' id='minCommentScore' min='-100' max='100' defaultValue={login.authorization.settings.min_comment_score}/>
                    </div>
                    <div className="settingsItemToggle">
                        <label htmlFor="darkMode">
                            <p>Dark Mode</p>
                            <p>Enables the alternate 'Dark Mode' colour scheme.</p>
                        </label>
                        <label className="switch">
                            <input onClick={handleCheck} type='checkbox' name='nightmode' id='darkMode' defaultChecked={login.authorization.settings.nightmode}/>
                            <span className="slider"></span>
                        </label>
                    </div>
                    <div className="settingsItemToggle">
                        <label htmlFor="dayMode">
                            <p>Day Mode</p>
                            <p>Your theme changes depending on the time of day.</p>
                        </label>
                        <label className="switch">
                            <input onClick={handleCheck} type='checkbox' name='dayMode' id='dayMode' defaultChecked={darkMode.dayModeEnabled}/>
                            <span className="slider"></span>
                        </label>
                    </div>
                    <div className="settingsItemToggle">
                        <label htmlFor="over18">
                            <p>NSFW Content</p>
                            <p>Allows you to view NSFW content with no restrictions.</p>
                        </label>
                        <label className="switch">
                            <input onClick={handleCheck} type='checkbox' name='over_18' id='over18' defaultChecked={login.authorization.settings.over_18}/>
                            <span className="slider"></span>
                        </label>
                    </div>
                    <div className="settingsItemToggle">
                        <label htmlFor="over18Search">
                            <p>NSFW Search</p>
                            <p>Enables NSFW search results to appear.</p>
                        </label>
                        <label className="switch">
                            <input onClick={handleCheck} type='checkbox' name='search_include_over_18' id='over18Search' defaultChecked={login.authorization.settings.search_include_over_18}/>
                            <span className="slider"></span>
                        </label>
                    </div>
                    <div className="settingsItemToggle">
                        <label htmlFor="privateFeeds">
                            <p>Private Feeds</p>
                        </label>
                        <label className="switch">
                            <input onClick={handleCheck} type='checkbox' name='private_feeds' id='privateFeeds' defaultChecked={login.authorization.settings.private_feeds}/>
                            <span className="slider"></span>
                        </label>
                    </div>
                    <div className="settingsItemToggle">
                        <label htmlFor="showTrending">
                            <p>Show Trending</p>
                        </label>
                        <label className="switch">
                            <input onClick={handleCheck} type='checkbox' name='show_trending' id='showTrending' defaultChecked={login.authorization.settings.show_trending}/>
                            <span className="slider"></span>
                        </label>
                    </div>
                    <div className="settingsItemToggle">
                        <label htmlFor="videoAutoPlay">
                            <p>Video Autoplay</p>
                        </label>
                        <label className="switch">
                            <input onClick={handleCheck} type='checkbox' name='video_autoplay' id='videoAutoPlay' defaultChecked={login.authorization.settings.video_autoplay}/>
                            <span className="slider"></span>
                        </label>
                    </div>
                    

                    <p className="settingsSubHeading">E-Mail Notifications</p>
                    <div className="settingsItemToggle">
                        <label htmlFor="chatRequests">
                            <p>Chat Requests</p>
                        </label>
                        <label className="switch">
                            <input onClick={handleCheck} type='checkbox' name='email_chat_request' id='chatRequests' defaultChecked={login.authorization.settings.email_chat_request}/>
                            <span className="slider"></span>
                        </label>
                    </div>
                    <div className="settingsItemToggle">
                        <label htmlFor="commentReply">
                            <p>Comment Reply</p>
                        </label>
                        <label className="switch">
                            <input onClick={handleCheck} type='checkbox' name='email_comment_reply' id='commentReply' defaultChecked={login.authorization.settings.email_comment_reply}/>
                            <span className="slider"></span>
                        </label>
                    </div>
                    <div className="settingsItemToggle">
                        <label htmlFor="communityDiscovery">
                            <p>Community Discovery</p>
                        </label>
                        <label className="switch">
                            <input onClick={handleCheck} type='checkbox' name='email_community_discovery' id='communityDiscovery' defaultChecked={login.authorization.settings.email_community_discovery}/>
                            <span className="slider"></span>
                        </label>
                    </div>
                    <div className="settingsItemToggle">
                        <label htmlFor="digests">
                            <p>Digests</p>
                        </label>
                        <label className="switch">
                            <input onClick={handleCheck} type='checkbox' name='email_digests' id='digests' defaultChecked={login.authorization.settings.email_digests}/>
                            <span className="slider"></span>
                        </label>
                    </div>
                    <div className="settingsItemToggle">
                        <label htmlFor="messages">
                            <p>Messages</p>
                        </label>
                        <label className="switch">
                            <input onClick={handleCheck} type='checkbox' name='email_messages' id='messages' defaultChecked={login.authorization.settings.email_messages}/>
                            <span className="slider"></span>
                        </label>
                    </div>
                    <div className="settingsItemToggle">
                        <label htmlFor="newFollower">
                            <p>New Follower</p>
                        </label>
                        <label className="switch">
                            <input onClick={handleCheck} type='checkbox' name='email_user_new_follower' id='newFollower' defaultChecked={login.authorization.settings.email_user_new_follower}/>
                            <span className="slider"></span>
                        </label>
                    </div>
                    <div className="settingsItemToggle">
                        <label htmlFor="newUserWelcome">
                            <p>New User Welcome</p>
                        </label>
                        <label className="switch">
                            <input onClick={handleCheck} type='checkbox' name='email_new_user_welcome' id='newUserWelcome' defaultChecked={login.authorization.settings.email_new_user_welcome}/>
                            <span className="slider"></span>
                        </label>
                    </div>
                    <div className="settingsItemToggle">
                        <label htmlFor="postReply">
                            <p>Post Reply</p>
                        </label>
                        <label className="switch">
                            <input onClick={handleCheck} type='checkbox' name='email_post_reply' id='postReply' defaultChecked={login.authorization.settings.email_post_reply}/>
                            <span className="slider"></span>
                        </label>
                    </div>
                    <div className="settingsItemToggle">
                        <label htmlFor="privateMessage">
                            <p>Private Message</p>
                        </label>
                        <label className="switch">
                            <input onClick={handleCheck} type='checkbox' name='email_private_message' id='privateMessage' defaultChecked={login.authorization.settings.email_private_message}/>
                            <span className="slider"></span>
                        </label>
                    </div>
                    <div className="settingsItemToggle">
                        <label htmlFor="unsubscribeAll">
                            <p>Unsubscribe All</p>
                        </label>
                        <label className="switch">
                            <input onClick={handleCheck} type='checkbox' name='email_unsubscribe_all' id='unsubscribeAll' defaultChecked={login.authorization.settings.email_unsubscribe_all}/>
                            <span className="slider"></span>
                        </label>
                    </div>
                    <div className="settingsItemToggle">
                        <label htmlFor="upvotePost">
                            <p>Upvote Post</p>
                        </label>
                        <label className="switch">
                            <input onClick={handleCheck} type='checkbox' name='email_upvote_post' id='upvotePost' defaultChecked={login.authorization.settings.email_upvote_post}/>
                            <span className="slider"></span>
                        </label>
                    </div>
                    <div className="settingsItemToggle">
                        <label htmlFor="upvoteComment">
                            <p>Upvote Comment</p>
                        </label>
                        <label className="switch">
                            <input onClick={handleCheck} type='checkbox' name='email_upvote_comment' id='upvoteComment' defaultChecked={login.authorization.settings.email_upvote_comment}/>
                            <span className="slider"></span>
                        </label>
                    </div>
                    <div className="settingsItemToggle">
                        <label htmlFor="usernameMention">
                            <p>Username Mention</p>
                        </label>
                        <label className="switch">
                            <input onClick={handleCheck} type='checkbox' name='email_username_mention' id='usernameMention' defaultChecked={login.authorization.settings.email_username_mention}/>
                            <span className="slider"></span>
                        </label>
                    </div>                    
                </div>
                : undefined
            }
            <div className='updateWarning' style={updated ? {bottom: '32px'} : {}}>
                <svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24"><g><rect fill="none" height="24" width="24"/></g><g><g><path d="M11,8v5l4.25,2.52l0.77-1.28l-3.52-2.09V8H11z M21,10V3l-2.64,2.64C16.74,4.01,14.49,3,12,3c-4.97,0-9,4.03-9,9 s4.03,9,9,9s9-4.03,9-9h-2c0,3.86-3.14,7-7,7s-7-3.14-7-7s3.14-7,7-7c1.93,0,3.68,0.79,4.95,2.05L14,10H21z"/></g></g></svg>
                <p>Changes Saved</p>
            </div>  
            {login.isLoading ? <div className="mainLoading"><img className="loader" src={loader} alt='Loader' /><p>Loading...</p></div> : undefined}
            
        </div>
    )
}

export default Settings;