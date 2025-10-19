import React from 'react';

interface PetData {
    name: string;
    happyImg: string;
    madImg: string;
}

// react component

const Petcreator: React.FC = () => {

    const [animalInput, setAnimalInput] = React.useState<string>('');
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [error, setError] = React.useState<string>('');
    const [petPreviewUrl, setPetPreviewUrl] = React.useState<string>('');

    // my api key

    const apiKey = "AIzaSyC8BHdNMhIIzMXOIybW8hgFlvWyjfIBL8Q";

    // calling Gemini API to generate an image

    const generateImage = async (prompt: string): Promise<string> => {
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

// handles when create pet button is clicked
const handleCreatePet = async () => {
    if (!animalInput.trim()) {
        setError("Please enter an animal name.");
        return;
    }

    // --- Update UI to show loading state ---
    setIsLoading(true);
    setError('');
    setPetPreviewUrl('');

    try {
        // --- Define the prompts for the AI ---
        const happyPrompt = `A happy, cute pixel art sprite drawing of a ${animalInput}, transparent background, sitting pose, full body`;
        const madPrompt = `An angry, mad, pixel art sprite drawing of a ${animalInput}, transparent background, , sitting pose, full body`;

        // --- Call the API for both images concurrently ---
        console.log("Generating happy and mad pets...");
        const [happyImgBase64, madImgBase64] = await Promise.all([
            generateImage(happyPrompt),
            generateImage(madPrompt)
        ]);

        // --- Prepare the data object to be saved ---
        const petData: PetData = {
            name: animalInput.charAt(0).toUpperCase() + animalInput.slice(1),
            happyImg: `data:image/png;base64,${happyImgBase64}`,
            madImg: `data:image/png;base64,${madImgBase64}`
        };

        // --- Save the pet data to Chrome's local storage ---
        // Note: In a real project, you might need to install @types/chrome for this to be type-safe.
        if (chrome && chrome.storage && chrome.storage.local) {
            chrome.storage.local.set({ pet: petData }, () => {
                console.log("Pet data saved successfully!", petData);
                // Show the happy pet as a preview
                setPetPreviewUrl(petData.happyImg);
            });
        } else {
            // Fallback for when not running in an extension, e.g., for local development
            console.warn("Chrome storage API not found. Saving to localStorage instead.");
            localStorage.setItem('pet', JSON.stringify(petData));
            setPetPreviewUrl(petData.happyImg);
        }

    } catch (err) {
        console.error("Pet creation failed:", err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
        // --- Reset UI from loading state ---
        setIsLoading(false);
    }
};

return (
    <div className="bg-slate-50 p-6 text-center w-80">
        <h1 className="text-xl font-bold text-gray-800">Create Your Study Buddy!</h1>
        <p className="text-gray-600 mt-2">What animal would you like as your pet?</p>

        <input
            type="text"
            value={animalInput}
            onChange={(e) => setAnimalInput(e.target.value)}
            placeholder="e.g., fox, panda, owl"
            className="w-full p-2 mt-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            disabled={isLoading}
        />

        <button
            onClick={handleCreatePet}
            disabled={isLoading}
            className="w-full py-2.5 mt-3 text-white font-semibold bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
        >
            {isLoading ? 'Creating...' : 'Create Pet'}
        </button>

        {/* --- Dynamic Content: Loader, Error, Preview --- */}
        {isLoading && (
            <div className="flex justify-center mt-4">
                <div className="w-8 h-8 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin"></div>
            </div>
        )}

        {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

        <div className="w-40 h-40 mx-auto mt-5 bg-slate-200 rounded-xl flex items-center justify-center overflow-hidden shadow-inner">
            {petPreviewUrl ? (
                <img src={petPreviewUrl} alt="Your new pet" className="w-full h-full object-contain" />
            ) : (
                !isLoading && <span className="text-xs text-gray-500 p-2">Your new pet will appear here</span>
            )}
        </div>
    </div>
);
};

export default Petcreator;

