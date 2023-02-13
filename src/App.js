import React from 'react';
import GameModal from './components/GameModal';
import game from './game.json';
import './App.css';

function App() {
  return (
    <div className="container">
      <h1>Actually Adventure</h1>
      <GameModal game={ game } />
    </div>
  );
}

export default App;
