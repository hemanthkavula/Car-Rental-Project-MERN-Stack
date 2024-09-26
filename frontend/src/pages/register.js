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
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import config from '../config';

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(10),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(2),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  signupText: {
    textAlign: 'center',
  },
  snackbar: {
    marginBottom: theme.spacing(2),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    width: '100%',
  },
}));

const SignupPage = () => {
  const classes = useStyles();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [roleid, setRoleId] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleSignup = async (e) => {
    e.preventDefault();

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      handleSnackbarOpen('Invalid email format', 'error');
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      handleSnackbarOpen('Passwords do not match', 'error');
      return;
    }

    if (password.length < 6) {
      handleSnackbarOpen('Password should contain at least 6 characters', 'error');
      return;
    }

    // Reset errors
    resetForm();

    // Handle signup logic here
    console.log('Signing up with:', name, phone, email, address, password, roleid);

    try {
      const response = await fetch(`${config.BASE_URL}users/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          phone,
          email,
          address,
          password,
          roleid,
        }),
      });

      if (response.ok) {
        handleSnackbarOpen('Signed up successfully!', 'success');
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else {
        const errorData = await response.json();
        handleSnackbarOpen(errorData.message || 'Signup failed', 'error');
      }
    } catch (error) {
      handleSnackbarOpen('Network error. Please try again later.', 'error');
    }
  };

  const resetForm = () => {
    setName('');
    setPhone('');
    setEmail('');
    setAddress('');
    setPassword('');
    setConfirmPassword('');
    setRoleId('');
  };

  const handleSnackbarOpen = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container component="main" maxWidth="xs" className={classes.container}>
      <div>
        <Typography component="h1" variant="h5" className={classes.signupText}>
          Sign Up
        </Typography>
        <form className={classes.form} onSubmit={handleSignup}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="name"
            label="Name"
            name="name"
            autoComplete="name"
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="phone"
            label="Phone Number"
            name="phone"
            autoComplete="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="address"
            label="Address"
            name="address"
            autoComplete="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              required
              id="role"
              value={roleid}
              onChange={(e) => setRoleId(e.target.value)}
              label="Role"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="1">User</MenuItem>
              <MenuItem value="2">Agency</MenuItem>
            </Select>
          </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign Up
          </Button>
        </form>
        <Link href="/login" variant="body2">
          Already have an account? Log In
        </Link>
      </div>

      {/* Snackbar for displaying messages */}
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
            <IconButton
              key="close"
              aria-label="close"
              color="inherit"
              onClick={handleSnackbarClose}
            >
              <CloseIcon />
            </IconButton>,
          ]}
        />
      </Snackbar>
    </Container>
  );
};

export default SignupPage;
