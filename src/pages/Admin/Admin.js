import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import { selectLogin, setUpdate } from '../../components/LogIn/loginSlice';
import reddit from '../../utilities/redditAPI';
import './admin.css';
import Option from './Option';

const Admin = () => {

    const dispatch = useDispatch();

    const location = useLocation().pathname;
    const subredditName = useMemo(() => location.split('/')[2],[location]);

    const navigate = useNavigate();

    const login = useSelector(selectLogin);

    const [ firstLoad, setFirstLoad ] = useState(false);
    const [ account, setAccount ] = useState();
    const [ change, setChange ] = useState(false);
    const [ settingsType, setSettingsType ] = useState();

    const [ mount, setMount ] = useState(true);

    useEffect(() => {
        if (mount) {
            setMount(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[location])

    useEffect(() => {
        if (!mount && account) {
            setMount(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[account])

    const accountOptions = useMemo(() => {
        let optionsList = [];
        let newAccount = {...account}

        delete newAccount.content_options
        delete newAccount.default_set;
        delete newAccount.domain;
        delete newAccount.header_hover_text;
        delete newAccount.subreddit_id;

        for (const key in newAccount) {
            let keyArray = [ key, newAccount[key], typeof newAccount[key] ]
            if (key === 'key_color') {
                keyArray = [ ...keyArray, {type: 'color', description: 'Choose a theme colour for your subreddit.', style: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}]
            } else if (key === 'comment_score_hide_mins') {
                keyArray = [ ...keyArray, { newName: 'Comment Score Hide', type: 'number', min: 0, max: 1440, description: 'Hide comments with a score below this number. (0 - 1440)'}]
            } else if (key === 'hateful_content_threshold_identity' || key === 'hateful_content_threshold_abuse' || key === 'crowd_control_post_level' || key === 'crowd_control_chat_level' || key === 'crowd_control_level') {
                keyArray = [ ...keyArray, { type: 'range', min: 0, max: 3, style: {flexDirection: 'column', alignItems: 'flex-start'}}]
            } else if (key === 'prediction_leaderboard_entry_type') {
                keyArray = [ ...keyArray, { type: 'range', min: 0, max: 2, style: {flexDirection: 'column', alignItems: 'flex-start'}}]
            } else if (key === 'toxicity_threshold_chat_level') {
                keyArray = [ ...keyArray, { type: 'range', min: 0, max: 1, style: {flexDirection: 'column', alignItems: 'flex-start'}}]
            } else if (key === 'wiki_edit_age') {
                keyArray = [ ...keyArray, { type: 'number', min: 0, max: 36600, description: 'Account age (days) required to edit and create wiki pages (0 - 36,600)'}]
            } else if (key === 'wiki_edit_karma') {
                keyArray = [ ...keyArray, { type: 'number', min: 0, max: 1000000000, description: 'Subreddit karma required to edit and create wiki pages (0 - 1,000,000,000)'}]
            } else if (key === 'public_description') {
                keyArray = [ ...keyArray, { type: 'textarea', max: 500, newName: 'About', placeholder: 'About Your Subreddit... (Optional)', description: 'A brief description of your subreddit, shown on your profile. Appears in search results and social media links. (Optional)'}]
            } else if (key === 'description') {
                keyArray = [ ...keyArray, { type: 'textarea', max: 10240, placeholder: 'Description... (Optional)', description: 'An extended description of your subreddit. (Optional)'}]
            } else if (key === 'language') {
                keyArray = [ ...keyArray, { type: 'select', options: [`åarjelsaemiengiele`, `Afrikaans`, `Azərbaycan­ılı`, `Bahasa Indonesia`, `Bahasa Malaysia`, `bosanski/босански`, `brezhoneg`, `català`, `čeština`, `Corsu`, `Cymraeg`, `dansk`, `davvisámegiella`, `Deutsch`, `dolnoserbšćina`, `eesti`, `Elsässisch`, `English`, `español`, `euskara`, `Filipino`, `føroyskt`, `français`, `Frysk`, `Gaeilge`, `Gàidhlig`, `galego`, `Hausa`, `hornjoserbšćina`, `hrvatski`, `Igbo`, `Inuktitut /ᐃᓄᒃᑎᑐᑦ (ᑲᓇᑕ)`, `isiXhosa`, `isiZulu`, `íslenska`, `italiano`, `julevusámegiella`, `K'iche`, `kalaallisut`, `Kanien'kéha`, `Kinyarwanda`, `Kiswahili`, `latviešu`, `Lëtzebuergesch`, `lietuvių`, `magyar`, `Malti`, `Mapudungun`, `Myanmar`, `Nederlands`, `norsk`, `norsk (bokmål)`, `norsk (nynorsk)`, `Occitan`, `polski`, `Português`, `Reo Māori`, `română`, `Rumantsch`, `runasimi`, `sääm´ǩiõll`, `sämikielâ`, `Sesotho sa Leboa`, `Setswana`, `shqipe`, `slovenčina`, `slovenski`, `srpski/српски`, `suomi`, `svenska`, `Tamazight`, `Tiếng Việt`, `Türkçe`, `türkmençe`, `U'zbek/Ўзбек`, `Wolof`, `Yoruba`, `ελληνικά`, `Башҡорт`, `беларуская`, `български`, `Кыргыз`, `Қазащb`, `македонски јазик`, `Монгол хэл/ᠮᠤᠨᠭᠭᠤᠯ ᠬᠡᠯᠡ`, `русский`, `саха`, `Татар`, `Тоҷикӣ`, `українська`, `ქართული`, `Հայերեն`, `עברית`, `ئۇيغۇرچە`, `اُردو`, `العربية`, `پښتو`, `درى`, `فارسى`, `ܣܘܪܝܝܐ`, `ދިވެހިބަސް`, `አማርኛ`, `कोंकणी`, `नेपाली (नेपाल)`, `मराठी`, `संस्कृत`, `हिंदी`, `অসমীয়া`, `বাংলা`, `ਪੰਜਾਬੀ`, `ગુજરાતી`, `ଓଡ଼ିଆ`, `தமிழ்`, `తెలుగు`, `ಕನ್ನಡ`, `മലയാളം`, `සිංහ`, `ไทย`, `ລາວ`, `བོད་ཡིག`, `ខ្មែរ`, `한국어`, `ꆈꌠꁱꂷ`, `中文`, `日本語`], values: [`sma`, `af`, `az`, `id`, `ms`, `bs`, `br`, `ca`, `cs`, `co`, `cy`, `da`, `se`, `de`, `dsb`, `et`, `gsw`, `en`, `es`, `eu`, `fil`, `fo`, `fr`, `fy`, `ga`, `gd`, `gl`, `ha`, `hsb`, `hr`, `ig`, `iu`, `xh`, `zu`, `is`, `it`, `smj`, `qut`, `kl`, `moh`, `rw`, `sw`, `lv`, `lb`, `lt`, `hu`, `mt`, `arn`, `my`, `nl`, `no`, `nb`, `nn`, `oc`, `pl`, `pt`, `mi`, `ro`, `rm`, `quz`, `sms`, `smn`, `nso`, `tn`, `sq`, `sk`, `sl`, `sr`, `fi`, `sv`, `tzm`, `vi`, `tr`, `tk`, `uz`, `wo`, `yo`, `el`, `ba`, `be`, `bg`, `ky`, `kk`, `mk`, `mn`, `ru`, `sah`, `tt`, `tg`, `uk`, `ka`, `hy`, `he`, `ug`, `ur`, `ar`, `ps`, `prs`, `fa`, `syr`, `dv`, `am`, `kok`, `ne`, `mr`, `sa`, `hi`, `as`, `bn`, `pa`, `gu`, `or`, `ta`, `te`, `kn`, `ml`, `si`, `th`, `lo`, `bo`, `km`, `ko`, `ii`, `zh`, `ja`]}]
            } else if (key === 'spam_comments') {
                keyArray = [ ...keyArray, { newName: 'Allow Spam Comments', type: 'select', options: [ 'Some', 'Most', 'None' ], values: [ 'low', 'high', 'all' ]}]
            }  else if (key === 'spam_links') {
                keyArray = [ ...keyArray, { newName: 'Allow Spam Links', type: 'select', options: [ 'Some', 'Most', 'None' ], values: [ 'low', 'high', 'all' ]}]
            } else if (key === 'spam_selfposts') {
                keyArray = [ ...keyArray, { newName: 'Allow Spam Self Posts', type: 'select', options: [ 'Some', 'Most', 'None' ], values: [ 'low', 'high', 'all' ]}]
            } else if (key === 'suggested_comment_sort') {
                keyArray = [ ...keyArray, { newName: 'Suggested Comments Sorting', type: 'select', options: [ 'Confidence', 'Top', 'New', 'Controversial', 'Old', 'Random', 'Q&A', 'Live' ], values: [ 'confidence', 'top', 'new', 'controversial', 'old', 'random', 'qa', 'live' ]}]
            } else if (key === 'wikimode') {
                keyArray = [ ...keyArray, { type: 'select', description: 'Users that can edit your subreddits wiki.', options: [ 'Disabled', 'Only Moderators', 'Everyone' ], values: [ 'disabled', 'modonly', 'anyone' ]}]
            } else if (key === 'submit_link_label' || key === 'submit_text_label') {
                keyArray = [ ...keyArray, { type: 'text', max: 60, placeholder: `Enter your label text...`}]
            } else if (key === 'title') {
                keyArray = [ ...keyArray, { newName: 'Subreddit Name', type: 'text', max: 30, placeholder: `Enter your Subreddit Title...`}]
            } else if (key === 'submit_text') {
                keyArray = [ ...keyArray, { type: 'textarea', max: 500, placeholder: 'Sumbit Text... ', description: 'A message to be displayed to the user upon submit. (Optional)'}]
            } else if (key === 'subreddit_type') {
                keyArray = [ ...keyArray, { type: 'select', description: 'Restrict permissions to certain users.', options: [ 'Archived', 'Employees Only', 'Gold Only', 'Gold Restricted', 'Private', 'Public', 'Restricted' ], values: [ 'archived', 'employees_only', 'gold_only', 'gold_restricted', 'private', 'public', 'restricted' ]}]
            } else if (key === 'over_18') {
                keyArray = [ ...keyArray, { newName: 'NSFW Subreddit', description: 'The content on your subreddit is NSFW (may contain nudity, pornography, profanity or inappropriate content for those under 18).' }]
            } else if (key === 'allow_discovery') {
                keyArray = [ ...keyArray, { description: 'Show up in high-traffic feeds: Allow your community to be in r/all, r/popular, and trending lists where it can be seen by the general Reddit population.' }]
            } else if (key === 'allow_galleries') {
                keyArray = [ ...keyArray, { description: 'Allow people to post multiple images per post.' }]
            } else if (key === 'allow_images') {
                keyArray = [ ...keyArray, { description: 'Allow people to post images.' }]
            } else if (key === 'allow_polls') {
                keyArray = [ ...keyArray, { description: 'Allow people to post polls.' }]
            } else if (key === 'allow_videos') {
                keyArray = [ ...keyArray, { description: 'Allow people to post videos.' }]
            } else if (key === 'all_original_content') {
                keyArray = [ ...keyArray, { description: 'All content posted on your subreddit it original.' }]
            }  else if (key === 'new_pinned_post_pns_enabled') {
                keyArray = [ ...keyArray, { newName: 'New Pinned Post Enabled' }]
            } else if (key === 'user_flair_pns_enabled') {
                keyArray = [ ...keyArray, { newName: 'User Flair Enabled' }]
            } else if (key === 'welcome_message_text') {
                keyArray = [ ...keyArray, { type: 'textarea', max: 500, placeholder: `Enter your welcome message...`}]
            } else if (key === 'welcome_message_enabled') {
                keyArray = [ ...keyArray, { description: 'Send a message to a new user on subscription.' }]
            }
            optionsList = [...optionsList, keyArray]
        }
        optionsList.sort((a, b) => {
            if (a[0] < b[0]) { return -1 }
            if (a[0] > b[0]) { return 1 }
            return 0;
        })

        return optionsList;
        
    },[account])

    const communitySettings = useMemo(() => [46, 30, 19, 49, 50, 44, 28, 24, 25, 51, 52 ,53].map(i => accountOptions[i]),[accountOptions]) 
    const privacySettings = useMemo(() => [0, 3, 14, 15, 16, 17, 18, 20, 31, 37, 38, 39, 47].map(i => accountOptions[i]),[accountOptions])
    const postSettings = useMemo(() => [1, 2, 35, 36, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 21, 22, 23, 26, 27, 29, 32, 33, 34, 40, 41, 42, 43, 45, 48 ].map(i => accountOptions[i]),[accountOptions])

    useEffect(() => {
        if (login.initialLoginAttempt && !login.isLoading) {
            const fetchAccount = async () => {
                const account = await reddit.fetchAccountDetails(subredditName);
                
                if (account.error) {
                    navigate(`/r/${subredditName}`, {replace: true})
                } else {
                    setAccount(account.data);
                }
            }
            fetchAccount();
        }
    },[login, subredditName, navigate])

    useEffect(() => {
        if (!firstLoad && account && account.wikimode) {
            setFirstLoad(!firstLoad)
        }
        if (firstLoad && change) {
            setChange(false)
            const timeout = setTimeout(() => {
                submitNewSettings();
            },1000)

            return () => clearTimeout(timeout);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[account])

    const submitNewSettings = async () => {
        const newAccount = {
            ...account,
            admin_override_spam_comments: true,
            admin_override_spam_links: true,
            admin_override_spam_selfposts: true,
            allow_top: true,
            api_type: 'json',
            'g-recaptcha-response': '',
            'header-title': '',
            lang: account.language,
            link_type: 'any',
            name: subredditName,
            sr: account.subreddit_id,
            type: account.subreddit_type
        }
        delete newAccount.language;
        delete newAccount.default_set;
        delete newAccount.domain;
        delete newAccount.header_hover_text;
        delete newAccount.subreddit_id;
        delete newAccount.subreddit_type;

        let newSettings;

        if (settingsType === 2) {
            newSettings = await reddit.changeSubredditDetails(newAccount).then((r) => {
                dispatch(setUpdate())
                setSettingsType()
                return r
            });
        } else if (settingsType === 1) {
            newSettings = await reddit.changeAccountDetails(newAccount).then((r) => {
                dispatch(setUpdate())
                setSettingsType()
                return r
            });
        }
        
        console.log(newSettings)
        
    }

    const handleChange = (e) => {
        const name = e.target.name;
        let value = e.target.value;
        const toggle = value === 'on';
        const min = e.target.min;
        const max = e.target.max

        if(name === 'description' || name === 'subreddit_type' || name === 'public_traffic'  || name === 'spam_comments'  || name === 'spam_links'  || name === 'spam_selfposts' || name === 'hide_ads') {
            setSettingsType(1)
        } else {
            setSettingsType(2)
        }

        if (e.target.type === 'number') {
            if (Number(value) > max) {
                value = max;
                e.target.value = max;
            } else if (Number(value) < min) {
                value = min;
                e.target.value = min;
            } else {
                value = Number(value);
            }
        }

        if (!toggle) {
            setAccount({
                ...account,
                [name]: value
            })
        } else if (toggle) {
            value = e.target.checked
            // value ? value = 'on' : value ='off'
            setAccount({
                ...account,
                [name]: value
            })
        }
        setChange(true)
    }

    const renderOptions = () => {
        return (
            <ul className='adminOptionsList'>
                <p className='adminOptionsHeaders'>Subreddit & Community</p>
                    {
                        communitySettings.map(option => {
                            return (
                                <Option key={option[0]} handleChange={handleChange} option={option}/>
                            )
                                        
                        })
                    }
                    <p className='adminOptionsHeaders'>Privacy & Safety</p>
                    {
                        privacySettings.map(option => {
                            return (
                                <Option key={option[0]} handleChange={handleChange} option={option}/>
                            )
                                        
                        })
                    }
                    <p className='adminOptionsHeaders'>Posts, Comments & Content</p>
                    {
                        postSettings.map(option => {
                            return (
                                <Option key={option[0]} handleChange={handleChange} option={option}/>
                            )
                                        
                        })
                    }
                    {/* {
                        accountOptions.map(option => {
                            return (
                                <Option key={option[0]} handleChange={handleChange} option={option}/>
                            )
                                        
                        })
                    } */}
            </ul>
        )
    }

    return (
        <CSSTransition in={mount} timeout={300} classNames='tran9' mountOnEnter={true} unmountOnExit={true}>
            <div className='admin'>
                {communitySettings && communitySettings[0] ? renderOptions() : undefined}
            </div>
        </CSSTransition>
    )
}

export default Admin;