// http(s) tabs are on task only when the hostname is in allowedSites.
// chrome:// pages and tabs with no URL count as on task.
const checkCurrentTab = (tab) => {
    if (tab && tab.url && tab.url.startsWith('http')) {
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

chrome.tabs.onActivated.addListener((activeInfo) => {
    chrome.tabs.get(activeInfo.tabId, (tab) => {
        checkCurrentTab(tab);
    });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {

    if (tab.active && changeInfo.status === 'complete') {
        checkCurrentTab(tab);
    }
});