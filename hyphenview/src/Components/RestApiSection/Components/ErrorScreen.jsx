import '../Components/ErrorScreen.css';
import React, {useState} from 'react';

const ErrorScreen = () => {
    const error = 'https://i.stack.imgur.com/01tZQ.png';
    return (
        <>
        <div style={{ display: 'flex' }} className='error-screen-img'>
                <img src={error} alt='error' className='error' />
            </div>    
        </>
    )
}

export default ErrorScreen;
