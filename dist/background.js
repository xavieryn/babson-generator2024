// Make sure context menu is created when extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
    // First remove existing menu items to avoid duplicates
    chrome.contextMenus.removeAll(() => {
      // Create new context menu item
      chrome.contextMenus.create({
        id: "factCheck",
        title: "Fact Check Selection",
        contexts: ["selection"]
      });
    });
  });
  
  // Handle context menu clicks
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "factCheck" && info.selectionText) {
      // Store only the current selection when context menu is used
      chrome.storage.local.set({ 
        lastHighlight: info.selectionText // Store only the current highlight
      }, () => {
        // Open the popup after storing
        chrome.action.openPopup();
      });
    }
  });
  
  // Optional: Clear lastHighlight when popup is closed
  chrome.runtime.onConnect.addListener((port) => {
    if (port.name === "popup") {
      port.onDisconnect.addListener(() => {
        // Clear the last highlight when popup is closed
        chrome.storage.local.remove('lastHighlight');
      });
    }
  });