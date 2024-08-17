// src/components/GameCard.js
import React from 'react';
import './GameCard.css'; // Import the CSS file

const GameCard = ({ game }) => {
  return (
    <div className="game-card">
      <img src={game.image} alt={game.name} className="game-card-image" />
      <div className="game-card-content">
        <h3 className="game-card-title">{game.name}</h3>
        <p className="game-card-description">{game.description}</p>
      </div>
    </div>
  );
};

export default GameCard;