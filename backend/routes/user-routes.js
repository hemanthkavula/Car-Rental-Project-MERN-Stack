const express = require('express');
const { check } = require('express-validator');

const usersController = require('../controllers/user-controller');

const router = express.Router();

router.get('/getUsers', usersController.getUsers);
router.get('/getAgency', usersController.getAgency);

router.post(
  '/signup',
  [
    check('name')
      .not()
      .isEmpty(),
    check('email')
      .normalizeEmail()
      .isEmail(),
    check('phone')
      .isEmpty()
      .isNumeric()
      .isLength({ min: 10, max: 10 }),
    check('address')
      .isEmpty(),
    check('password').isLength({ min: 6 })
  ],
  usersController.signup
);

router.post('/login', usersController.login);

router.post('/role',usersController.role);

router.post('/getUserDetails',usersController.getUserDetails);

module.exports = router;
