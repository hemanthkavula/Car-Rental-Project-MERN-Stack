const express = require('express');
const router = express.Router();
const carController = require('../controllers/car-controller');

const upload = carController.upload;

const addCar = carController.addCar;

router.get('/', carController.getCars);

router.post('/addcar', upload.single('image'), addCar);

router.post('/getCarById', carController.getCarById);

router.post('/getCarByAgencyId',carController.getCarByAgencyId);

router.put('/updateCar/:carid', carController.updateCar);

router.delete('/deleteCar/:carid', carController.deleteCar);


module.exports = router;