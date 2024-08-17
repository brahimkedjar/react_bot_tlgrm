// src/components/GameCard.js
import React from 'react';

const GameCard = ({ game }) => {
  return (
    <div className="game-card">
      <img src={game.image} alt={game.name} />
      <h3>{game.name}</h3>
    </div>
  );
};

export default GameCard;
