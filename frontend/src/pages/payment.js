import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  makeStyles,
  Button,
  TextField,
  CircularProgress,
  Snackbar,
  SnackbarContent,
  IconButton
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
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
}));

const Payment = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handlePayment = async () => {
    setError(null);
    setLoading(true);

    const bookingid = localStorage.getItem('bookingid');

    if (!cardNumber || !expiryDate || !cvv || !cardholderName) {
      handleSnackbarOpen('All Fields are required', 'error');
      setLoading(false);
      return;
    }

    const cardNumberRegex = /^[0-9]{16}$/;
    if (!cardNumberRegex.test(cardNumber)) {
      handleSnackbarOpen('Card number must be 16 digits.', 'error');
      setLoading(false);
      return;
    }

    const expiryDateRegex = /^(0[1-9]|1[0-2])\/[0-9]{2}$/;
    if (!expiryDateRegex.test(expiryDate)) {
      handleSnackbarOpen('Expiry date must be in MM/YY format.', 'error');
      setLoading(false);
      return;
    }

    const cvvRegex = /^[0-9]{3}$/;
    if (!cvvRegex.test(cvv)) {
      handleSnackbarOpen('CVV must be 3 digits.', 'error');
      setLoading(false);
      return;
    }

    console.log('Processing payment with the following details:');
    console.log(`Card Number: ${cardNumber}`);
    console.log(`Expiry Date: ${expiryDate}`);
    console.log(`CVV: ${cvv}`);
    console.log(`Cardholder Name: ${cardholderName}`);

    try {
      const response = await fetch(`${config.BASE_URL}booking/payment/${bookingid}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: "Confirmed"
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      handleSnackbarOpen('Payment Successful', 'success');
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 2000);
      setLoading(false);
      setCardNumber('');
      setExpiryDate('');
      setCvv('');
      setCardholderName('');
    } catch (error) {
      handleSnackbarOpen(error.message || 'Payment failed', 'error');
      setLoading(false);
    }
  };

  const handleCardNumberChange = (e) => {
    const { value } = e.target;
    if (value === '' || /^[0-9\b]+$/.test(value)) {
      setCardNumber(value);
    }
  };

  const handleCvvChange = (e) => {
    const { value } = e.target;
    if (value === '' || /^[0-9\b]+$/.test(value)) {
      setCvv(value);
    }
  };

  const handleExpiryDateChange = (e) => {
    const { value } = e.target;
    if (value === '' || /^[0-9/]+$/.test(value)) {
      if (value.length === 2 && !value.includes('/')) {
        setExpiryDate(value + '/');
      } else {
        setExpiryDate(value);
      }
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

  return (
    <div className={classes.container}>
      <div className={classes.content}>
        <Typography variant="h5" gutterBottom>Payment Details</Typography>
        <TextField
          label="Card Number"
          type="text"
          value={cardNumber}
          onChange={handleCardNumberChange}
          className={classes.textField}
          inputProps={{ maxLength: 16 }}
          fullWidth
        />
        <TextField
          label="Expiry Date"
          type="text"
          placeholder="MM/YY"
          value={expiryDate}
          onChange={handleExpiryDateChange}
          className={classes.textField}
          inputProps={{ maxLength: 5 }}
          fullWidth
        />
        <TextField
          label="CVV"
          type="text"
          value={cvv}
          onChange={handleCvvChange}
          className={classes.textField}
          inputProps={{ maxLength: 3 }}
          fullWidth
        />
        <TextField
          label="Cardholder Name"
          type="text"
          value={cardholderName}
          onChange={(e) => setCardholderName(e.target.value)}
          className={classes.textField}
          fullWidth
        />
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={handlePayment}
          fullWidth
        >
          Submit Payment
        </Button>
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
    </div>
  );
};

export default Payment;
