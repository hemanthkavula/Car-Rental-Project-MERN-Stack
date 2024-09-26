const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking-controller');

router.post('/bookingDetails', bookingController.bookingDetails);

router.put('/payment/:bookingid', bookingController.payment);

router.post('/dashboard',bookingController.dashboard);

router.get('/getBookingDetails',bookingController.getBookingDetails);

router.post('/getBookingDetailsByAgency',bookingController.getBookingDetailsByAgency);

module.exports = router;