import React from 'react';
import { Typography, Grid, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import carImage from '../images/bg.png';

const AgencyHome = () => {
  return (
    <div style={{ height: '100vh', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      <div style={{ backgroundImage: `url(${carImage})`, height: '100%', width: '100%', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
        <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', height: '100%', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', position: 'absolute', top: 0, left: 0 }}>
          <Typography variant="h5" align="center" style={{ color: 'white', marginBottom: '10px' }}>
            Welcome to the Car Rental Service
          </Typography>
          <Typography variant="body1" align="center" style={{ color: 'white', marginBottom: '20px' }}>
            Browse and rent the best cars available.
          </Typography>
          <Grid container spacing={3} justifyContent="center" style={{ width: '100%', padding: '0 20px' }}>
            <Grid item>
              <Button variant="contained" color="primary" size="large" component={Link} to="/addCar">
                Add Car
              </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" color="secondary" size="large" component={Link} to="/agencyCarDetail">
                Car Details
              </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" color="info" size="large" component={Link} to="/agencyBookings">
                View Bookings
              </Button>
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
};

export default AgencyHome;
