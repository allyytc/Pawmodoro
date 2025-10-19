import { useState, useEffect } from 'react';

// Define the props the component can accept
interface TimerProps {
  layout?: 'vertical' | 'horizontal'; // Layout can be horizontal (default) or vertical
}

// Accept the props and set a default value for layout
export default function Timer({ layout = 'horizontal' }: TimerProps) {
    const [seconds, setSeconds] = useState(1500);
    const [isActive, setIsActive] = useState(false);

    //storae for timer state using chrome storage
    useEffect(() => {
        chrome.storage.local.get(['timerState'], (result) => {
            if (result.timerState) {
                const savedState = result.timerState;
                const timeElapsedInSeconds = (Date.now() - savedState.timestamp) / 1000;
                if (savedState.isActive) {
                    const newSeconds = Math.max(0, savedState.seconds - timeElapsedInSeconds);
                    setSeconds(newSeconds);
                } else {
                    setSeconds(savedState.seconds);
                }
                setIsActive(savedState.isActive);
            }
        });
    }, []);
// Save timer state to Chrome storage whenever seconds or isActive changes
    useEffect(() => {
        const timerState = {
            seconds: seconds,
            isActive: isActive,
            timestamp: Date.now()
        };
        chrome.storage.local.set({ timerState });
    }, [seconds, isActive]);

    useEffect(() => {
        let interval: number | undefined = undefined;
        if (isActive && seconds > 0) {
            interval = setInterval(() => {
                setSeconds(currentSeconds => currentSeconds - 1);
            }, 1000);
        }
        return () => { clearInterval(interval) };
    }, [isActive, seconds]);
// Toggle between starting and pausing the timer
    const toggleTimer = () => {
        setIsActive(!isActive);
    };
// Reset the timer to 25 minutes
    const resetTimer = () => {
        setIsActive(false);
        setSeconds(1500);
    };
// Format the time in MM:SS and use only integers
    const formatTime = () => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    // Conditionally render the UI based on the layout prop
    if (layout === 'vertical') {
        // vertical layout
        return (
            <div className="flex items-center justify-center p-4">
                {/* 1. Changed `flex` to `flex-col` to stack buttons vertically.
                  2. Changed `space-x-2` to `space-y-2` for vertical spacing.
                */}
                <div className="flex flex-col space-y-2 mr-4">
                    <button onClick={toggleTimer} className='px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 w-24'>
                        {isActive ? 'Pause' : 'Start'}
                    </button>
                    <button onClick={resetTimer} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 w-24">
                        Reset
                    </button>
                </div>
                {/* Time display is to the right of the buttons */}
                <h1 className="text-5xl text-white font-bold">{formatTime()}</h1>
            </div>
        );
    }

    //OG horizontal layout for the side panel
    return (
        <div className="text-center p-4">
            <h1 className="text-6xl text-white font-bold mb-4">{formatTime()}</h1>
            <div className="flex justify-center space-x-4 mt-4">
                <button onClick={toggleTimer} className='px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600'>
                    {isActive ? 'Pause' : 'Start'}
                </button>
                <button onClick={resetTimer} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                    Reset
                </button>
            </div>
        </div>
    );
}