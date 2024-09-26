const Car = require('../models/car');
const multer = require('multer');
const path = require('path');


// Multer configuration for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Specify the upload directory
  },
  filename: function (req, file, cb) {
    // Use Date.now() to ensure a unique file name
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

const getCars = async (req, res, next) => {
  let cars;
  try {
    cars = await Car.find();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Fetching cars failed, please try again later.' });
  }

  if (!cars || cars.length === 0) {
    return res.status(200).json({ message: 'No cars found.' });
  }

  res.json({ cars: cars.map(car => car.toObject({ getters: true })) });
};

const addCar = async (req, res, next) => {
    const { brand, model, year, price, seater, miles, features, about, agencyid } = req.body;
  
    const image = req.file;
  
    const imageUrl = image ? `http://localhost:3001/uploads/${image.filename}` : null;
  
    const createdCar = new Car({
      brand,
      model,
      year: Number(year),
      price: Number(price),
      seater: Number(seater),
      miles: Number(miles),
      features,
      about,
      agencyid,
      imageUrl
    });
  
    try {
      await createdCar.save();
      res.status(201).json({ status: "Success", message: "Car added successfully" });
    } catch (err) {
      console.error('Error saving car:', err);
      res.status(500).json({ message: 'Creating car failed, please try again' });
    }
  };

  const getCarById = async (req, res, next) => {
    const { carid } = req.body;
    let car;
    try {
      car = await Car.find({carid: carid});
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Fetching Car details failed, please try again later.' });
    }
  
    if (!car || car.length === 0) {
      return res.status(404).json({ message: 'Car Details not found.' });
    }
  
    res.json({ car: car.map(car => car.toObject({ getters: true })) });
  };
  
  const getCarByAgencyId = async (req, res, next) => {
    const { agencyid } = req.body;
    let car;
    try {
      car = await Car.find({agencyid: agencyid});
    
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Fetching Car details failed, please try again later.' });
    }
  
    if (!car || car.length === 0) {
      return res.status(404).json({ message: 'Car Details not found.' });
    }
  
    res.json({ car: car.map(car => car.toObject({ getters: true })) });
  };

  const updateCar = async (req, res, next) => {
    const carid = req.params.carid;
    const { brand, model, year, price, seater, miles, about } = req.body;

    try {
        const car = await Car.findById(carid);

        if (!car) {
            const error = new Error('Could not find a car for the provided ID');
            error.code = 404;
            throw error;
        }
        car.brand = brand;
        car.model = model;
        car.year = year;
        car.price = price;
        car.seater = seater;
        car.miles = miles;
        car.about = about;

        await car.save();

        res.json({ car: car.toObject({ getters: true }) });
    } catch (err) {
        return res.status(err.code || 500).json({ message: err.message || 'Something went wrong, could not update the car.' });
    }
};

const deleteCar = async (req, res, next) => {
  const carid = req.params.carid;

  try {
      const car = await Car.findById(carid);

      if (!car) {
          const error = new Error('Could not find a Car for the provided ID');
          error.code = 404;
          throw error;
      }

      await car.deleteOne();

      res.json({ message: 'Car deleted successfully' });
  } catch (err) {

      return res.status(err.code || 500).json({ message: err.message || 'Something went wrong, could not delete the Car.' });
  }
};

  
  

module.exports = {
  getCars,
  addCar,
  upload,
  getCarById,
  getCarByAgencyId,
  updateCar,
  deleteCar
};
