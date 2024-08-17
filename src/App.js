// src/App.js
import React from 'react';
import GamesList from './components/GamesList';
import './App.css';

function App() {
  return (
    <div className="App">
      <h1>Available Games</h1>
      <GamesList />
    </div>
  );
}

export default App;
