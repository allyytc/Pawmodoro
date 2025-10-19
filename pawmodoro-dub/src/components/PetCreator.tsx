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
    const [savedPet, setSavedPet] = useState<PetData | null>(null);

    // EFFECT TO LOAD SAVED PET ---
    useEffect(() => {
        if (chrome.storage && chrome.storage.local) {
            chrome.storage.local.get(['pet'], (result) => {
                if (result.pet) {
                    console.log("Found a saved pet!", result.pet);
                    setSavedPet(result.pet);
                }
            });
        }
    }, []);

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    // --- Background Removal Function ---
    const removeCheckerboardBackground = (base64Image: string): Promise<string> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = `data:image/png;base64,${base64Image}`;
            
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                if (!ctx) return resolve(base64Image);

                ctx.drawImage(img, 0, 0);
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;

                // Will start loop to look for 'fake' backgrounds colors (grey and light grey)

                for (let i = 0; i < data.length; i += 4) {
                    const red = data[i];
                    const green = data[i + 1];
                    const blue = data[i + 2];

                    const isWhite = red > 240 && green > 240 && blue > 240;
                    const isLightGrey = red > 190 && red < 215 && green > 190 && green < 215 && blue > 190 && blue < 215;

                    if (isWhite || isLightGrey) {
                        data[i + 3] = 0; // Make transparent
                    }
                }
                ctx.putImageData(imageData, 0, 0);
                resolve(canvas.toDataURL('image/png').split(',')[1]);
            };
            img.onerror = () => reject(new Error('Image failed to load for background removal.'));
        });
    };

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
            // --- All of the Gemini API prompts for different pet states 
            const happyPrompt = `Pixel art sprite of a happy, cute ${animalInput}, full body, sitting pose. PNG with alpha channel transparency, no background, isolated on transparent.`;
            const madPrompt = `Pixel art sprite of an angry, mad ${animalInput}, full body, sitting pose. PNG with alpha channel transparency, no background, isolated on transparent.`;
            const pettedPrompt = `Pixel art sprite of a human hand petting a cute, happy pixel art${animalInput}. PNG with alpha channel transparency, no background, isolated on transparent.`;
            const celebratePrompt = `Pixel art sprite of a happy, celebrating ${animalInput} with confetti, full body, sitting pose. PNG with alpha channel transparency, no background, isolated on transparent.`;
            
            // --- Generate all images in parallel ---
            const [happyImgBase64, madImgBase64, pettedImgBase64, celebrateImgBase64] = await Promise.all([
                generateImage(happyPrompt),
                generateImage(madPrompt),
                generateImage(pettedPrompt),
                generateImage(celebratePrompt)
            ]);

            // Run Transparency Removal Function to all images

            const [happyClean, madClean, pettedClean, celebrateClean] = await Promise.all([
                removeCheckerboardBackground(happyImgBase64),
                removeCheckerboardBackground(madImgBase64),
                removeCheckerboardBackground(pettedImgBase64),
                removeCheckerboardBackground(celebrateImgBase64)
            ]);

            // Prepare Pet Data and Send to Chrome Storage
            
            const petData: PetData = {
                name: animalInput.charAt(0).toUpperCase() + animalInput.slice(1),
                happyImg: `data:image/png;base64,${happyClean}`,
                madImg: `data:image/png;base64,${madClean}`,
                petImg: `data:image/png;base64,${pettedClean}`,
                celebrateImg: `data:image/png;base64,${celebrateClean}`
            };

            // chrome storage set

            chrome.storage.local.set({ pet: petData }, () => {
                console.log("Pet data saved successfully!", petData);
                setSavedPet(petData);
            });
           
            // catch any errors and display message

        } catch (err) {
            console.error("Pet creation failed:", err);
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };
    
    // Displays The Saved Pet! 

    if (savedPet) {
        return (
            <div className="bg-transparent p-6 text-center w-80">
                <h1 className="text-xl font-bold text-black ">Your Study Buddy</h1> 
                <h2 className="text-lg font-semibold text-blue-600">{savedPet.name}</h2>
                <div className="w-40 h-40 mx-auto my-4 rounded-xl flex items-center justify-center overflow-hidden shadow-inner">
                    <img src={savedPet.happyImg} alt={`Your pet, ${savedPet.name}`} className="w-full h-full object-contain" />
                </div>

                {/* this button will save the pet to chrome */}

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

     // UI for creating the pet

    return (
        <div className="bg-transparent p-6 text-center w-80">
            <h1 className="text-xl font-bold text-black">Create Your Study Buddy!</h1>
            <p className="text-black mt-2">What animal would you like as your pet?</p>
            <input 
                type="text"
                value={animalInput}
                onChange={(e) => setAnimalInput(e.target.value)}
                placeholder="e.g., fox, dog, dragon"
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

