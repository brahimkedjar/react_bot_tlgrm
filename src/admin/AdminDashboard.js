import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Typography, Grid, Card, CardContent, CardActions } from '@mui/material';
import ComboManagement from './ComboManagement';
import { addGame, deleteGame, getGames, updateGame } from './firebase';

export default function AdminDashboard() {
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);

  useEffect(() => {
    const fetchGames = async () => {
      const fetchedGames = await getGames();
      setGames(fetchedGames);
    };
    fetchGames();
  }, []);

  const handleAddGame = async () => {
    const newGame = { name, image, description };
    const gameRef = await addGame(newGame);
    const addedGame = { ...newGame, id: gameRef.id };
    setGames([...games, addedGame]);
    setName('');
    setImage('');
    setDescription('');
  };

  const handleUpdateGame = async () => {
    if (selectedGame) {
      const updatedGame = { name, image, description };
      await updateGame(selectedGame.id, updatedGame);
      setGames(games.map(game => (game.id === selectedGame.id ? { ...game, ...updatedGame } : game)));
      setSelectedGame(null);
      setName('');
      setImage('');
      setDescription('');
    }
  };

  const handleDeleteGame = async (gameId) => {
    await deleteGame(gameId);
    setGames(games.filter((game) => game.id !== gameId));
  };

  const handleManageCombos = (game) => {
    setSelectedGame(game);
  };

  const handleEditGame = (game) => {
    setSelectedGame(game);
    setName(game.name);
    setImage(game.image);
    setDescription(game.description);
  };

  return (
    <Container className="container" maxWidth="md">
      <Typography variant="h4" gutterBottom>{selectedGame ? 'Edit Game' : 'Add New Game'}</Typography>
      <TextField
        label="Game Name"
        fullWidth
        margin="normal"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <TextField
        label="Image URL"
        fullWidth
        margin="normal"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <TextField
        label="Description"
        fullWidth
        margin="normal"
        multiline
        rows={4}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={selectedGame ? handleUpdateGame : handleAddGame}
      >
        {selectedGame ? 'Update Game' : 'Add Game'}
      </Button>

      <Grid container spacing={3} style={{ marginTop: '20px' }}>
        {games.map((game) => (
          <Grid item xs={12} sm={6} md={4} key={game.id}>
            <Card className="card">
              <CardContent>
                <Typography variant="h5">{game.name}</Typography>
                <img src={game.image} alt={game.name} style={{ width: '100%' }} />
                <Typography variant="body2">{game.description}</Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary" onClick={() => handleManageCombos(game)}>Manage Combos</Button>
                <Button size="small" color="primary" onClick={() => handleEditGame(game)}>Update Game</Button>
                <Button size="small" color="secondary" onClick={() => handleDeleteGame(game.id)}>Delete</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {selectedGame && <ComboManagement game={selectedGame} />}
    </Container>
  );
}
