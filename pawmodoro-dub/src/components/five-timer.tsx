import { useState, useEffect } from 'react';

interface TimerProps {
    layout?: 'horizontal' | 'vertical';
    onSwitchTimer?: () => void; 
}

export default function FiveTimer({ layout = 'horizontal', onSwitchTimer }: TimerProps) {
    
    const handleSwitchToStudy = () => {
        // Clear this countdown before the study timer takes over.
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
    const [seconds, setSeconds] = useState(300); // 5 minutes
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        chrome.storage.local.get(['fiveTimerState'], (result) => {
            if (result.fiveTimerState) {
                const savedState = result.fiveTimerState;
                // If it was running, subtract the time spent while this view was closed.
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
    // Write every tick so a later open can catch up.
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
        setSeconds(300);
    };
    // Catch-up can leave a fraction. Show whole seconds.
    const formatTime = () => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    // Popup passes layout="vertical". The side panel uses the horizontal default.
    if (layout === 'vertical') {
        return (
            <div className="flex items-center justify-center p-4">
                <div className="flex flex-col space-y-2 mr-4">
                    <button onClick={toggleTimer} className='px-4 py-2 bg-emerald-200 text-white rounded hover:bg-emerald-300 w-24'>
                        {isActive ? 'Pause' : 'Start'}
                    </button>
                    <button onClick={resetTimer} className="px-4 py-2 bg-rose-300 text-white rounded hover:bg-rose-400 w-24">
                        Reset
                    </button>
                    {onSwitchTimer && (
                        <button onClick={handleSwitchToStudy} className='px-4 py-2 bg-sky-200 text-white rounded hover:bg-sky-300 w-24'>
                            Study
                        </button>
                    )}
                </div>
                <h1 className="text-5xl text-white font-bold">{formatTime()}</h1>
            </div>
        );
    }

    return (
        <div className="text-center p-4">
            <h1 className="text-6xl text-white font-bold mb-4">{formatTime()}</h1>
            <div className="flex justify-center space-x-4 mt-4">
                <button onClick={toggleTimer} className='px-4 py-2 bg-emerald-300 text-white rounded hover:bg-emerald-400'>
                    {isActive ? 'Pause' : 'Start'}
                </button>
                <button onClick={resetTimer} className="px-4 py-2 bg-rose-400 text-white rounded hover:bg-rose-500">
                    Reset
                </button>
                {onSwitchTimer && (
                    <button onClick={handleSwitchToStudy} className='px-4 py-2 bg-sky-300 text-white rounded hover:bg-sky-400'>
                        Study
                    </button>
                )}
            </div>
        </div>
    );
}
