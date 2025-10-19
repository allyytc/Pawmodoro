import React, { useState, useEffect } from 'react';

// Define the structure of the pet data we expect to find in storage.
interface PetData {
    name: string;
    happyImg: string;
    madImg: string;
}

const PetDisplay: React.FC = () => {
    // --- STATE MANAGEMENT ---
    // State to hold the pet's core data (name, images).
    const [pet, setPet] = useState<PetData | null>(null);
    // State to remember if the pet should be happy or not. We'll default to happy.
    const [isHappy, setIsHappy] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    // --- EFFECTS TO LOAD DATA AND LISTEN FOR CHANGES ---

    // This useEffect runs ONCE to load the pet's images and the initial on-task status.
    useEffect(() => {
        // We ask for two things from storage at the same time.
        chrome.storage.local.get(['pet', 'onTaskStatus'], (result) => {
            if (result.pet) {
                setPet(result.pet);
            }
            // If the onTaskStatus is saved, use it. Otherwise, default to true (happy).
            if (typeof result.onTaskStatus === 'boolean') {
                setIsHappy(result.onTaskStatus);
            }
            setIsLoading(false);
        });
    }, []); // Empty array `[]` means this runs only once when the component mounts.

    // This useEffect sets up a LISTENER that waits for the background script's messages.
    useEffect(() => {
        const handleStorageChange = (changes: { [key: string]: chrome.storage.StorageChange }, areaName: string) => {
            // We only care about changes to our 'onTaskStatus' key in local storage.
            if (areaName === 'local' && changes.onTaskStatus) {
                const newStatus = changes.onTaskStatus.newValue;
                console.log("Status changed in PetDisplay! New status:", newStatus);
                // When the status changes, we update our `isHappy` state, causing a re-render.
                setIsHappy(newStatus);
            }
        };

        // We subscribe our function to Chrome's storage change event.
        chrome.storage.onChanged.addListener(handleStorageChange);

        // This is a cleanup function. When the component disappears, we unsubscribe the listener.
        return () => {
            chrome.storage.onChanged.removeListener(handleStorageChange);
        };
    }, []); // Empty array `[]` ensures we only set up the listener once.

    if (isLoading) {
        return <div className="text-white text-center p-4">Loading pet...</div>;
    }

    if (!pet) {
        // If no pet exists, we don't show anything. Your PetCreator component will handle this case.
        return null;
    }

    // --- UI (JSX) ---
    // The image source is now conditional, based on the `isHappy` state.
    return (
        <div className="flex flex-col items-center p-4">
            <h2 className="text-2xl font-bold text-white mb-2">{pet.name}</h2>
            <div className="w-40 h-40">
                <img
                    src={isHappy ? pet.happyImg : pet.madImg}
                    alt={`${pet.name} is ${isHappy ? 'happy' : 'mad'}`}
                    className="w-full h-full object-contain"
                />
            </div>
        </div>
    );
};

export default PetDisplay;

