import React, { useState, useEffect, useRef } from 'react';

// Shape of the pet record stored under the "pet" key.
interface PetData {
    name: string;
    happyImg: string;
    madImg: string;
    petImg: string;
    celebrateImg?: string;
}

const PetDisplay: React.FC = () => {
    const [pet, setPet] = useState<PetData | null>(null);
    const [isHappy, setIsHappy] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [isPetted, setIsPetted] = useState(false);
    const [isCelebrating, setIsCelebrating] = useState(false);

    const meowAudioRef = useRef<HTMLAudioElement | null>(null);
    if (!meowAudioRef.current) {
        meowAudioRef.current = new Audio(chrome.runtime.getURL('sounds/meow2.wav'));
    }

    // Missing onTaskStatus stays happy (the useState default).
    useEffect(() => {
        chrome.storage.local.get(['pet', 'onTaskStatus'], (result) => {
            if (result.pet) {
                setPet(result.pet);
            }
            if (typeof result.onTaskStatus === 'boolean') {
                setIsHappy(result.onTaskStatus);
            }
            setIsLoading(false);
        });
    }, []);

    // background.js writes onTaskStatus. The to-do list writes "celebrating".
    useEffect(() => {
        const handleStorageChange = (changes: { [key: string]: chrome.storage.StorageChange }, areaName: string) => {
            if (areaName === 'local' && changes.onTaskStatus) {
                const newStatus = changes.onTaskStatus.newValue;
                console.log("Status changed in PetDisplay! New status:", newStatus);
                setIsHappy(newStatus);
            }
            
            if (areaName === 'local' && changes.celebrating) {
                const celebrating = changes.celebrating.newValue;
                console.log("Celebration triggered!", celebrating);
                if (celebrating) {
                    setIsCelebrating(true);
                    setTimeout(() => {
                        setIsCelebrating(false);
                    }, 3000);
                }
            }
        };

        chrome.storage.onChanged.addListener(handleStorageChange);

        return () => {
            chrome.storage.onChanged.removeListener(handleStorageChange);
        };
    }, []);

    const handlePet = () => {

        if (meowAudioRef.current) {
            meowAudioRef.current.currentTime = 0;
            meowAudioRef.current.play();
        }

        setIsPetted(true);
        setTimeout(() => {
            setIsPetted(false);
        }, 1000);
    };

    if (isLoading) {
        return <div className="text-white text-center p-4">Loading pet...</div>;
    }

    if (!pet) {
        return null;
    }

    // celebrating, then petting, then happy or mad
    const currentImage = isCelebrating && pet.celebrateImg
        ? pet.celebrateImg
        : isPetted 
        ? pet.petImg 
        : isHappy 
        ? pet.happyImg 
        : pet.madImg;
    
    return (
        <div className="flex flex-col items-center p-4">
            <h2 className="text-2xl font-bold text-white mb-2">{pet.name}</h2>
            <div 
                className="w-40 h-40 cursor-pointer"
                onClick={handlePet}
                title ={`Pet ${pet.name}`}
            >
                <img
                    src={currentImage}
                    alt={`${pet.name} is ${isCelebrating ? 'celebrating' : isPetted ? 'being petted' : isHappy ? 'happy' : 'mad'}`}
                    className="w-full h-full object-contain"
                />
            </div>
        </div>
    );
};

export default PetDisplay;

