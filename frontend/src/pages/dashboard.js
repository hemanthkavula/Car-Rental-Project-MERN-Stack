import React, { useState, useEffect } from 'react';
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  makeStyles,
  CircularProgress,
} from '@material-ui/core';
import config from '../config';

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(15),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  root: {
    width: '40%',
    margin: theme.spacing(2),
  },
  media: {
    height: 140,
  },
  priceContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing(1),
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
  noCars: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    flexDirection: 'column',
  },
  inaccessible: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    flexDirection: 'column',
  },
}));

const Dashboard = () => {
  const classes = useStyles();
  const [dashboard, setDashboard] = useState([]);
  const [carDetails, setCarDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const userid = localStorage.getItem('userid');
  const roleid = localStorage.getItem('roleid'); 

  useEffect(() => {
    if(roleid == null){
        window.location.href = '/';
        return;
    }
    if (roleid !== '1') return; // Exit if roleid is not 1

    const fetchBookingData = async () => {
      try {
        console.log('Fetching booking data...');
        const response = await fetch(`${config.BASE_URL}booking/dashboard`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userid }),
        });

        if (!response.ok) {
          throw new Error(response.message);
        }
        const data = await response.json();
        console.log('Booking data:', data);
        if (data && Array.isArray(data.booking)) {
          setDashboard(data.booking);
        } else {
          setDashboard([]);
        }
      } catch (error) {
        console.error('Error fetching booking data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingData();
  }, [userid, roleid]);

  useEffect(() => {
    const fetchCarDetails = async (carIds) => {
      try {
        console.log('Fetching car details for car IDs:', carIds);
        const carDetailsPromises = carIds.map(async (carId) => {
          const response = await fetch(`${config.BASE_URL}cars/getCarById`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ carid: carId }),
          });
          if (!response.ok) {
            throw new Error(`Failed to fetch details for car ID: ${carId}`);
          }
          return response.json();
        });

        const fetchedCarDetails = await Promise.all(carDetailsPromises);
        console.log('Fetched car details:', fetchedCarDetails);
        const flattenedCarDetails = fetchedCarDetails.map((item) => item.car[0]);

        const combinedDetails = dashboard.map((booking) => {
          const carDetail = flattenedCarDetails.find(car => car.carid === booking.carid);
          return {
            ...booking,
            ...carDetail,
          };
        });

        setCarDetails(combinedDetails);
      } catch (error) {
        console.error('Error fetching car details:', error);
        setError(error.message);
      }
    };

    if (dashboard.length > 0) {
      const carIds = [...new Set(dashboard.map((booking) => booking.carid))];
      fetchCarDetails(carIds);
    }
  }, [dashboard]);

  const formatDate = (dateString) => {
    try {
      console.log('Date string:', dateString);
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date');
      }
      const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
      const formattedDate = date.toLocaleDateString(undefined, options);
      return formattedDate;
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
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

  if (roleid !== '1') {
    return (
      <div className={classes.inaccessible}>
        <Typography variant="h5" color="textSecondary">
          This page is inaccessible to agency and admin
        </Typography>
      </div>
    );
  }

  if (carDetails.length === 0) {
    return (
      <div className={classes.noCars}>
        <Typography variant="h5" color="textSecondary">
          No Booking Details Found
        </Typography>
      </div>
    );
  }

  return (
    <div className={classes.container}>
      <Typography variant="h5" gutterBottom>My Bookings</Typography>
      {carDetails.map((car) => {
        console.log(car);
        let features = [];
        if (Array.isArray(car.features) && car.features.length > 0) {
          try {
            features = JSON.parse(car.features[0]);
          } catch (e) {
            console.error('Error parsing features:', e);
          }
        }

        return (
          <Card key={car.carid} className={classes.root}>
            <CardActionArea>
              <CardMedia
                className={classes.media}
                image={car.imageUrl}
                title={`${car.brand} ${car.model}`}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  {car.brand} {car.model}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  Booking Dates: {formatDate(car.startdate)} - {formatDate(car.enddate)}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  Duration: {car.days} days
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  Status: {car.status}
                </Typography>
                <div className={classes.priceContainer}>
                  <Typography variant="body2" color="textSecondary" component="p">
                    Price: {car.price}
                  </Typography>
                </div>
              </CardContent>
            </CardActionArea>
          </Card>
        );
      })}
    </div>
  );
};

export default Dashboard;
