const booking = require('../models/booking');
const Booking = require('../models/booking');

const bookingDetails = async (req, res, next) => {
    const { carid, userid, agencyid, startdate, enddate, days, price, status } = req.body;

    const createBooking = new Booking({
      carid,
      userid,
      agencyid,
      startdate,
      enddate,
      days,
      price,
      status
    });
  
    try {
      const savedBooking = await createBooking.save();
      res.status(201).json({ status: "Success", message: "Booking Details added successfully", bookingid: savedBooking._id });
    } catch (err) {
      console.error('Error saving Details:', err);
      res.status(500).json({ message: 'Booking details creation failed, please try again' });
    }
  };

  const payment = async (req, res, next) => {
    const bookingid = req.params.bookingid;
    const {status } = req.body;

    try {
      const booking = await Booking.findById(bookingid);

      if (!booking) {
          const error = new Error('Could not find a booking for the provided ID');
          error.code = 404;
          throw error;
      }
      booking.status = status;

      await booking.save();

      res.json({ booking: booking.toObject({ getters: true }) });
  } catch (err) {
      return res.status(err.code || 500).json({ message: err.message || 'Something went wrong, could not update the payment.' });
  }
  };

  const dashboard = async (req, res, next) => {
    const { userid } = req.body;
    let booking;
    try {
      booking = await Booking.find({userid: userid});
    
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Fetching Booking details failed, please try again later.' });
    }
  
    if (!booking || booking.length === 0) {
      return res.status(200).json({ message: 'Booking Details not found.' });
    }
  
    res.json({ booking: booking.map(booking => booking.toObject({ getters: true })) });
  };

  const getBookingDetails = async (req, res, next) => {
    let booking;
    try {
      booking = await Booking.find();
    
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Fetching Booking details failed, please try again later.' });
    }
  
    if (!booking || booking.length === 0) {
      return res.status(404).json({ message: 'Booking Details not found.' });
    }
  
    res.json({ booking: booking.map(booking => booking.toObject({ getters: true })) });
  };

  const getBookingDetailsByAgency = async (req, res, next) => {
    const { agencyid } = req.body;
    let booking;
    try {
      booking = await Booking.find({agencyid: agencyid});
    
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Fetching Booking details failed, please try again later.' });
    }
  
    if (!booking || booking.length === 0) {
      return res.status(404).json({ message: 'Booking Details not found.' });
    }
  
    res.json({ booking: booking.map(booking => booking.toObject({ getters: true })) });
  };
  module.exports = {
    bookingDetails,
    payment,
    dashboard,
    getBookingDetails,
    getBookingDetailsByAgency
  };