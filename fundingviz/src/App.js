import React from 'react';
import './App.css';
import BubbleChart from './components/bubbleChart';

function App() {
  return (
    <div className="App">
      <div className="p-3 mb-2 bg-transparent text-dark">
        Funding by Industry Analytics
      </div>
      <BubbleChart/>
    </div>
  );
}

export default App;
