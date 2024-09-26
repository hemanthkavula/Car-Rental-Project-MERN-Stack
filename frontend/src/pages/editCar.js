import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  TextField, Button, CircularProgress, Typography, makeStyles, Select, MenuItem, InputLabel,Snackbar,
  SnackbarContent,FormControl, Checkbox, ListItemText, IconButton
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import config from '../config';

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(15),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: '100vh',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
  form: {
    width: '100%',
    maxWidth: '600px',
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  button: {
    marginTop: theme.spacing(2),
  },
  uploadButtonContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  imagePreview: {
    width: '100%',
    maxWidth: '300px',
    marginTop: theme.spacing(2),
  },
  fileInput: {
    display: 'none',
  },
}));

const EditCar = () => {
  const { carid } = useParams();
  const classes = useStyles();
  const [carData, setCarData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [features, setFeatures] = useState([]);
  const [error, setError] = useState(null);
  const [id, setId] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const featureOptions = [
    'GPS Navigation',
    'Bluetooth Connectivity',
    'Leather Seats',
    'Sunroof',
    'Heated Seats',
    'Backup Camera',
    'Parking Sensors',
    'Cruise Control',
  ];

  useEffect(() => {
    const fetchCarData = async () => {
      try {
        const response = await fetch(`${config.BASE_URL}cars/getCarById`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            carid: carid,
          }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setCarData(data.car[0]);
        setFeatures(data.car[0].features);
        setId(data.car[0].id);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCarData();
  }, [carid]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCarData({ ...carData, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${config.BASE_URL}cars/updateCar/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            brand: carData.brand,
            model: carData.model,
            year: carData.year,
            price: carData.price,
            seater: carData.seater,
            miles: carData.miles,
            about: carData.about
          }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Car updated successfully:', data);
        handleSnackbarOpen('Car Details Updated successfully!', 'success');
        setTimeout(() => {
          window.location.href = '/agencyCarDetail';
        }, 2000);
      } else {
        const errorData = await response.json();
        handleSnackbarOpen(errorData.message || 'Car Updation failed', 'error');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSnackbarOpen = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };


  if (loading) {
    return (
      <div className={classes.loading}>
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className={classes.loading}>
        <Typography variant="h5" color="error">
          {error}
        </Typography>
      </div>
    );
  }

  return (
    <div className={classes.container}>
      <Typography variant="h5" gutterBottom>Edit Car Details</Typography>
      <form className={classes.form} onSubmit={handleFormSubmit}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="brand"
          label="Brand"
          name="brand"
          value={carData.brand || ''}
          onChange={handleInputChange}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="model"
          label="Model"
          name="model"
          value={carData.model || ''}
          onChange={handleInputChange}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="year"
          label="Year"
          name="year"
          value={carData.year || ''}
          onChange={handleInputChange}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="price"
          label="Price"
          name="price"
          value={carData.price || ''}
          onChange={handleInputChange}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="seater"
          label="Seater"
          name="seater"
          value={carData.seater || ''}
          onChange={handleInputChange}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="miles"
          label="Miles"
          name="miles"
          value={carData.miles || ''}
          onChange={handleInputChange}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="about"
          label="About"
          name="about"
          value={carData.about || ''}
          onChange={handleInputChange}
        />
        <Button type="submit" variant="contained" color="primary" className={classes.button}>
          Update Car
        </Button>
      </form>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        className={classes.snackbar}
      >
        <SnackbarContent
          style={{ backgroundColor: snackbarSeverity === 'error' ? '#f44336' : '#4caf50' }}
          message={
            <span id="client-snackbar" className={classes.message}>
              {snackbarMessage}
            </span>
          }
          action={[
            <IconButton key="close" aria-label="close" color="inherit" onClick={handleSnackbarClose}>
              <CloseIcon />
            </IconButton>,
          ]}
        />
      </Snackbar>
    </div>
  );
};

export default EditCar;
