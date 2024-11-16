// background.js
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "factCheck",
    title: "Fact Check This",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "factCheck" && info.selectionText) {
    chrome.storage.local.set({
      selectedText: info.selectionText
    });
  }
});