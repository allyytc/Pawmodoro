import React, { useState, useEffect } from 'react';

export default function WebsiteManager() {
  // State for the list of websites
  const [sites, setSites] = useState<string[]>([]);
  
  // State for the text in the input box
  const [inputText, setInputText] = useState('');

  

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

  // Adding sites

  const handleAddSite = () => {
    if (inputText.trim() === '' || sites.includes(inputText.trim())) {
      setInputText('');
      return; // Prevent adding empty or duplicate sites
    }
    const newSites = [...sites, inputText.trim()];
    saveSites(newSites);
    setInputText(''); // Clear input after adding
  };
/// Removing sites
  const handleRemoveSite = (siteToRemove: string) => {
    const newSites = sites.filter(site => site !== siteToRemove);
    saveSites(newSites);
  };
  
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleAddSite();
    }
  };

  //UI and functions

  return (
    <div className="p-4 bg-white/20 rounded-lg">
      {/* Title for the section */}
      <h2 className="font-semibold text-white text-lg mb-4">
        Manage Allowed Websites
      </h2>

      {/* The content is now always visible */}
      <div>
        {/* Input section */}
        <div className="flex mb-4 text-white">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="e.g., notion.so"
            className="w-full p-2 border rounded-l-md text-white focus:outline-none"
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
    </div>
  );
}