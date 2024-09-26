import React, { useState, useEffect } from 'react';
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  makeStyles,
  Button,
  CircularProgress,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import config from '../config';

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(15),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  root: {
    width: '20%',
    margin: theme.spacing(2),
  },
  media: {
    height: 140,
  },
  button: {
    marginLeft: theme.spacing(2),
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
}));

const UserHome = () => {
  const classes = useStyles();
  const [carData, setCarData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCarData = async () => {
      try {
        const response = await fetch(`${config.BASE_URL}cars`);
        if (!response.ok) {
          throw new Error('Failed to fetch cars');
        }
        const data = await response.json();
        console.log('Fetched car data:', data);
        if (data && Array.isArray(data.cars)) {
          setCarData(data.cars);
        } else {
          setCarData([]);
        }
      } catch (error) {
        console.error('Error fetching car data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCarData();
  }, []);

  const handleViewClick = (carId) => {
    console.log(`View button clicked for car with ID: ${carId}`);
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

  if (carData.length === 0) {
    return (
      <div className={classes.noCars}>
        <Typography variant="h5" color="textSecondary">
          No cars found
        </Typography>
      </div>
    );
  }

  return (
    <div className={classes.container}>
      {carData.map((car) => {
        let features = [];
        try {
          features = JSON.parse(car.features[0]);
        } catch (e) {
          console.error('Error parsing features:', e);
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
                  Year: {car.year}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  Description: {car.about}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  Features: {features.join(', ')}
                </Typography>
                <div className={classes.priceContainer}>
                  <Typography variant="body2" color="textSecondary" component="p">
                    Price: {car.price}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick={() => handleViewClick(car.carid)}
                    component={Link}
                    to={`/cardetail/${car.carid}`}
                  >
                    View
                  </Button>
                </div>
              </CardContent>
            </CardActionArea>
          </Card>
        );
      })}
    </div>
  );
};

export default UserHome;
