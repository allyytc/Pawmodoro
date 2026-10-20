import React, { useState, useEffect } from 'react';

export default function WebsiteManager() {
  const [sites, setSites] = useState<string[]>([]);
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    chrome.storage.local.get(['allowedSites'], (result) => {
      if (result.allowedSites) {
        setSites(result.allowedSites);
      }
    });
  }, []);

  const saveSites = (newSites: string[]) => {
    setSites(newSites);
    chrome.storage.local.set({ allowedSites: newSites });
  };

  const handleAddSite = () => {
    if (inputText.trim() === '' || sites.includes(inputText.trim())) {
      setInputText('');
      return;
    }
    const newSites = [...sites, inputText.trim()];
    saveSites(newSites);
    setInputText('');
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

  return (
    <div className="p-4 bg-white/20 rounded-lg">
      <h2 className="font-semibold text-white text-lg mb-4">
        Manage Allowed Websites
      </h2>
      <div>
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