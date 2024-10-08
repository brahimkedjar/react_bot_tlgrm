import React, { useState, useEffect } from 'react';
import { Container, Grid, Card, CardContent, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, Zoom, Slide } from '@mui/material';
import { collection, getDocs, doc } from 'firebase/firestore';
import { db } from '../firebase';

export default function UserDashboard() {
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [isComboDialogOpen, setIsComboDialogOpen] = useState(false);
  const [selectedCombo, setSelectedCombo] = useState(null);
  const [isComboContentDialogOpen, setIsComboContentDialogOpen] = useState(false);
  const [mediaUrl, setMediaUrl] = useState(null);
  const [isMediaDialogOpen, setIsMediaDialogOpen] = useState(false);

  useEffect(() => {
    const fetchGames = async () => {
      const gamesCollection = collection(db, 'games');
      const gamesSnapshot = await getDocs(gamesCollection);
      const gamesList = await Promise.all(
        gamesSnapshot.docs.map(async (gameDoc) => {
          const combosCollection = collection(doc(db, 'games', gameDoc.id), 'combos');
          const combosSnapshot = await getDocs(combosCollection);
          const combosList = combosSnapshot.docs.map((comboDoc) => ({ id: comboDoc.id, ...comboDoc.data() }));
          return { id: gameDoc.id, ...gameDoc.data(), combos: combosList };
        })
      );
      setGames(gamesList);
    };
    fetchGames();
  }, []);

  const handleOpenCombos = (game) => {
    setSelectedGame(game);
    setIsComboDialogOpen(true);
  };

  const handleCloseCombos = () => {
    setIsComboDialogOpen(false);
    setSelectedGame(null);
  };

  const handleOpenComboContent = (combo) => {
    setSelectedCombo(combo);
    setIsComboContentDialogOpen(true);
  };

  const handleCloseComboContent = () => {
    setIsComboContentDialogOpen(false);
    setSelectedCombo(null);
  };

  const handleOpenMediaDialog = (url) => {
    setMediaUrl(url);
    setIsMediaDialogOpen(true);
  };

  const handleCloseMediaDialog = () => {
    setIsMediaDialogOpen(false);
    setMediaUrl(null);
  };

  // Helper function to determine if a URL is a video
  const isVideoUrl = (url) => {
    return url.match(/\.(mp4|webm|ogg)$/i);
  };

  return (
    <Container className="container" maxWidth="lg" style={{ padding: '40px 20px' }}>
      <Typography 
        variant="h3" 
        gutterBottom 
        align="center" 
        style={{ fontWeight: 'bold', marginBottom: '15px', color: '#3f51b5', textTransform: 'uppercase', letterSpacing: '2px' }}
      >
        Available Games 
      </Typography>
      <Grid container spacing={4}>
        {games.map((game) => (
          <Grid item xs={12} sm={6} md={4} key={game.id}>
            <Zoom in={true}>
              <Card 
                className="card" 
                style={{ 
                  borderRadius: '20px', 
                  overflow: 'hidden', 
                  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)', 
                  transition: 'transform 0.3s ease-in-out', 
                  transform: 'scale(1)', 
                  '&:hover': { transform: 'scale(1.05)' } 
                }}
              >
                <img 
                  src={game.image} 
                  alt={game.name} 
                  style={{ 
                    width: '100%', 
                    height: '200px', 
                    objectFit: 'cover', 
                    filter: 'brightness(90%)', 
                    transition: 'filter 0.3s ease-in-out' 
                  }}
                />
                <CardContent style={{ padding: '20px', textAlign: 'center' }}>
                  <Typography 
                    variant="h5" 
                    gutterBottom 
                    style={{ 
                      fontWeight: 'bold', 
                      color: '#3f51b5', 
                      marginBottom: '15px' 
                    }}
                  >
                    {game.name}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="textSecondary" 
                    style={{ marginBottom: '20px' }}
                  >
                    {game.description}
                  </Typography>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    style={{ padding: '10px 20px', textTransform: 'uppercase' }} 
                    onClick={() => handleOpenCombos(game)}
                  >
                    View Combos
                  </Button>
                </CardContent>
              </Card>
            </Zoom>
          </Grid>
        ))}
      </Grid>

      {selectedGame && (
        <Dialog 
          open={isComboDialogOpen} 
          onClose={handleCloseCombos} 
          fullWidth 
          maxWidth="md" 
          TransitionComponent={Slide} 
          TransitionProps={{ direction: "up" }} 
          PaperProps={{
            style: { 
              borderRadius: '20px', 
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)' 
            }
          }}
        >
          <DialogTitle 
            style={{ 
              fontWeight: 'bold', 
              textAlign: 'center', 
              fontSize: '1.5rem', 
              color: '#3f51b5' 
            }}
          >
            {selectedGame.name} - Daily Combos
          </DialogTitle>
          <DialogContent dividers style={{ padding: '30px' }}>
            {selectedGame.combos && selectedGame.combos.length > 0 ? (
              <Grid container spacing={2}>
                {selectedGame.combos.map((combo) => (
                  <Grid item xs={12} sm={6} md={4} key={combo.id}>
                    <Zoom in={true}>
                      <Card 
                        className="combo-card" 
                        style={{ 
                          borderRadius: '15px', 
                          overflow: 'hidden', 
                          cursor: 'pointer', 
                          transition: 'transform 0.3s ease-in-out', 
                          '&:hover': { transform: 'scale(1.05)' } 
                        }} 
                        onClick={() => handleOpenComboContent(combo)}
                      >
                        <CardContent style={{ padding: '15px', textAlign: 'center' }}>
                          <Typography 
                            variant="subtitle1" 
                            gutterBottom 
                            style={{ 
                              fontWeight: 'bold', 
                              color: '#3f51b5', 
                              marginBottom: '10px' 
                            }}
                          >
                            {combo.name}
                          </Typography>
                          {combo.mediaUrl && (
                            isVideoUrl(combo.mediaUrl) ? (
                              <video 
                                controls 
                                style={{ 
                                  width: '100%', 
                                  height: '150px', 
                                  objectFit: 'cover', 
                                  borderRadius: '10px', 
                                  cursor: 'pointer'
                                }} 
                                onClick={() => handleOpenMediaDialog(combo.mediaUrl)}
                              >
                                <source src={combo.mediaUrl} type="video/mp4" />
                                Your browser does not support the video tag.
                              </video>
                            ) : (
                              <img 
                                src={combo.mediaUrl} 
                                alt={combo.name} 
                                style={{ 
                                  width: '100%', 
                                  height: '150px', 
                                  objectFit: 'cover', 
                                  borderRadius: '10px', 
                                  filter: 'brightness(90%)', 
                                  transition: 'filter 0.3s ease-in-out', 
                                  cursor: 'pointer'
                                }} 
                                onClick={() => handleOpenMediaDialog(combo.mediaUrl)}
                              />
                            )
                          )}
                          {combo.content && (
                            <Typography 
                              variant="body2" 
                              color="textSecondary"
                            >
                              {combo.content.length > 100 ? combo.content.substring(0, 100) + '...' : combo.content}
                            </Typography>
                          )}
                        </CardContent>
                      </Card>
                    </Zoom>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography 
                variant="body2" 
                color="textSecondary" 
                style={{ textAlign: 'center', fontSize: '1rem' }}
              >
                No combos available for this game.
              </Typography>
            )}
          </DialogContent>
          <DialogActions style={{ justifyContent: 'center', paddingBottom: '20px' }}>
            <Button 
              onClick={handleCloseCombos} 
              color="primary" 
              variant="outlined" 
              style={{ padding: '10px 20px', textTransform: 'uppercase' }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {selectedCombo && (
        <Dialog 
          open={isComboContentDialogOpen} 
          onClose={handleCloseComboContent} 
          fullWidth 
          maxWidth="md" 
          TransitionComponent={Slide} 
          TransitionProps={{ direction: "up" }} 
          PaperProps={{
            style: { 
              borderRadius: '20px', 
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)' 
            }
          }}
        >
          <DialogTitle 
            style={{ 
              fontWeight: 'bold', 
              textAlign: 'center', 
              fontSize: '1.5rem', 
              color: '#3f51b5' 
            }}
          >
            {selectedCombo.name}
          </DialogTitle>
          <DialogContent dividers style={{ padding: '30px' }}>
            {selectedCombo.mediaUrl && (
              isVideoUrl(selectedCombo.mediaUrl) ? (
                <video 
                  controls 
                  style={{ 
                    width: '100%', 
                    height: 'auto', 
                    objectFit: 'contain', 
                    marginBottom: '20px' 
                  }} 
                  onClick={() => handleOpenMediaDialog(selectedCombo.mediaUrl)}
                >
                  <source src={selectedCombo.mediaUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img 
                  src={selectedCombo.mediaUrl} 
                  alt={selectedCombo.name} 
                  style={{ 
                    width: '100%', 
                    height: 'auto', 
                    objectFit: 'contain', 
                    marginBottom: '20px' 
                  }} 
                  onClick={() => handleOpenMediaDialog(selectedCombo.mediaUrl)}
                />
              )
            )}
            {selectedCombo.content && (
              <Typography 
                variant="body2" 
                color="textSecondary"
              >
                {selectedCombo.content}
              </Typography>
            )}
          </DialogContent>
          <DialogActions style={{ justifyContent: 'center', paddingBottom: '20px' }}>
            <Button 
              onClick={handleCloseComboContent} 
              color="primary" 
              variant="outlined" 
              style={{ padding: '10px 20px', textTransform: 'uppercase' }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}

      <Dialog 
        open={isMediaDialogOpen} 
        onClose={handleCloseMediaDialog} 
        fullWidth 
        maxWidth="md" 
        TransitionComponent={Slide} 
        TransitionProps={{ direction: "up" }} 
        PaperProps={{
          style: { 
            borderRadius: '20px', 
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)' 
          }
        }}
      >
        <DialogTitle 
          style={{ 
            fontWeight: 'bold', 
            textAlign: 'center', 
            fontSize: '1.5rem', 
            color: '#3f51b5' 
          }}
        >
          Combo Media
        </DialogTitle>
        <DialogContent dividers style={{ padding: '30px' }}>
          {mediaUrl && (
            isVideoUrl(mediaUrl) ? (
              <video 
                controls 
                style={{ 
                  width: '100%', 
                  height: 'auto', 
                  objectFit: 'contain' 
                }}
              >
                <source src={mediaUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <img 
                src={mediaUrl} 
                alt="Combo Media" 
                style={{ 
                  width: '100%', 
                  height: 'auto', 
                  objectFit: 'contain' 
                }}
              />
            )
          )}
        </DialogContent>
        <DialogActions style={{ justifyContent: 'center', paddingBottom: '20px' }}>
          <Button 
            onClick={handleCloseMediaDialog} 
            color="primary" 
            variant="outlined" 
            style={{ padding: '10px 20px', textTransform: 'uppercase' }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
