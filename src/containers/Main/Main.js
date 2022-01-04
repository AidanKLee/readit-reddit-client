import React, { useEffect, useState } from "react";
import './main.css';
import { useSelector } from 'react-redux';
import { selectMenu } from "../Menu/menuSlice";
import { selectMain } from "./mainSlice";
import loader from '../../assets/loader.svg';
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

const Main = () => {

    const menu = useSelector(selectMenu);
    const main = useSelector(selectMain);

    const selected = useLocation().pathname.split('/').slice(2).join('/');
    const redirect = useLocation().pathname.split('/')[2];

    useEffect(() => {
        let page = window.location.pathname;
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
            page.length > 1 ? page = ': ' + page.join(' - ') : page = ': ' + page.join('')
        }
        document.title = title + page
    },[selected])
        
    return (
        <main className={menu.menuOpen ? 'blur' : ''}>
            <div className="mainWrapper">
                
                <Routes>
                    <Route path={'/'} element={<Home />}>
                        <Route path={''} element={<Best page={''}/>}/>
                        <Route path={'callback'} element={<Best page={''}/>}/>
                        <Route path={'hot'} element={<Hot page={''}/>}/>
                        <Route path={'new'} element={<New page={''}/>}/>
                        <Route path={'top'} element={<Top page={''}/>}/>
                        <Route path={'rising'} element={<Rising page={''}/>}/>
                        {/* <Route path={'*'} element={<Best page={''}/>}/> */}
                    </Route>

                    <Route path={'/all'} element={<All />}>
                        <Route path={''} element={<Best page={'r/all/'}/>}/>
                        <Route path={'/all/hot'} element={<Hot page={'r/all/'}/>}/>
                        <Route path={'/all/new'} element={<New page={'r/all/'}/>}/>
                        <Route path={'/all/top'} element={<Top page={'r/all/'}/>}/>
                        <Route path={'/all/rising'} element={<Rising page={'r/all/'}/>}/>
                        {/* <Route path={'*'} element={<Best page={'r/all/'}/>}/> */}
                    </Route>

                    <Route path={'/popular'} element={<Popular />}>
                        <Route path={''} element={<Best page={'r/popular/'}/>}/>
                        <Route path={'/popular/hot'} element={<Hot page={'r/popular/'}/>}/>
                        <Route path={'/popular/new'} element={<New page={'r/popular/'}/>}/>
                        <Route path={'/popular/top'} element={<Top page={'r/popular/'}/>}/>
                        <Route path={'/popular/rising'} element={<Rising page={'r/popular/'}/>}/>
                    </Route>
                
                    {/* <Search /> */}
                    <Route path='/r' element={<Sub/>}> 
                        <Route path={'/r/:subredditId'} element={<Best page={`r/${selected}/`}/>}/>
                        <Route path={'/r/:subredditId/hot'} element={<Hot page={`r/${selected}/`}/>}/>
                        <Route path={'/r/:subredditId/new'} element={<New page={`r/${selected}/`}/>}/>
                        <Route path={'/r/:subredditId/top'} element={<Top page={`r/${selected}/`}/>}/>
                        <Route path={'/r/:subredditId/rising'} element={<Rising page={`r/${selected}/`}/>}/>   
                    </Route>
                    
                    <Route path='/u/' element={<User/>}>
                        <Route path={'/u/:userId'} element={<Navigate replace to={`/u/${redirect}/overview`}/>}/>
                        <Route path={'/u/:userId/:content'} element={<Best page={`user/${selected}/`}/>}/>
                        <Route path={'/u/:userId/:content/hot'} element={<Hot page={`user/${selected}/`}/>}/>
                        <Route path={'/u/:userId/:content/new'} element={<New page={`user/${selected}/`}/>}/>
                        <Route path={'/u/:userId/:content/top'} element={<Top page={`user/${selected}/`}/>}/>
                        <Route path={'/u/:userId/:content/rising'} element={<Rising page={`user/${selected}/`}/>}/> 
                    </Route>
                </Routes>
                {main.isLoading ? <div className="mainLoading"><img className="loader" src={loader} alt='Loader' /><p>Loading...</p></div> : undefined}
                {main.page.allLoaded ? <p className="mainLoading">End Of Content</p> : <div className="mainLoadMore"></div>}
            </div>
        </main>
    );
};

export default Main;