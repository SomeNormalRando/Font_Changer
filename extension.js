const font = 'Arial';

chrome.runtime.onInstalled.addListener(() => {
	chrome.storage.sync.set({ font });
});