import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { CSSTransition } from 'react-transition-group';
import reddit from '../../utilities/redditAPI';
import { toggleBuild } from '../Communities/communitiesSlice';
import './build.css';

const Build = (props) => {

    const dispatch = useDispatch();

    const [ settings, setSettings] = useState({
        accept_followers: true,
        admin_override_spam_comments: true,
        admin_override_spam_links: true,
        admin_override_spam_selfposts: true,
        all_original_content: false,
        allow_chat_post_creation: true,
        allow_discovery: true,
        allow_galleries: true,
        allow_images: true,
        allow_polls: true,
        allow_post_crossposts: true,
        allow_prediction_contributors: false,
        allow_predictions: false,
        allow_predictions_tournament: false,
        allow_top: true,
        allow_videos: true,
        api_type: 'json',
        collapse_deleted_comments: false,
        comment_score_hide_mins: 0,
        content_options: "any",
        crowd_control_chat_level: 3,
        crowd_control_filter: false,
        crowd_control_level: 0,
        crowd_control_mode: false,
        crowd_control_post_level: 0,
        description: "",
        disable_contributor_requests: false,
        exclude_banned_modqueue: false,
        free_form_reports: false,
        'g-recaptcha-response': '',
        'header-title': '',
        hide_ads: false,
        key_color: "",
        language: "en",
        link_type: 'any',
        name: '',
        new_pinned_post_pns_enabled: true,
        original_content_tag_enabled: true,
        over_18: false,
        prediction_leaderboard_entry_type: 1,
        public_description: "",
        public_traffic: false,
        restrict_commenting: false,
        restrict_posting: true,
        should_archive_posts: false,
        show_media: true,
        show_media_preview: true,
        spam_comments: "low",
        spam_links: "high",
        spam_selfposts: "high",
        spoilers_enabled: true,
        submit_link_label: "",
        submit_text: "",
        submit_text_label: "",
        suggested_comment_sort: null,
        title: "",
        toxicity_threshold_chat_level: 1,
        type: "public",
        user_flair_pns_enabled: true,
        welcome_message_enabled: false,
        welcome_message_text: "",
        wiki_edit_age: 0,
        wiki_edit_karma: 100,
        wikimode: "disabled"
    })

    const [ warning, setWarning ] = useState();
    const [ failed, setFailed ] = useState(false);

    const [ after, setAfter ] = props.after;

    useEffect(() => {
        if (settings.name.length === 0) {
            setWarning('A community name is required.')
        } else if (settings.name.length < 3 && settings.name.length > 0) {
            setWarning('The community name must be at least 3 characters.')
        } else if (settings.name.includes(' ')) {
            setWarning('The community name cannot contain spaces.')
        } else if (settings.name.match(/[ `!@#$%^&*()+\-=[\]{};':"\\|,.<>/?~]/)) {
            setWarning('The community name cannot contain special characters apart from underscore "_".')
        } else {
            setWarning('')
        }

        setSettings({
            ...settings,
            title: settings.name
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[settings.name])

    useEffect(() => {
        const page = document.documentElement;
        page.style.overflow = 'hidden'
        return () => page.style.overflow = 'auto'
    },[])

    const handleChange = (e) => {
        const name = e.target.name;
        let value = e.target.value;
        const toggle = value === 'on';
        if (!toggle) {
            setSettings({
                ...settings,
                [name]: value
            })
        } else if (toggle) {
            value = e.target.checked
            setSettings({
                ...settings,
                [name]: value
            })
        }
    }

    const handleCancel = () => {
        // dispatch(toggleBuild());
        setAfter(false)
    }

    const handleSubmit = async () => {
        if (warning.length > 0) {
            return setFailed(true)
        }
        
        const newSubreddit = await reddit.changeAccountDetails(settings);

        if (newSubreddit.json && newSubreddit.json.errors && newSubreddit.json.errors[0]) {
            const errorMessage = newSubreddit.json.errors[0][1]
            setWarning(errorMessage.slice(0, 1).toUpperCase() + errorMessage.slice(1) + '.')
        }
    }

    return (
        <div className='build'>
            <CSSTransition in={after} timeout={500} classNames={'tran3'} mountOnEnter={true} unmountOnExit={true} onExited={() => dispatch(toggleBuild())}>
                <div className='buildWrapper'>
                    <div className='buildContent'>
                        <p className='buildHeader'>
                            Build a Community
                        </p>
                        <div className='buildName'>
                            <label htmlFor='buildName'>
                                <p className='buildSubHeader'>Name *</p>
                                <p className='buildHint'>Community names cannot be changed after initial creation. Names cannot have spaces, must be 3 - 21 characters and the only allowed special character is an underscore "_". Do not use trademarked name.</p>
                            </label>
                            <div className='buildNameInput'>
                                <input onChange={handleChange} type='text' id='buildName' minLength={3} maxLength={21} name='name' value={settings.name} style={failed && warning ? {outline: '2px solid var(--sec1)'} : {}}/>
                                <p className='buildNameInputR'>r/</p>
                            </div>
                            <p className='buildCount'>{21 - settings.name.length} characters remaining.</p>
                            {warning ? <p className='buildWarning'>{warning}</p> : undefined}
                        </div>
                        <div className='buildName'>
                            <label htmlFor='buildName'>
                                <p className='buildSubHeader'>Type</p>
                                <p className='buildHint'>The visibility and interactivity of your community to other users.</p>
                            </label>
                            <select onChange={handleChange} name='type' id='type' value={settings.type}>
                                <option value='public'>Public</option>
                                <option value='restricted'>Restricted</option>
                                <option value='private'>Private</option>
                            </select>
                            <p className='buildHint blue'>
                                {settings.type === 'public' ? 'Anyone can view, post, and comment to this community.' : undefined}
                                {settings.type === 'restricted' ? 'Anyone can view this community, but only approved users can post.' : undefined}
                                {settings.type === 'private' ? 'Only approved users can view and submit to this community.' : undefined}
                            </p>
                        </div>
                        <div className='buildName spaceBetween'>
                            <label htmlFor='buildName'>
                                <p className='buildSubHeader'>NSFW Content (18+)</p>
                                <p className='buildHint'>
                                    {
                                        settings.over_18 ? 
                                        <span>The content on your profile <strong>IS NSFW</strong> (may contain nudity, pornography, profanity or inappropriate content for those under 18).'</span>
                                        :
                                        <span>'The content on your profile <strong>IS NOT NSFW</strong> (does not contain nudity, pornography, profanity or inappropriate content for those under 18).</span>
                                    }
                                </p>
                            </label>
                            <label className="switch">
                                <input onClick={handleChange} type='checkbox' name='over_18' id='over_18' defaultChecked={settings.over_18}/>
                                <span className="slider"></span>
                            </label>
                        </div>
                        <div className='buildActions'>
                            <button onClick={handleSubmit}>Submit</button>
                            <button onClick={handleCancel} className='red'>Cancel</button>
                        </div>
                    </div>
                </div>
            </CSSTransition>
        </div>
    )
}

export default Build;