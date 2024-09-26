const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const bookingSchema = new Schema({
  carid: { type: Number, ref: 'Car', required: true },
  userid: { type: Number, ref: 'User', required: true },
  agencyid: { type: Number, ref: 'User', required: true },
  startdate: {type: Date, required: true},
  enddate: {type: Date, required: true},
  days: { type: Number, required: true },
  price: { type: Number, required: true },
  status: { type: String, enum: ['Confirmed', 'Pending'], default: 'Pending', required: true },
});

bookingSchema.plugin(AutoIncrement, { inc_field: 'bookingid' });

module.exports = mongoose.model('Booking', bookingSchema);
