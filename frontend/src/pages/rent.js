import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography,
  makeStyles,
  Button,
  TextField,
  Box,
  CircularProgress,
} from '@material-ui/core';
import config from '../config';

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(15),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: theme.spacing(5),
  },
  content: {
    width: '40%',
    padding: theme.spacing(2),
    border: '1px solid #ccc',
    borderRadius: '5px',
    backgroundColor: '#f9f9f9',
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
  },
  textField: {
    marginBottom: theme.spacing(3),
  },
  button: {
    marginTop: theme.spacing(2),
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
  totalRentContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
  totalRentText: {
    marginRight: theme.spacing(2),
  },
  submitButton: {
    marginTop: theme.spacing(2),
  },
}));

const Rent = () => {
  const { carid } = useParams();
  const classes = useStyles();
  const navigate = useNavigate();
  const [carData, setCarData] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalRent, setTotalRent] = useState(0);
  const [days, setDays] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userid = localStorage.getItem('userid');

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
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchCarData();
  }, [carid]);

  const calculateRent = () => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const timeDiff = end - start;
      const daysDiff = timeDiff / (1000 * 3600 * 24) + 1;
      setDays(daysDiff);
      const total = daysDiff * carData.price;
      setTotalRent(total);
    }
  };

  const handleRent = async () => {
    if (!startDate || !endDate) {
      alert('Please select both start and end dates.');
      return;
    }

    if (totalRent === 0) {
      alert('Please calculate the rent before submitting.');
      return;
    }

    try {
      const response = await fetch(`${config.BASE_URL}booking/bookingDetails`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          carid: carData.carid,
          userid: userid,
          agencyid: carData.agencyid,
          startdate: startDate,
          enddate: endDate,
          days: days,
          price: totalRent,
          status: "Pending"
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      localStorage.setItem('bookingid', data.bookingid);
      setLoading(false);
      // Navigate to payment page
      navigate(`/payment/${carData.carid}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

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
          {error ? error : 'Booking Details not found'}
        </Typography>
      </div>
    );
  }

  return (
    <div className={classes.container}>
      <div className={classes.content}>
        <Typography variant="h5" gutterBottom>Rent {carData.brand} {carData.model}</Typography>
        <TextField
          label="Start Date"
          type="date"
          value={startDate}
          required
          onChange={(e) => setStartDate(e.target.value)}
          className={classes.textField}
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            inputProps: { min: today }
          }}
          fullWidth
        />
        <TextField
          label="End Date"
          type="date"
          value={endDate}
          required
          onChange={(e) => setEndDate(e.target.value)}
          className={classes.textField}
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            inputProps: { min: startDate || today }
          }}
          fullWidth
        />
        <Box className={classes.totalRentContainer}>
          <Typography variant="body1" className={classes.totalRentText}>
            Total Rent: {totalRent}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={calculateRent}
          >
            Calculate Rent
          </Button>
        </Box>
        <Button
          variant="contained"
          color="primary"
          className={classes.submitButton}
          onClick={handleRent}
          fullWidth
          disabled={!startDate || !endDate || totalRent === 0}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default Rent;
