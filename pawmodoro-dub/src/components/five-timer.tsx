import { useState, useEffect } from 'react';

interface TimerProps {
    layout?: 'horizontal' | 'vertical';
    onSwitchTimer?: () => void; // Add callback prop
}

export default function FiveTimer({ layout = 'horizontal', onSwitchTimer }: TimerProps) {
    
    const handleSwitchToStudy = () => {
        // Stop and reset the 5-minute timer before switching
        setIsActive(false);
        setSeconds(300);
        chrome.storage.local.set({ 
            fiveTimerState: {
                seconds: 300,
                isActive: false,
                timestamp: Date.now()
            }
        });
        
        if (onSwitchTimer) {
            onSwitchTimer();
        }
    };
    const [seconds, setSeconds] = useState(300); //5 mins
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        chrome.storage.local.get(['fiveTimerState'], (result) => {
            if (result.fiveTimerState) {
                const savedState = result.fiveTimerState;
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
        chrome.storage.local.set({ fiveTimerState: timerState });
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
        setSeconds(300); // Reset to 5 minutes
    };

    const formatTime = () => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    // Conditionally render the UI based on the layout prop
    if (layout === 'vertical') {
        // --- vertical layout for your popup ---
        return (
            <div className="flex items-center justify-center p-4">
                <div className="flex flex-col space-y-2 mr-4">
                    <button onClick={toggleTimer} className='px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 w-24'>
                        {isActive ? 'Pause' : 'Start'}
                    </button>
                    <button onClick={resetTimer} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 w-24">
                        Reset
                    </button>
                    {onSwitchTimer && (
                        <button onClick={handleSwitchToStudy} className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-24'>
                            Study
                        </button>
                    )}
                </div>
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
                {onSwitchTimer && (
                    <button onClick={handleSwitchToStudy} className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'>
                        Study
                    </button>
                )}
            </div>
        </div>
    );
}
