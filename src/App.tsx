import React from 'react';

interface AppProps {
  // Add any props here if needed
}

const App: React.FC<AppProps> = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">Welcome to My App</h1>
      <p className="text-xl text-gray-700 mb-2">This is a paragraph with Tailwind classes.</p>
      <div className="bg-gray-100 p-4 rounded-lg shadow">
        <p className="text-sm text-gray-600">This is a styled div using Tailwind.</p>
      </div>
    </div>
  );
};

export default App;