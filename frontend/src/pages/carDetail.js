import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, makeStyles, Button, Box, CircularProgress } from '@material-ui/core';
import {
  LocationOn as LocationOnIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Stars as StarsIcon,
  Storefront as StorefrontIcon,
} from '@material-ui/icons';
import { Link } from 'react-router-dom';
import testimonialsData from './testimonialsData'; // Import testimonials data
import config from '../config';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: theme.spacing(5),
  },
  imageContainer: {
    width: '100%',
    height: '65vh',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    marginBottom: theme.spacing(3),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
    textAlign: 'center',
  },
  content: {
    width: '95%',
    padding: theme.spacing(2),
    border: '1px solid #ccc',
    borderRadius: '5px',
    backgroundColor: '#f9f9f9',
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
  },
  section: {
    width: '100%',
    marginBottom: theme.spacing(3),
  },
  priceContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing(1),
  },
  featuresList: {
    listStyleType: 'none',
    paddingLeft: 0,
  },
  featureItem: {
    marginBottom: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
  },
  featureIcon: {
    marginRight: theme.spacing(1),
    color: theme.palette.primary.main,
  },
  button: {
    marginLeft: theme.spacing(2),
  },
  agencySection: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2),
    border: '1px solid #ccc',
    borderRadius: '5px',
    backgroundColor: '#f0f0f0',
    marginBottom: theme.spacing(3),
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
  },
  agencyTitle: {
    marginBottom: theme.spacing(1),
    textAlign: 'center',
  },
  agencyDetail: {
    display: 'flex',
    marginBottom: theme.spacing(1),
  },
  testimonialSection: {
    width: '100%',
    marginBottom: theme.spacing(3),
    textAlign: 'center',
  },
  testimonialContent: {
    marginBottom: theme.spacing(1),
  },
  testimonialUser: {
    fontStyle: 'italic',
    color: theme.palette.text.secondary,
  },
  icon: {
    fontSize: 30,
    marginRight: theme.spacing(1),
    color: theme.palette.primary.main,
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
}));

const CardDetail = () => {
  const { id } = useParams();
  const [carData, setCarData] = useState(null);
  const [agencyData, setAgencyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const classes = useStyles();

  useEffect(() => {
    const fetchCarData = async () => {
      try {
        const response = await fetch(`${config.BASE_URL}cars/getCarById`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            carid: id,
          }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setCarData(data.car[0]);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchCarData();
  }, [id]);

  useEffect(() => {
    const fetchAgencyData = async () => {
      try {
        const response = await fetch(`${config.BASE_URL}users/getUserDetails`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: carData.agencyid,
          }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        // Assuming the data is directly the agency object
        setAgencyData(data.userDetails[0]);
      } catch (error) {
        setError(error.message);
      }
    };

    if (carData) {
      fetchAgencyData();
    }
  }, [carData]);

  if (loading) {
    return (
      <div className={classes.loading}>
        <CircularProgress />
      </div>
    );
  }

  if (error || !carData) {
    return (
      <div className={classes.loading}>
        <Typography variant="h5" color="error">
          {error ? error : 'Car not found'}
        </Typography>
      </div>
    );
  }

  // Filter testimonials for the current agency
  const testimonials = testimonialsData.filter((testimonial) => testimonial.agencyId === carData.agencyid);


  return (
    <div className={classes.container}>
      {/* Image Section */}
      <div className={classes.imageContainer} style={{ backgroundImage: `url(${carData.imageUrl})` }}>
        <Typography variant="h3">{carData.brand} {carData.model}</Typography>
      </div>

      {/* Car Details Section */}
      <div className={classes.content}>
        <div className={classes.section}>
          <Typography variant="h5" gutterBottom>{carData.brand} {carData.model}</Typography>
          <Typography variant="body1">Description: {carData.about}</Typography>
          <Typography variant="body1">Miles: {carData.miles}</Typography>
          <Typography variant="body1">Seater: {carData.seater}</Typography>
          <div className={classes.priceContainer}>
            <Typography variant="body1">Price: {carData.price}</Typography>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              component={Link}
              to={`/rent/${carData.carid}`}
            >
              Rent
            </Button>
          </div>
        </div>

        {agencyData && (
          <Box className={classes.agencySection}>
              <Typography variant="h5" className={classes.agencyTitle}>Agency Details</Typography>
              <div className={classes.agencyDetail}>
                <StorefrontIcon className={classes.icon} />
                <Typography variant="body1">{agencyData.name}</Typography>
              </div>
              <div className={classes.agencyDetail}>
                <LocationOnIcon className={classes.icon} />
                <Typography variant="body1">{agencyData.address}</Typography>
              </div>
              <div className={classes.agencyDetail}>
                <PhoneIcon className={classes.icon} />
                <Typography variant="body1">{agencyData.phone}</Typography>
              </div>
              <div className={classes.agencyDetail}>
                <EmailIcon className={classes.icon} />
                <Typography variant="body1">{agencyData.email}</Typography>
              </div>
          </Box>
        )}

        {/* Features Section */}
        <Typography variant="body1">Features:</Typography>
          <ul className={classes.featuresList}>
            {JSON.parse(carData.features).map((feature, index) => (
              <li key={index} className={classes.featureItem}>
                <StarsIcon className={classes.featureIcon} />
                <Typography variant="body2">{feature}</Typography>
              </li>
            ))}
          </ul>
      </div>
    </div>
  );
};

export default CardDetail;
