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
  if (info.menuItemId === "getImageLink") {
    // `info.srcUrl` contains the URL of the clicked image
    console.log("Image URL:", info.srcUrl);

    // You can use the image URL (e.g., copy to clipboard or send to another service)
    chrome.tabs.sendMessage(tab.id, { imageUrl: info.srcUrl });
  }
});
