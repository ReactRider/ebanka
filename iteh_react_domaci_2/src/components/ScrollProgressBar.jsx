import React from 'react';
import ScrollPositionHook from './ScrollPositionHook.jsx';

const ScrollProgressBar = () => {
    const progress = ScrollPositionHook();
    
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            height: '.4em',
            width: '100%',
            backgroundColor: '#fff',
            boxShadow: '0 .11em .45em rgba(0,0,0,0.3)',
            zIndex: 9999,
        }}>
        <div style={{
            height: '100%',
            width: `${progress}%`,
            backgroundColor: '#4286f4',
            transition: 'width 0.2s ease-out'
        }}/>

        </div>
    );
}

export default ScrollProgressBar
