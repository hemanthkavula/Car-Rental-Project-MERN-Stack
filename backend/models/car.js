const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const carSchema = new Schema({
  brand: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  price: { type: Number, required: true },
  seater: { type: Number, required: true },
  miles: { type: Number, required: true },
  features: { type: [String], required: true },
  about: { type: String, required: true },
  agencyid: { type: Number, required: true },
  imageUrl: { type: String, required: true }
});

carSchema.plugin(AutoIncrement, { inc_field: 'carid' });

module.exports = mongoose.model('Car', carSchema);
