// firebase.js
import { collection, doc, setDoc, deleteDoc, updateDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export const addGame = async (game) => {
  const gameRef = doc(collection(db, 'games'));
  await setDoc(gameRef, { ...game, id: gameRef.id });
  return gameRef;
};

export const updateGame = async (gameId, gameData) => {
  const gameRef = doc(db, 'games', gameId);
  await updateDoc(gameRef, gameData);
};

export const deleteGame = async (gameId) => {
  const gameRef = doc(db, 'games', gameId);
  await deleteDoc(gameRef);
};

export const getGames = async () => {
  const gamesSnapshot = await getDocs(collection(db, 'games'));
  const gamesList = gamesSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
  return gamesList;
};

export const getCombos = async (gameId) => {
  const combosSnapshot = await getDocs(collection(db, 'games', gameId, 'combos'));
  return combosSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
};

export const addCombo = async (gameId, combo) => {
  const comboRef = doc(collection(db, 'games', gameId, 'combos'));
  await setDoc(comboRef, { ...combo, id: comboRef.id });
  return comboRef;
};

// Function to update a combo
export const updateCombo = async (gameId, comboId, comboData) => {
  if (!gameId || !comboId) {
    console.error("Invalid gameId or comboId");
    return;
  }

  try {
    const comboRef = doc(db, 'games', gameId, 'combos', comboId);
    await updateDoc(comboRef, comboData);
  } catch (error) {
    console.error("Error updating combo:", error);
  }
};

export const deleteCombo = async (gameId, comboId) => {
  const comboRef = doc(db, 'games', gameId, 'combos', comboId);
  await deleteDoc(comboRef);
};