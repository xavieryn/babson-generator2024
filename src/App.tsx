import { checkImage } from "./action";

import { useEffect, useState } from "react";
import { SightEngineResponse } from "./type";

function App() {
  const [imageCheckResult, setImageCheckResult] = useState<SightEngineResponse>();
  const [image, setImage] = useState("");
  useEffect(() => {
    console.log('asdlkajsdlkf');
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

  
  const handleClick = async () => {
    const result = await checkImage(image);
    if (result !== undefined) {
      setImageCheckResult(result);
    }
  };

  return (
    <div className="App">
      Hello World
      <button onClick={handleClick}>Check Images</button>
      {image && <img src={image} alt="Selected" />}
      {imageCheckResult && (
        <div>
          <h3>Image Check Result:</h3>
          <pre>{JSON.stringify(imageCheckResult, null, 2)}</pre>
        </div>
      )}
    </div>

  );
}

export default App;