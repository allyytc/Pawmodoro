import React, { useState, useEffect } from 'react';

export default function WebsiteManager() {
  // State for the accordion: remembers if the section is open or closed
  const [isOpen, setIsOpen] = useState(false);
  
  // State for the list of websites
  const [sites, setSites] = useState<string[]>([]);
  
  // State for the text in the input box
  const [inputText, setInputText] = useState('');

  // --- LOGIC FOR LOADING AND SAVING ---

  // Load saved sites from Chrome storage when the component first loads
  useEffect(() => {
    chrome.storage.local.get(['allowedSites'], (result) => {
      if (result.allowedSites) {
        setSites(result.allowedSites);
      }
    });
  }, []); // The empty array [] means this effect runs only once
  
  // Function to save the list to Chrome storage
  const saveSites = (newSites: string[]) => {
    setSites(newSites);
    chrome.storage.local.set({ allowedSites: newSites });
  };

  // --- LOGIC FOR HANDLING USER ACTIONS ---

  const handleAddSite = () => {
    if (inputText.trim() === '' || sites.includes(inputText.trim())) {
      setInputText('');
      return; // Prevent adding empty or duplicate sites
    }
    const newSites = [...sites, inputText.trim()];
    saveSites(newSites);
    setInputText(''); // Clear input after adding
  };

  const handleRemoveSite = (siteToRemove: string) => {
    const newSites = sites.filter(site => site !== siteToRemove);
    saveSites(newSites);
  };
  
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleAddSite();
    }
  };

  // --- UI BLUEPRINT (JSX) ---

  return (
    <div className="p-4 bg-white/10 rounded-lg">
      {/* This button is always visible and controls the accordion */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left font-semibold text-white text-lg p-2 rounded-md hover:bg-white/20"
      >
        Manage Allowed Websites {isOpen ? '▲' : '▼'}
      </button>

      {/* This is the key part: The UI inside only renders if 'isOpen' is true */}
      {isOpen && (
        <div className="mt-4">
          {/* Input section */}
          <div className="flex mb-4 text-white">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="e.g., notion.so"
              className="w-full p-2 border rounded-l-md text-gray-800 focus:outline-none"
            />
            <button
              onClick={handleAddSite}
              className="bg-blue-500 text-white px-4 rounded-r-md hover:bg-blue-600"
            >
              Add
            </button>
          </div>

          {/* List of saved sites */}
          <ul className="space-y-2 max-h-40 overflow-y-auto">
            {sites.map(site => (
              <li
                key={site}
                className="flex items-center justify-between bg-white/20 p-2 rounded-md"
              >
                <span className="text-white">{site}</span>
                <button
                  onClick={() => handleRemoveSite(site)}
                  className="bg-red-500 text-white font-bold w-6 h-6 rounded-full hover:bg-red-600 flex items-center justify-center"
                >
                  &times;
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}