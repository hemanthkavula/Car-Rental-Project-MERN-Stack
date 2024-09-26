const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const usersRoutes = require('./routes/user-routes');
const carRoutes = require('./routes/car-routes');
const bookingRoutes = require('./routes/booking-routes');
const path = require('path');

const app = express();

app.use(cors());

app.use(bodyParser.json());

// Define your routes
app.use('/api/users', usersRoutes);

app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); 

app.use('/api/cars', carRoutes);

app.use('/api/booking', bookingRoutes);

// Error handling middleware (should be the last app.use())
app.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({ message: error.message || 'An unknown error occurred' });
});

const url = 'mongodb+srv://hemanthkavula2001:Pb7MdKNieMiddmmh@cluster0.g8aocnu.mongodb.net/Project?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(url, {
}).then(() => {
    console.log('MongoDB connected');
    app.listen(3001, () => {
        console.log('Server running on port 3001');
    });
}).catch(err => {
    console.error('MongoDB connection error:', err);
});
