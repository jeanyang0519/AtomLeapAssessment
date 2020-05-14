import React from 'react';
import './App.css';
import BubbleChart from './components/bubbleChart';

function App() {
  return (
    <div className="App">
      <h2 className="p-3 mb-2">
        Funding by Industry Analytics
      </h2>
      <BubbleChart/>
    </div>
  );
}

export default App;
