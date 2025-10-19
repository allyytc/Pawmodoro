// src/components/timer.tsx
// A simple timer component for the Pawmodoro extension

// import react hooks
import { useState, useEffect } from 'react';

// gives component memory with use state, start at 25 min, we edit set seconds
export default function Timer() {
    const [seconds, setSeconds] = useState(1500); // 25 minutes


// more useState variables to remeber if time is running or paused
    const [isActive, setIsActive] = useState(false);

// set up 1 second interval to count down, useEffect to handle side effects
    useEffect(() => {
        let interval: number | undefined = undefined;
// We only want the interval to run IF the timer is active and has time left
        if (isActive && seconds > 0) {
            interval = setInterval(() => {
                setSeconds(currentSeconds => currentSeconds - 1);
            }, 1000);
        }
// Stop old timer to reset 
        return() => {clearInterval(interval)};

    }, [isActive, seconds]);
// function to toggle buttons
    const toggleTimer = () => {
        setIsActive(!isActive);
    };
// reset function to get back to 25 minutes
    const resetTimer = () => {
        setIsActive(false);
        setSeconds(1500);
    }
// turns number of seconds into MM:SS format
    const formatTime = () => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
        };
    
// ui and connects functions
    return (
        <div className="text-center p-4 bg-gray-100 rounded-lg">
            <h1 className="text-6xl font-bold mb-4">{formatTime()}</h1>
            <div className="flex justify-center space-x-4 mt-4">
                <button onClick={toggleTimer} className='px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600'>
                    {isActive ? 'Pause' : 'Start'}
                </button>

                <button onClick={resetTimer} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Reset</button>
            </div>
        </div>
    );
}