import React, { useState } from "react";
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
import { Routes, Route } from "react-router-dom";

const Main = () => {

    const menu = useSelector(selectMenu);
    const main = useSelector(selectMain);

    const [ subredditUrl, setSubredditUrl ] = useState('');

    const getSubredditUrl = (url) => {
        setSubredditUrl(url);
        console.log(subredditUrl)
    }
    
    const renderSubreddit = () => {
        if (main.selectedSubreddit) {
            <div>
                <Route path={''} element={<Best page={`r/${main.selectedSubreddit}/`}/>}/>
                <Route path={'/r/:subredditId/hot'} element={<Hot page={`r/${main.selectedSubreddit}/`}/>}/>
                <Route path={'/r/:subredditId/new'} element={<New page={`r/${main.selectedSubreddit}/`}/>}/>
                <Route path={'/r/:subredditId/top'} element={<Top page={`r/${main.selectedSubreddit}/`}/>}/>
                <Route path={'/r/:subredditId/rising'} element={<Rising page={`r/${main.selectedSubreddit}/`}/>}/>
            </div>  
        }
    }

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
                    <Route path='/r/:subredditId' element={<Sub getSubredditUrl={getSubredditUrl}/>}> 
                        {main.selectedSubreddit ? <Route path={''} element={<Best page={`r/${main.selectedSubreddit}/`}/>}/> : undefined}
                        {main.selectedSubreddit ? <Route path={'/r/:subredditId/hot'} element={<Hot page={`r/${main.selectedSubreddit}/`}/>}/> : undefined}
                        {main.selectedSubreddit ? <Route path={'/r/:subredditId/new'} element={<New page={`r/${main.selectedSubreddit}/`}/>}/> : undefined}
                        {main.selectedSubreddit ? <Route path={'/r/:subredditId/top'} element={<Top page={`r/${main.selectedSubreddit}/`}/>}/> : undefined}
                        {main.selectedSubreddit ? <Route path={'/r/:subredditId/rising'} element={<Rising page={`r/${main.selectedSubreddit}/`}/>}/> : undefined}        
                    </Route>
                    <Route path='u/:userId' element={<User/>}/>
                </Routes>
                {main.isLoading ? <div className="mainLoading"><img className="loader" src={loader} alt='Loader' /><p>Loading...</p></div> : <div className="mainLoadMore"><img className="loader" src={loader} alt='Loader' /><p>Loading More...</p></div>}
            </div>
        </main>
    );
};

export default Main;