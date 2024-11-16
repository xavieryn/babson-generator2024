import { checkImage } from "./action";
import './index.css';

import { useState } from "react";
import { SightEngineResponse } from "./type";

function App() {
  const [imageCheckResult, setImageCheckResult] = useState<SightEngineResponse>();

  const handleClick = async () => {
    const result = await checkImage();
    if (result !== undefined) {
      setImageCheckResult(result);
    }
  };
  return (
    <div className="App">
      <div className="text-3xl">asdfasdf</div>
      Hello World
      <button onClick={handleClick}>Check Images</button>
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