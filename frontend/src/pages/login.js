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
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  forgotPassword: {
    marginTop: theme.spacing(2),
  },
  loginText: {
    textAlign: 'center',
  },
  snackbar: {
    marginBottom: theme.spacing(2),
  },
}));

const LoginPage = () => {
  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('error');

  const handleLogin = async (e) => {
    e.preventDefault();

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      handleSnackbarOpen('Invalid email format', 'error');
      return;
    }
    if (password.length<6) {
        handleSnackbarOpen('Passwords should contain atleast 6 digits', 'error');
        return;
      }

      resetForm();

    // Handle login logic here
    console.log('Logging in with:', email, password);

    try {
      const response = await fetch(`${config.BASE_URL}users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        localStorage.setItem('userid', data.userid);
        localStorage.setItem('roleid', data.roleid);
        handleSnackbarOpen('Logged in Successfully!', 'success');
        setTimeout(() => {
          if(data.roleid === "1"){
            window.location.href = '/userHome';
          }
          else if(data.roleid === "2"){
            window.location.href = '/agencyHome';
          }
          else if(data.roleid === "3"){
            window.location.href = '/adminHome';
          }
          }, 2000); 
      } else {
        const errorData = await response.json();
        handleSnackbarOpen(errorData.message || 'Signup failed', 'error');
      }
    } catch (error) {
      handleSnackbarOpen('Network error. Please try again later.', 'error');
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

  const resetForm = () => {
    setEmail('');
    setPassword('');
  };

  return (
    <Container component="main" maxWidth="xs" className={classes.container}>
      <div>
        <Typography component="h1" variant="h5" className={classes.loginText}>
          Log in
        </Typography>
        <form className={classes.form} onSubmit={handleLogin}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Log In
          </Button>
        </form>
        <Typography variant="body2">
          Don't have an account? <Link href="/register">Register here</Link>
        </Typography>
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

export default LoginPage;
