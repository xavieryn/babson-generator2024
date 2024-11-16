chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.imageUrl) {
        alert(`Image URL: ${message.imageUrl}`);
        // Example: Copy the image URL to the clipboard
        navigator.clipboard.writeText(message.imageUrl).then(() => {
            console.log("Image URL copied to clipboard!");
        });
    }
});
