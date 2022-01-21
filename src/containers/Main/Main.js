import React, { useEffect } from "react";
import './main.css';
import { useSelector } from 'react-redux';
import { selectMenu } from "../Menu/menuSlice";
// import { selectMain } from "./mainSlice";
// import loader from '../../assets/loader.svg';
import Home from "../../pages/Home/Home";
import All from '../../pages/All/All';
import Popular from '../../pages/Popular/Popular';
import Sub from '../../pages/Sub/Sub';
import User from '../../pages/User/User';
import Best from '../../pages/categories/Best/Best';
import Hot from '../../pages/categories/Hot/Hot';
import New from '../../pages/categories/New/New';
import Top from '../../pages/categories/Top/Top';
import Rising from '../../pages/categories/Rising/Rising';
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Post from "../../pages/Post/Post";
import Search from "../../pages/Search/Search";
import Settings from "../../pages/Settings/Settings";
import Account from "../../pages/Account/Account";

const Main = () => {

    const menu = useSelector(selectMenu);

    const selected = useLocation().pathname.split('/').slice(2).join('/');
    const redirect = useLocation().pathname.split('/')[2];
    const location = useLocation().pathname;

    useEffect(() => {
        let page = location;
        const title = 'Readit';
        if (page.length === 1) {
            page = ': Home';
        }  else {
            page = page.split('/');
            page = page.slice(1);
            if (page[0] === 'u' || page[0] === 'r') {
                page = page.slice(1);
            }
            page = page.map(word => {
                let string = word.slice(0)
                string = string.substring(0, 1).toUpperCase() + string.substring(1);
                return string;
            })
            if (page.length > 3 && page[1] === 'Comments') {
                page = `: ${page[0]} - ${page[3]}`
            } else if (page[0] === 'Callback') {
                page = `: Home`;
            } else {
                page.length > 1 ? page = ': ' + page.join(' - ') : page = ': ' + page.join('')
            }
        }
        document.title = title + page
    },[location])
        
    return (
        <main className={menu.menuOpen ? 'blur' : ''}>
            <div className="mainWrapper">
                
                <Routes>
                    <Route path={'/'} element={<Home />}>
                        <Route path={''} element={<Best location={location} page={''}/>}/>
                        <Route path={'callback'} element={<Best location={location} page={''}/>}/>
                        <Route path={'hot'} element={<Hot location={location} page={''}/>}/>
                        <Route path={'new'} element={<New location={location} page={''}/>}/>
                        <Route path={'top'} element={<Top location={location} page={''}/>}/>
                        <Route path={'rising'} element={<Rising location={location} page={''}/>}/>
                        <Route path={'*'} element={<Navigate replace to={`/`}/>}/>
                    </Route>

                    <Route path={'/all'} element={<All />}>
                        <Route path={''} element={<Best location={location} page={'r/all/'}/>}/>
                        <Route path={'/all/hot'} element={<Hot location={location} page={'r/all/'}/>}/>
                        <Route path={'/all/new'} element={<New location={location} page={'r/all/'}/>}/>
                        <Route path={'/all/top'} element={<Top location={location} page={'r/all/'}/>}/>
                        <Route path={'/all/rising'} element={<Rising location={location} page={'r/all/'}/>}/>
                        <Route path={'*'} element={<Navigate replace to={`/all`}/>}/>
                    </Route>

                    <Route path={'/popular'} element={<Popular />}>
                        <Route path={''} element={<Best location={location} page={'r/popular/'}/>}/>
                        <Route path={'/popular/hot'} element={<Hot location={location} page={'r/popular/'}/>}/>
                        <Route path={'/popular/new'} element={<New location={location} page={'r/popular/'}/>}/>
                        <Route path={'/popular/top'} element={<Top location={location} page={'r/popular/'}/>}/>
                        <Route path={'/popular/rising'} element={<Rising location={location} page={'r/popular/'}/>}/>
                        <Route path={'*'} element={<Navigate replace to={`/popular`}/>}/>
                    </Route>
                
                    <Route path={'/search/:searchType'} element={<Search/>}/>

                    <Route path='/r' element={<Sub/>}> 
                        <Route path={'/r/:subredditId'} element={<Best location={location} page={`r/${selected}/`}/>}/>
                        <Route path={'/r/:subredditId/hot'} element={<Hot location={location} page={`r/${selected}/`}/>}/>
                        <Route path={'/r/:subredditId/new'} element={<New location={location} page={`r/${selected}/`}/>}/>
                        <Route path={'/r/:subredditId/top'} element={<Top location={location} page={`r/${selected}/`}/>}/>
                        <Route path={'/r/:subredditId/rising'} element={<Rising location={location} page={`r/${selected}/`}/>}/>
                        <Route path={'/r'} element={<Navigate replace to={`/`}/>}/>
                        <Route path={'/r/:subredditId/comments/:postName/:postTitle'} element={<Post location={location} page={`/r/${selected}`}/>}/>
                    </Route>
                    
                    <Route path='/u/' element={<User/>}>
                        <Route path={'/u/:userId'} element={<Navigate replace to={`/u/${redirect}/overview`}/>}/>
                        <Route path={'/u/:userId/:content'} element={<Best location={location} page={`user/${selected}/`}/>}/>
                        <Route path={'/u/:userId/:content/hot'} element={<Hot location={location} page={`user/${selected}/`}/>}/>
                        <Route path={'/u/:userId/:content/new'} element={<New location={location} page={`user/${selected}/`}/>}/>
                        <Route path={'/u/:userId/:content/top'} element={<Top location={location} page={`user/${selected}/`}/>}/>
                        <Route path={'/u/:userId/:content/rising'} element={<Rising location={location} page={`user/${selected}/`}/>}/>
                        <Route path={'/u/:subredditId/comments/:postName/:postTitle'} element={<Post location={location} page={`/r/u_${selected}`}/>}/>
                    </Route>

                    {localStorage.getItem('refreshToken') ? <Route path={'/account'} element={<Account/>}/> : undefined}

                    {localStorage.getItem('refreshToken') ? <Route path={'/settings'} element={<Settings/>}/> : undefined}

                </Routes>
            </div>
        </main>
    );
};

export default Main;