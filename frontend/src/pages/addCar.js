import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  makeStyles,
  Link,
  Snackbar,
  SnackbarContent,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  IconButton,
  Checkbox,
  ListItemText,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import config from '../config';

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(15),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    textAlign: 'center',
  },
  add: {
    textAlign: 'center',
  },
  fileInput: {
    display: 'none',
  },
  uploadButtonContainer: {
    textAlign: 'center',
    marginTop: theme.spacing(2),
  },
  imagePreview: {
    marginTop: theme.spacing(2),
    width: '100%',
    maxHeight: 300,
    objectFit: 'contain',
  },
}));

const AddCar = () => {
  const classes = useStyles();
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [price, setPrice] = useState('');
  const [seater, setSeater] = useState('');
  const [miles, setMiles] = useState('');
  const [features, setFeatures] = useState([]);
  const [about, setAbout] = useState('');
  const [image, setImage] = useState(null);
  const [imageUploaded, setImageUploaded] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const agencyid = localStorage.getItem('userid');
    console.log('Adding car with:', agencyid, brand, model, year, price, seater, miles, features, about, image);

    const formData = new FormData();
    formData.append('brand', brand);
    formData.append('model', model);
    formData.append('year', Number(year));
    formData.append('price', Number(price));
    formData.append('seater', Number(seater));
    formData.append('miles', Number(miles));
    formData.append('features', JSON.stringify(features));
    formData.append('about', about);
    formData.append('agencyid', agencyid);
    formData.append('image', image);

    try {
      const response = await fetch(`${config.BASE_URL}cars/addcar`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        handleSnackbarOpen('Car added successfully!', 'success');
        setTimeout(() => {
          window.location.href = '/agencyHome';
        }, 2000);
      } else {
        const errorData = await response.json();
        handleSnackbarOpen(errorData.message || 'Car addition failed', 'error');
      }
    } catch (error) {
      handleSnackbarOpen('Network error. Please try again later.', 'error');
    }

    setBrand('');
    setModel('');
    setYear('');
    setPrice('');
    setSeater('');
    setMiles('');
    setFeatures([]);
    setAbout('');
    setImage(null);
    setImagePreviewUrl('');
  };

  const handleSnackbarOpen = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImageUploaded(true);
    setImagePreviewUrl(URL.createObjectURL(file));
    handleSnackbarOpen('Image uploaded successfully!', 'success');
  };

  return (
    <Container component="main" maxWidth="xs" className={classes.container}>
      <div>
        <Typography component="h1" variant="h5" className={classes.add}>
          Add a Car
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="brand"
            label="Brand"
            name="brand"
            autoFocus
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="model"
            label="Model"
            name="model"
            value={model}
            onChange={(e) => setModel(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="year"
            label="Year"
            name="year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="price"
            label="Price"
            name="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="seater"
            label="Seater"
            name="seater"
            value={seater}
            onChange={(e) => setSeater(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="miles"
            label="Miles"
            name="miles"
            value={miles}
            onChange={(e) => setMiles(e.target.value)}
          />
          <FormControl fullWidth variant="outlined" margin="normal" required>
            <InputLabel id="features-label">Features</InputLabel>
            <Select
              labelId="features-label"
              id="features"
              multiple
              value={features}
              onChange={(e) => setFeatures(e.target.value)}
              renderValue={(selected) => selected.join(', ')}
              label="Features"
            >
              {featureOptions.map((feature) => (
                <MenuItem key={feature} value={feature}>
                  <Checkbox checked={features.indexOf(feature) > -1} />
                  <ListItemText primary={feature} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="about"
            label="About"
            name="about"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
          />
          <div className={classes.uploadButtonContainer}>
            <input
              accept="image/*"
              required
              className={classes.fileInput}
              id="image"
              type="file"
              onChange={handleImageChange}
            />
            <label htmlFor="image">
              <Button variant="contained" color="primary" component="span">
                Upload Car Image
              </Button>
            </label>
            {imagePreviewUrl && (
              <img src={imagePreviewUrl} alt="Car Preview" className={classes.imagePreview} />
            )}
          </div>
          <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
            Add Car
          </Button>
        </form>
      </div>
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
    </Container>
  );
};

export default AddCar;
