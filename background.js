chrome.runtime.onInstalled.addListener(() => {
  // First remove existing menu items to avoid duplicates
  chrome.contextMenus.removeAll(() => {
    // Create new context menu item
    chrome.contextMenus.create({
      id: "factCheck",
      title: "Fact Check Selection",
      contexts: ["selection"]
    });
    // Create a context menu item for images
    chrome.contextMenus.create({
      id: "getImageLink",
      title: "Get Image Link",
      contexts: ["image"] // Only show for images
    });
  });
});

// Add a listener to handle when the context menu is clicked
chrome.contextMenus.onClicked.addListener((info, tab) => {
  console.log('clicked')
  if (info.menuItemId === "getImageLink" && info && info.srcUrl) {
    // Store only the current selection when context menu is used
    chrome.storage.local.set({
      imageUrl: info.srcUrl
    }, () => {
      // Open the popup after storing
      chrome.action.openPopup();
    });
    // `info.srcUrl` contains the URL of the clicked image
    console.log("Image URL:", info.srcUrl);
  }
});

// Optional: Clear last image when popup is closed
chrome.runtime.onConnect.addListener((port) => {
  if (port.name === "popup") {
    port.onDisconnect.addListener(() => {
      // Clear the last highlight when popup is closed
      chrome.storage.local.remove('imageUrl');
    });
  }
});