import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Typography, makeStyles, CircularProgress, IconButton, Snackbar,
  SnackbarContent } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import CloseIcon from '@material-ui/icons/Close';
import config from '../config';

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(15),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: '100vh',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
  image: {
    width: '100%',
    height: 'auto',
  },
  featureList: {
    padding: 0,
    margin: 0,
    listStyle: 'none',
  },
  featureItem: {
    margin: '5px 0',
  },
}));

const AgencyCarDetail = () => {
  const classes = useStyles();
  const [agencyCarData, setAgencyCarData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [carData, setCarData] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const agencyid = localStorage.getItem('userid');

  useEffect(() => {
    const fetchAgencyCarData = async () => {
      try {
        const response = await fetch(`${config.BASE_URL}cars/getCarByAgencyId`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ agencyid }),
        });

        if (response.status == 404) {
          throw new Error('No Cars Found');
        }
        const data = await response.json();
        setAgencyCarData(data.car);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAgencyCarData();
  }, [agencyid]);

  const handleEdit = (carid) => {
    console.log("Edit button clicked for id:", carid);
    window.location.href = `/editCar/${carid}`;
  };

  const handleDelete = async (id) => {
    console.log("Delete button clicked for id:", id);

    try {
      const response = await fetch(`${config.BASE_URL}cars/deleteCar/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Car Deleted successfully:', data);
        handleSnackbarOpen('Car Details Deleted successfully!', 'success');
        setTimeout(() => {
          window.location.href = '/agencyCarDetail';
        }, 2000);
      } else {
        const errorData = await response.json();
        handleSnackbarOpen(errorData.message || 'Car Deletion failed', 'error');
      }
    } catch (error) {
      setError(error.message);
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

  if (error) {
    return (
      <div className={classes.loading}>
        <Typography variant="h5" color="error">
          {error}
        </Typography>
      </div>
    );
  }

  const headers = [
    { field: 'carid', headerName: 'Car Id', width: 100 },
    { field: 'brand', headerName: 'Brand', width: 100 },
    { field: 'model', headerName: 'Model', width: 150 },
    { field: 'year', headerName: 'Year', width: 100 },
    { field: 'price', headerName: 'Price', width: 100 },
    { field: 'seater', headerName: 'Seater', width: 100 },
    { field: 'miles', headerName: 'Miles', width: 100 },
    {
      field: 'features',
      headerName: 'Features',
      width: 200,
      sortable: false,
      renderCell: (params) => (
        <ul className={classes.featureList}>
          {params.value.map((feature, index) => (
            <li key={index} className={classes.featureItem}>
              {feature}
            </li>
          ))}
        </ul>
      ),
    },
    { field: 'about', headerName: 'About', width: 200 },
    {
      field: 'imageUrl',
      headerName: 'Image',
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <img src={params.value} alt="car" className={classes.image} />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <div>
          <IconButton color="primary" onClick={() => handleEdit(params.row.carid)}>
            <EditIcon />
          </IconButton>
          <IconButton color="secondary" onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </div>
      ),
    },
  ];


  return (
    <div className={classes.container}>
      <Typography variant="h5" gutterBottom>Agency Car Details</Typography>
      <div style={{ width: '100%', marginTop: '20px' }}>
        <DataGrid
          rows={agencyCarData}
          columns={headers}
          autoHeight
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10]}
          checkboxSelection
        />
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
}

export default AgencyCarDetail;
