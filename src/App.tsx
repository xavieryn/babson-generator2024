import React, { useEffect, useState } from 'react';
import { ChatCompletion } from './types';
import './index.css';
import ReactMarkdown from 'react-markdown';



const App: React.FC = () => {
  const [selectedText, setSelectedText] = useState<string>('');
  const [citations, setCitations] = useState<Array<string>>([]);
  const [firstWord, setFirstWord] = useState<string>('');
  const [factCheckResult, setFactCheckResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const apiKey = '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';

  useEffect(() => {
    // Connect to background script
    const port = chrome.runtime.connect({ name: "popup" });

    // Get initial state from storage
    chrome.storage.local.get(['lastHighlight', 'factCheckResult', 'isLoading', 'error'], (result) => {
      if (result.lastHighlight) {
        setSelectedText(result.lastHighlight);
        handleSearch(result.lastHighlight); // Automatically search when there's a new highlight
      }
      if (result.factCheckResult) {
        setFactCheckResult(result.factCheckResult);
      }
      if (result.error) {
        setError(result.error);
      }
      setIsLoading(result.isLoading || false);
    });

    // Listen for storage changes
    const handleStorageChange = (changes: { [key: string]: chrome.storage.StorageChange }) => {
      if (changes.lastHighlight) {
        setSelectedText(changes.lastHighlight.newValue);
        handleSearch(changes.lastHighlight.newValue); // Automatically search when there's a new highlight
      }
      if (changes.factCheckResult) {
        setFactCheckResult(changes.factCheckResult.newValue);
      }
      if (changes.isLoading) {
        setIsLoading(changes.isLoading.newValue);
      }
      if (changes.error) {
        setError(changes.error.newValue);
      }
    };

    chrome.storage.local.onChanged.addListener(handleStorageChange);

    // Cleanup
    return () => {
      port.disconnect();
      chrome.storage.local.onChanged.removeListener(handleStorageChange);
    };
  }, []);

  const handleSearch = async (text: string) => {
    setIsLoading(true);
    setError(null);
    const Prompt = 'Please fact check this. Keep it a concise response and look for the newest and most reputable sources online. Make sure to keep it within the scope of the question. If the question is opinionated, do not put your opinion and state that the prompt is an opinion and you cannot fact check it. Please type "True", "Probably True", "Unknown" , "Probably False", "Untrue", or "Opinion" in the very start. ';
    const PromptAndText = Prompt + text;
    const options = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "llama-3.1-sonar-huge-128k-online",
        messages: [{ content: PromptAndText, role: "user" }]
      })
    };

    try {
      const response = await fetch('https://api.perplexity.ai/chat/completions', options);
      const data: ChatCompletion = await response.json();
      if (data.choices && data.choices.length > 0) {
        const result = data.choices[0].message.content;
        const citations = data.citations;
        const cleanedInput = removeAsteriskContent(result);
        // Find the first word or phrase and clean it up by removing asterisks
        const firstWordFind = result.split(' ')[0].replace(/\*/g, "");
        
        // Match to find only the valid words or phrases (e.g., true, untrue, etc.)
        const firstWord = firstWordFind.match(/^(true|untrue|unknown|probably true|probably false)/i);
        
        // Set the `firstWord` state to the matched word or an empty string if not found
        setFirstWord(firstWord ? firstWord[0] : "");        
        setFactCheckResult(cleanedInput);
        setCitations(citations);
        chrome.storage.local.set({ factCheckResult: result });
      } else {
        throw new Error('No result from API');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch fact check result');
      chrome.storage.local.set({ error: 'Failed to fetch fact check result' });
    } finally {
      setIsLoading(false);
      chrome.storage.local.set({ isLoading: false });
    }
  };

  function removeAsteriskContent(input: string): string {
    // Remove content enclosed within double asterisks (**...**)
    return input.replace(/\*\*.*?\*\*/g, "").trim();
  }
  return (
    <div className="p-6 mx-auto min-w-[800px] min-h-[600px] max-w-[1000px] flex items-center flex-col border border-gray-300 rounded-lg">
      <h1 className="text-xl font-bold mb-4">Fact Checker</h1>

      {selectedText ? (
        <div className="space-y-4 w-full">
          <div className="p-10 bg-gray-100 rounded-lg">
            <h2 className="text-sm font-semibold mb-2">Selected Text:</h2>
            <p className="text-gray-700">{selectedText}</p>
          </div>

          {isLoading ? (
            <div className="p-4 bg-yellow-50 rounded-lg">
              <p>Analyzing...</p>
            </div>
          ) : factCheckResult ? (
            <div className={`p-4 rounded-lg ${firstWord.toLowerCase() === 'true' ? 'bg-green-100' :
                firstWord.toLowerCase() === 'probably true' ? 'bg-green-50' :
                  firstWord.toLowerCase() === 'untrue' ? 'bg-red-100' :
                    firstWord.toLowerCase() === 'probably false' ? 'bg-red-50' :
                      firstWord.toLowerCase() === 'unknown' ? 'bg-yellow-50' :
                        firstWord.toLowerCase() === 'opinion' ? 'bg-purple-50' :
                          'bg-blue-50' // default fallback
              }`}>


              <h2 className="text-sm font-semibold mb-2">Fact Check Result:</h2>
              <p className="text-gray-700 whitespace-pre-wrap">
                <ReactMarkdown>{factCheckResult}</ReactMarkdown></p>

              <div className="text-gray-700 whitespace-pre-wrap mt-4">
                <h3 className="text-sm font-semibold mb-2">Citations:</h3>
                <ol className="list-decimal pl-5 space-y-2">
                  {citations.map((result, index) => (
                    <li key={index} className="ml-2 hover:text-blue-600 hover:underline transition-colors">
                      <a href={result} target="_blank" rel="noopener noreferrer">{result}</a>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          ) : null}
        </div>
      ) : (
        <p className="text-gray-500">
          Highlight text on any webpage and right-click to fact check it.
        </p>
      )}
    </div>

  );
};

export default App;