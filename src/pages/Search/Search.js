import React from 'react';
import { useLocation } from 'react-router-dom';

const Search = () => {

    const location = useLocation().pathname;
    const searchType = location.split('/')[2];
    const searchQuery = location.split('/')[3];

    console.log(location, searchType, searchQuery)

    return (
        <div className='search'>
            
            <p>{searchType} {searchQuery}</p>
        </div>
    )
}

export default Search;