import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Typography, makeStyles, CircularProgress } from '@material-ui/core';
import config from '../config';

const headers = [
  { field: 'userId', headerName: 'ID', width: 120 },
  { field: 'name', headerName: 'Name', width: 150 },
  { field: 'agencyname', headerName: 'Agency Name', width: 150 },
  { field: 'brand', headerName: 'Car Brand', width: 150 },
  { field: 'model', headerName: 'Car Model', width: 150 },
  { field: 'price', headerName: 'Price', width: 120 },
  { field: 'startdate', headerName: 'Start Date', width: 150 },
  { field: 'enddate', headerName: 'End Date', width: 150 },
  { field: 'status', headerName: 'Status', width: 120 },
];

const useStyles = makeStyles((theme) => ({
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
}));

const Bookings = () => {
  const classes = useStyles();
  const [bookingData, setBookingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        const response = await fetch(`${config.BASE_URL}booking/getBookingDetails`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const bookings = data.booking;

        const bookingDetailsPromises = bookings.map(async (booking) => {
          // Fetch car details
          const carResponse = await fetch(`${config.BASE_URL}cars/getCarById`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ carid: booking.carid }),
          });
          if (!carResponse.ok) {
            throw new Error(`Failed to fetch car details for booking ID: ${booking.userId}`);
          }
          const carData = await carResponse.json();

          // Fetch user details
          const userResponse = await fetch(`${config.BASE_URL}users/getUserDetails`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: booking.userid }),
          });
          if (!userResponse.ok) {
            throw new Error(`Failed to fetch user details for user ID: ${booking.userId}`);
          }
          const userData = await userResponse.json();

          const agencyResponse = await fetch(`${config.BASE_URL}users/getUserDetails`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: booking.agencyid }),
          });
          if (!agencyResponse.ok) {
            throw new Error(`Failed to fetch user details for user ID: ${booking.userId}`);
          }
          const agencyData = await agencyResponse.json();

          return {
            id: booking._id,
            userId: userData.userDetails[0].userId,
            name: userData.userDetails[0].name,
            agencyname: agencyData.userDetails[0].name,
            brand: carData.car[0].brand,
            model: carData.car[0].model,
            price: carData.car[0].price,
            startdate: booking.startdate,
            enddate: booking.enddate,
            status: booking.status,
          };
        });

        const bookingDetails = await Promise.all(bookingDetailsPromises);
        setBookingData(bookingDetails);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingData();
  }, []);

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
    <div style={{ height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h5" gutterBottom style={{ textAlign: 'center', marginTop: '120px' }}>Booking Details</Typography>
      <div style={{ height: 500, width: '90%', marginTop: '20px' }}>
        <DataGrid
          rows={bookingData}
          columns={headers}
          pageSize={5}
          checkboxSelection
        />
      </div>
    </div>
  );
};

export default Bookings;
