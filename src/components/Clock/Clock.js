import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectClock, updateTime } from './clockSlice';

const Clock = () => {

    const dispatch = useDispatch();

    const clock = useSelector(selectClock)

    useEffect(() => {
        const timeout = setInterval(() => {
            dispatch(updateTime())
        },1000)
    
          return () => clearInterval(timeout)
    },[])

    return (
        <div>
            {/* {clock.hour.length < 2 ? '0' + clock.hour.length.toString() : clock.hour} : {clock.minutes.length < 2 ? '0' + clock.minutes.length.toString() : clock.minutes} */}
        </div>
    )
}

export default Clock;