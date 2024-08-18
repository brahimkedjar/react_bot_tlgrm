import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Grid, Card, CardContent, CardActions, Snackbar, Alert } from '@mui/material';
import { getCombos, updateCombo, deleteCombo, addCombo } from './firebase';

export default function ComboManagement({ game }) {
  const [combos, setCombos] = useState([]);
  const [newCombo, setNewCombo] = useState({ name: '', mediaUrl: '', content: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editComboId, setEditComboId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    const fetchCombos = async () => {
      try {
        const fetchedCombos = await getCombos(game.id);
        setCombos(fetchedCombos);
      } catch (error) {
        console.error('Error fetching combos:', error);
      }
    };
    fetchCombos();
  }, [game.id]);

  const handleUpdateCombo = async () => {
    try {
      if (isEditing && editComboId) {
        await updateCombo(game.id, editComboId, newCombo);
        const updatedCombos = combos.map(combo =>
          combo.id === editComboId ? { ...combo, ...newCombo } : combo
        );
        setCombos(updatedCombos);
        setSnackbarMessage('Combo updated successfully!');
      } else {
        const comboRef = await addCombo(game.id, newCombo);
        const addedCombo = { ...newCombo, id: comboRef.id };
        setCombos([...combos, addedCombo]);
        setSnackbarMessage('Combo added successfully!');
      }
      setNewCombo({ name: '', mediaUrl: '', content: '' });
      setIsEditing(false);
      setEditComboId(null);
    } catch (error) {
      console.error('Error updating or adding combo:', error);
      setSnackbarMessage('An error occurred. Please try again.');
    }
    setSnackbarOpen(true);
  };

  const handleEditCombo = (combo) => {
    setNewCombo(combo);
    setIsEditing(true);
    setEditComboId(combo.id);
  };

  const handleDeleteCombo = async (comboId) => {
    try {
      await deleteCombo(game.id, comboId);
      setCombos(combos.filter((combo) => combo.id !== comboId));
      setSnackbarMessage('Combo deleted successfully!');
    } catch (error) {
      console.error('Error deleting combo:', error);
      setSnackbarMessage('An error occurred while deleting the combo.');
    }
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // Utility function to determine if a URL is a video
  const isVideoUrl = (url) => {
    return url.match(/\.(mp4|webm|ogg)$/i);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: 'auto' }}>
      <Typography variant="h4" gutterBottom align="center" style={{ marginBottom: '20px', color: '#3f51b5' }}>
        Manage Combos for {game.name}
      </Typography>

      <TextField
        label="Combo Name"
        fullWidth
        margin="normal"
        value={newCombo.name}
        onChange={(e) => setNewCombo({ ...newCombo, name: e.target.value })}
        variant="outlined"
        InputProps={{ style: { borderRadius: '10px' } }}
      />
      <TextField
        label="Media URL"
        fullWidth
        margin="normal"
        value={newCombo.mediaUrl}
        onChange={(e) => setNewCombo({ ...newCombo, mediaUrl: e.target.value })}
        variant="outlined"
        InputProps={{ style: { borderRadius: '10px' } }}
      />
      <TextField
        label="Combo Content (Text)"
        fullWidth
        margin="normal"
        value={newCombo.content}
        onChange={(e) => setNewCombo({ ...newCombo, content: e.target.value })}
        variant="outlined"
        InputProps={{ style: { borderRadius: '10px' } }}
        multiline
        rows={4}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleUpdateCombo}
        style={{ marginTop: '20px', padding: '10px 20px', textTransform: 'uppercase' }}
      >
        {isEditing ? 'Update Combo' : 'Add Combo'}
      </Button>

      <Grid container spacing={3} style={{ marginTop: '20px' }}>
        {combos.map((combo) => (
          <Grid item xs={12} sm={6} md={4} key={combo.id}>
            <Card
              className="combo-card"
              style={{
                borderRadius: '15px',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.3s ease-in-out',
                '&:hover': { transform: 'scale(1.05)' },
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom style={{ fontWeight: 'bold', color: '#3f51b5' }}>
                  {combo.name}
                </Typography>
                {combo.mediaUrl && (
                  isVideoUrl(combo.mediaUrl) ? (
                    <video
                      src={combo.mediaUrl}
                      controls
                      style={{
                        width: '100%',
                        height: '200px',
                        objectFit: 'cover',
                        borderRadius: '10px',
                        marginBottom: '10px',
                      }}
                    />
                  ) : (
                    <img
                      src={combo.mediaUrl}
                      alt={combo.name}
                      style={{
                        width: '100%',
                        height: '200px',
                        objectFit: 'cover',
                        borderRadius: '10px',
                        marginBottom: '10px',
                        filter: 'brightness(90%)',
                        transition: 'filter 0.3s ease-in-out',
                      }}
                    />
                  )
                )}
                {combo.content && (
                  <Typography variant="body2" color="textSecondary">
                    {combo.content}
                  </Typography>
                )}
              </CardContent>
              <CardActions>
                <Button size="small" color="primary" onClick={() => handleEditCombo(combo)}>
                  Edit
                </Button>
                <Button size="small" color="secondary" onClick={() => handleDeleteCombo(combo.id)}>
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" variant="filled">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
