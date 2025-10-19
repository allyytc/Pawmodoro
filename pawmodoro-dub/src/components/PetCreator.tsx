import React, { useState, useEffect } from 'react';

interface PetData {
    name: string;
    happyImg: string;
    madImg: string;
    petImg: string;
    celebrateImg: string;
}

const PetCreator: React.FC = () => {
    // --- STATE ---
    const [animalInput, setAnimalInput] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    // This state holds the pet data loaded from storage, if it exists.
    const [savedPet, setSavedPet] = useState<PetData | null>(null);

    // --- EFFECT TO LOAD SAVED PET ---
    // This runs once when the component first loads to check for a pet.
    useEffect(() => {
        if (chrome.storage && chrome.storage.local) {
            chrome.storage.local.get(['pet'], (result) => {
                if (result.pet) {
                    console.log("Found a saved pet!", result.pet);
                    setSavedPet(result.pet);
                }
            });
        }
    }, []); // Empty array ensures this runs only once on mount.

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    const generateImage = async (prompt: string): Promise<string> => {
        if (!apiKey) throw new Error("API Key is missing. Check your .env file.");
        
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`;
        const payload = {
            instances: [{ "prompt": prompt }],
            parameters: { "sampleCount": 1 }
        };
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'API request failed.');
        }
        const result = await response.json();
        if (result.predictions && result.predictions[0]?.bytesBase64Encoded) {
            return result.predictions[0].bytesBase64Encoded;
        } else {
            throw new Error('No image data found in API response.');
        }
    };

    const handleCreatePet = async () => {
        if (!animalInput.trim()) {
            setError("Please enter an animal name.");
            return;
        }
        setIsLoading(true);
        setError('');

        try {
            const happyPrompt = `Pixel art spire of a happy, cute, ${animalInput}, please transparent background, no background, isolated on transparent, sitting pose, full body`;
            const madPrompt = `An angry, mad, pixel art sprite drawing of a ${animalInput},please  transparent background, no background, isolated on transparent, sitting pose, full body`;
            const pettedPrompt = `Pixel art sprite of a happy, cute ${animalInput} being petted, transparent background, no background, isolated on transparent, sitting pose, full body`;
            const celebratePrompt = `A happy, party, celebrating, pixel art sprite drawing of ${animalInput}, please transparent background, no background, isolated on transparent, sitting pose, full body`;
            
            const [happyImgBase64, madImgBase64, pettedImgBase64, celebrateImgBase64] = await Promise.all([
                generateImage(happyPrompt),
                generateImage(madPrompt),
                generateImage(pettedPrompt),
                generateImage(celebratePrompt)
            ]);
            
            const petData: PetData = {
                name: animalInput.charAt(0).toUpperCase() + animalInput.slice(1),
                happyImg: `data:image/png;base64,${happyImgBase64}`,
                madImg: `data:image/png;base64,${madImgBase64}`,
                petImg: `data:image/png;base64,${pettedImgBase64}`,
                celebrateImg: `data:image/png;base64,${celebrateImgBase64}`
            };

            chrome.storage.local.set({ pet: petData }, () => {
                console.log("Pet data saved successfully!", petData);
                // Update the state to switch the view to the new pet.
                setSavedPet(petData);
            });
        } catch (err) {
            console.error("Pet creation failed:", err);
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };
    
    // --- CONDITIONAL RENDERING ---
    // If a pet is saved in our state, show the display UI.
    if (savedPet) {
        return (
            <div className="bg-transparent p-6 text-center w-80">
                <h1 className="text-xl font-bold text-black ">Your Study Buddy</h1>
                <h2 className="text-lg font-semibold text-blue-600">{savedPet.name}</h2>
                <div className="w-40 h-40 mx-auto my-4 rounded-xl flex items-center justify-center overflow-hidden shadow-inner">
                    <img src={savedPet.happyImg} alt={`Your pet, ${savedPet.name}`} className="w-full h-full object-contain" />
                </div>
                <button
                    onClick={() => {
                        console.log('Pet saved, navigate to home');
                        window.location.reload();
                    }}
                    className="w-full py-2 mt-2 text-white font-semibold bg-gray-500 rounded-lg shadow-md hover:bg-gray-600"
                >
                    SAVE
                </button>
            </div>
        );
    }

    // Otherwise, show the creation form UI.
    return (
        <div className="bg-transparent p-6 text-center w-80">
            <h1 className="text-xl font-bold text-black">Create Your Study Buddy!</h1>
            <p className="text-black mt-2">What animal would you like as your pet?</p>
            <input 
                type="text"
                value={animalInput}
                onChange={(e) => setAnimalInput(e.target.value)}
                placeholder="e.g., fox, panda, owl"
                className=" w-full p-2 mt-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                disabled={isLoading}
            />
            <button
                onClick={handleCreatePet}
                disabled={isLoading}
                className="w-full py-2.5 mt-3 text-white font-semibold bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
            >
                {isLoading ? 'Creating...' : 'Create Pet'}
            </button>
            {isLoading && (
                <div className="flex justify-center mt-4">
                    <div className="w-8 h-8 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin"></div>
                </div>
            )}
            {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
        </div>
    );
};

export default PetCreator;

