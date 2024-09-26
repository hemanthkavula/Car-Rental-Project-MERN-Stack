import React, {useEffect, useState} from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Typography, makeStyles, CircularProgress } from '@material-ui/core';

import config from '../config';

const headers = [
  { field: 'userId', headerName: 'ID', width: 70 },
  { field: 'name', headerName: 'Name', width: 150 },
  { field: 'email', headerName: 'Email',width: 200 },
  { field: 'phone', headerName: 'Phone', width: 150 },
  { field: 'address', headerName: 'Address', width: 150 },
];

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
  }));

const UserList = () => {
    const classes = useStyles();
    const [userData, setUserData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
          try {
            const response = await fetch(`${config.BASE_URL}users/getUsers`);
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setUserData(data.users); 
          } catch (error) {
            setError(error.message);
          } finally {
            setLoading(false);
          }
        };
    
        fetchUserData();
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
      <Typography variant="h5" gutterBottom style={{ textAlign: 'center', marginTop: '120px' }}>Users List</Typography>
      <div style={{ height: 400, width: '60%', marginTop: '20px' }}>
        <DataGrid
          rows={userData}
          columns={headers}
          initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
          checkboxSelection
        />
      </div>
    </div>
  );
}

export default UserList;
