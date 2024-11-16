import React, { useEffect, useState, useTransition } from 'react';
import { checkImage } from './action';
import { SightEngineResponse } from './type';

const App: React.FC = () => {
  const [selectedText, setSelectedText] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  // Check if we're running as an extension
  const isExtension = typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id;

  useEffect(() => {
    if (isExtension) {
      // Connect to background script to handle popup lifecycle
      const port = chrome.runtime.connect({ name: "popup" });

      // Get the lastHighlight from storage
      chrome.storage.local.get(['lastHighlight'], (result) => {
        if (result.lastHighlight) {
          setSelectedText(result.lastHighlight);
        }
        setIsLoading(false);
      });

      // Listen for storage changes
      const handleStorageChange = (changes: { [key: string]: chrome.storage.StorageChange }) => {
        if (changes.lastHighlight) {
          setSelectedText(changes.lastHighlight.newValue);
        }
      };

      chrome.storage.local.onChanged.addListener(handleStorageChange);

      // Cleanup
      return () => {
        port.disconnect();
        chrome.storage.local.onChanged.removeListener(handleStorageChange);
      };
    } else {
      setIsLoading(false);
    }
  }, [isExtension]);

  const [imageCheckResult, setImageCheckResult] = useState<SightEngineResponse>();
  const [image, setImage] = useState("");
  useEffect(() => {
    // Connect to background script
    const port = chrome.runtime.connect({ name: "popup" });

    chrome.storage.local.get(['imageUrl'], (result) => {
      if (result.imageUrl) {
        setImage(result.imageUrl);
        console.log(image);
      }
    });

    // Cleanup
    return () => {
      port.disconnect();
    };
  }, []);

  useEffect(() => {
    if (image) {
      const checkImageUrl = async () => {
        const result = await checkImage(image);
        if (result !== undefined) {
          setImageCheckResult(result);
        }
      };
      checkImageUrl();
    }
  }, [image]);

  const handleFactCheck = async () => {
    if (!selectedText) return;

    try {
      console.log('Fact checking:', selectedText);
      // Add your fact-checking logic here
    } catch (error) {
      console.error('Error fact checking:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 min-w-[300px] min-h-[200px] flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-4 min-w-[300px] min-h-[300px]">
      <h1 className="text-xl font-bold mb-4">Fact Checker with the crew</h1>

      {selectedText ? (
        <div className="space-y-4">
          <div className="p-3 bg-gray-100 rounded-lg">
            <h2 className="text-sm font-semibold mb-2">Selected Text:</h2>
            <p className="text-gray-700">{selectedText}</p>
          </div>

          <button
            onClick={handleFactCheck}
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Fact Check
          </button>
        </div>
      ) : (
        <p className="text-gray-500">
          Highlight text on any webpage and right-click to fact check it.
        </p>
      )}
      {image && <img src={image} alt="Selected" />}
      {imageCheckResult && (
        <div>
          <h3>Image Check Result:</h3>
          {isPending && <div className="loader">Loading...</div>}
          {!isPending && <p>AI Generated: {imageCheckResult.type.ai_generated}</p>}
        </div>
      )}

      {/* Debug information */}
      {/* <div className="mt-4 text-xs text-gray-500">
        Extension ID: {chrome?.runtime?.id || 'Not available'}
      </div> */}
    </div>
  );
};

export default App;