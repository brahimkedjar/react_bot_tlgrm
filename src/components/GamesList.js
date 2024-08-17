// src/components/GamesList.js
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import GameCard from './GameCard';

const GamesList = () => {
  const [games, setGames] = useState([]);

  useEffect(() => {
    const fetchGames = async () => {
      const querySnapshot = await getDocs(collection(db, "games"));
      setGames(querySnapshot.docs.map(doc => doc.data()));
    };

    fetchGames();
  }, []);

  return (
    <div className="games-list">
      {games.map((game, index) => (
        <GameCard key={index} game={game} />
      ))}
    </div>
  );
};

export default GamesList;
