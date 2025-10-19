// src/components/timer.tsx
// A simple timer component for the Pawmodoro extension

// import react hooks
import { useState, useEffect } from 'react';

// gives component memory with use state, start at 25 min, we edit set seconds
export default function Timer() {
    const [seconds, setSeconds] = useState(1500); // 25 minutes

    // more useState variables to remeber if time is running or paused
    const [isActive, setIsActive] = useState(false);

    // NEW: This useEffect hook runs ONLY ONCE when the component first loads.
    // Its purpose is to load the timer's state from storage.
    useEffect(() => {
        // We ask Chrome's storage for the 'timerState' object we saved.
        chrome.storage.local.get(['timerState'], (result) => {
            // Check if there is any saved state at all.
            if (result.timerState) {
                const savedState = result.timerState;
                console.log("Found saved timer state:", savedState);

                // NEW: This is the crucial part. We calculate how much time has passed
                // since the popup was last closed.
                const timeElapsedInSeconds = (Date.now() - savedState.timestamp) / 1000;

                // NEW: If the timer was running when the user closed the popup...
                if (savedState.isActive) {
                    // ...we subtract the elapsed time from the saved seconds.
                    const newSeconds = Math.max(0, savedState.seconds - timeElapsedInSeconds);
                    setSeconds(newSeconds);
                } else {
                    // NEW: If the timer was paused, we just load the saved time directly.
                    setSeconds(savedState.seconds);
                }

                // NEW: We also restore whether the timer was active or paused.
                setIsActive(savedState.isActive);
            }
        });
    }, []); // NEW: The empty array `[]` ensures this effect runs only once on mount.

    // NEW: This useEffect is our "auto-save" feature.
    // It runs every single time the `seconds` or `isActive` state changes.
    useEffect(() => {
        // We create an object that holds all the important information.
        const timerState = {
            seconds: seconds,
            isActive: isActive,
            // NEW: We include a timestamp. This is essential for calculating
            // how much time has passed while the popup was closed.
            timestamp: Date.now()
        };
        // We save this complete state object to Chrome's storage.
        chrome.storage.local.set({ timerState });
    }, [seconds, isActive]); // NEW: This effect depends on `seconds` and `isActive`.

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
        return () => { clearInterval(interval) };

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
        <div className="text-center p-4">
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
