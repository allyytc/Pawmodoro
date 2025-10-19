const checkCurrentTab = (tab) => {
//  make sure tab got a url
    if (tab && tab.url && tab.url.startsWith('http')) {
// extract the domain name
        const hostname = new URL(tab.url).hostname;


        chrome.storage.local.get(['allowedSites'], (result) => {

            const allowedSites = result.allowedSites || [];

            const isOnTask = allowedSites.includes(hostname);

            chrome.storage.local.set({ onTaskStatus: isOnTask }, () => {

                console.log(`User is on task: $(hostname). On Task: ${isOnTask}`);
            });
        });
    } else {

        chrome.storage.local.set({ onTaskStatus: true });
        
    }
};

// switching to a different tab

chrome.tabs.onActivated.addListener((activeInfo) => {
    chrome.tabs.get(activeInfo.tabId, (tab) => {
        checkCurrentTab(tab);
    });
});

// checking when users tab changes

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {

    if (tab.active && changeInfo.status === 'complete') {
        checkCurrentTab(tab);
    }
});