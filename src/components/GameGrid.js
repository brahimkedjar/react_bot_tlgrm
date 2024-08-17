import React from 'react';
import AdvancedGameCard from './AdvancedGameCard';
import gamesData from '../games.json'; // Import the JSON file

const GameGrid = () => {
  const games = gamesData.games; // Access the games array

  return (
    <div className="game-grid">
      {games.map((game, index) => (
        <AdvancedGameCard key={index} game={game} />
      ))}
    </div>
  );
};

export default GameGrid;