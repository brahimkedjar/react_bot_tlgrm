// src/components/AdvancedGameCard.js
import React from 'react';
import './AdvancedGameCard.css';

const AdvancedGameCard = ({ game }) => {
  return (
    <div className="advanced-game-card">
      <img src={game.image} alt={game.name} className="advanced-game-card-image" />
      <div className="advanced-game-card-overlay">
        <h3 className="advanced-game-card-title">{game.name}</h3>
        <p className="advanced-game-card-description">{game.description}</p>
        <a href={game.link} className="advanced-game-card-button">Play Now</a>
      </div>
    </div>
  );
};

export default AdvancedGameCard;
