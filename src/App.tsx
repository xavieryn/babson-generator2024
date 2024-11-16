import { checkImage, SightEngineResponse } from "./action";

import { useState } from "react";


const [imageCheckResult, setImageCheckResult] = useState<SightEngineResponse | null>(null);

const handleClick = async () => {
  const result = await checkImage();
  if (result !== undefined) {
    setImageCheckResult(result);
  }
};
function App() {
  return (
    <div className="App">
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