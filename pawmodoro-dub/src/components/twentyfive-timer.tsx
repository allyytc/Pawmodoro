import { useState, useEffect } from 'react';
import FiveTimer from './five-timer';

// Define the props the component can accept
interface TimerProps {
  layout?: 'vertical' | 'horizontal'; // Layout can be horizontal (default) or vertical
  onTimerChange?: (timerType: 'study' | 'break') => void; // Callback to notify parent of timer change
}

// Accept the props and set a default value for layout
export default function TwentyfiveTimer({ layout = 'horizontal', onTimerChange }: TimerProps) {
    const [seconds, setSeconds] = useState(1500); //25 mins
    const [isActive, setIsActive] = useState(false);
    const [activeView, setActiveView] = useState(false);

    // --- All of your existing logic for saving and loading the timer remains the same ---
    useEffect(() => {
        chrome.storage.local.get(['twentyFiveTimerState'], (result) => {
            if (result.twentyFiveTimerState) {
                const savedState = result.twentyFiveTimerState;
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

    useEffect(() => {
        const timerState = {
            seconds: seconds,
            isActive: isActive,
            timestamp: Date.now()
        };
        chrome.storage.local.set({ twentyFiveTimerState: timerState });
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

    const toggleTimer = () => {
        setIsActive(!isActive);
    };

    const resetTimer = () => {
        setIsActive(false);
        setSeconds(1500);
    };

    const formatTime = () => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    const fiveView = () => {
        // Stop and reset the 25-minute timer before switching
        setIsActive(false);
        setSeconds(1500);
        chrome.storage.local.set({ 
            twentyFiveTimerState: {
                seconds: 1500,
                isActive: false,
                timestamp: Date.now()
            }
        });
        
        setActiveView(true);
        if (onTimerChange) {
            onTimerChange('break'); // Notify parent we're switching to break timer
        }
    };

    const twentyFiveView = () => {
        setActiveView(false);
        if (onTimerChange) {
            onTimerChange('study'); // Notify parent we're switching to study timer
        }
    };

    if (activeView) {
        return <FiveTimer onSwitchTimer={twentyFiveView} layout={layout} />;
    }

    // Conditionally render the UI based on the layout prop
    if (layout === 'vertical') {
        // --- vertical layout for your popup ---
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
                    <button onClick={fiveView} className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-24'>
                        Break
                    </button>
                </div>
                {/* Time display is to the right of the buttons */}
                <h1 className="text-5xl text-white font-bold">{formatTime()}</h1>
            </div>
        );
    }

    // --- OG horizontal layout for the side panel ---
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
                <button onClick={fiveView} className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'>
                    Break
                </button>
            </div>
        </div>
    );
}