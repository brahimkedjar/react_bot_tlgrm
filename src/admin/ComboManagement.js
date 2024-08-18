import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Grid, Card, CardContent, CardActions } from '@mui/material';
import { getCombos, updateCombo, deleteCombo, addCombo } from './firebase';

export default function ComboManagement({ game }) {
  const [combos, setCombos] = useState([]);
  const [newCombo, setNewCombo] = useState({ name: '', content: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editComboId, setEditComboId] = useState(null);

  useEffect(() => {
    const fetchCombos = async () => {
      const fetchedCombos = await getCombos(game.id);
      setCombos(fetchedCombos);
    };
    fetchCombos();
  }, [game.id]);

  const handleUpdateCombo = async () => {
    if (isEditing && editComboId) {
      await updateCombo(game.id, editComboId, newCombo);
      const updatedCombos = combos.map(combo => combo.id === editComboId ? { ...combo, ...newCombo } : combo);
      setCombos(updatedCombos);
      setIsEditing(false);
      setEditComboId(null);
    } else {
      const comboRef = await addCombo(game.id, newCombo);
      const addedCombo = { ...newCombo, id: comboRef.id };
      setCombos([...combos, addedCombo]);
    }
    setNewCombo({ name: '', content: '' });
  };

  const handleEditCombo = (combo) => {
    setNewCombo(combo);
    setIsEditing(true);
    setEditComboId(combo.id);
  };

  const handleDeleteCombo = async (comboId) => {
    await deleteCombo(game.id, comboId);
    setCombos(combos.filter((combo) => combo.id !== comboId));
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>Manage Combos for {game.name}</Typography>

      <TextField
        label="Combo Name"
        fullWidth
        margin="normal"
        value={newCombo.name}
        onChange={(e) => setNewCombo({ ...newCombo, name: e.target.value })}
      />
      <TextField
        label="Combo Content (URL or Text)"
        fullWidth
        margin="normal"
        value={newCombo.content}
        onChange={(e) => setNewCombo({ ...newCombo, content: e.target.value })}
      />
      <Button variant="contained" color="primary" onClick={handleUpdateCombo}>
        {isEditing ? 'Update Combo' : 'Add Combo'}
      </Button>

      <Grid container spacing={3} style={{ marginTop: '20px' }}>
        {combos.map((combo) => (
          <Grid item xs={12} sm={6} md={4} key={combo.id}>
            <Card className="card">
              <CardContent>
                <Typography variant="h5">{combo.name}</Typography>
                {combo.content.startsWith('http') ? (
                  <img src={combo.content} alt={combo.name} style={{ width: '100%' }} />
                ) : (
                  <Typography variant="body2">{combo.content}</Typography>
                )}
              </CardContent>
              <CardActions>
                <Button size="small" color="primary" onClick={() => handleEditCombo(combo)}>Edit</Button>
                <Button size="small" color="secondary" onClick={() => handleDeleteCombo(combo.id)}>Delete</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
