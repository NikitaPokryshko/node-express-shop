const { body } = require('express-validator');
const bcrypt = require("bcryptjs");
const User = require('../models/user');

// We can set message as a 2nd param of body(field, message) or with withMessage('error message') method;
const registerEmailValidator = body('email', 'Enter correct email')
  .isEmail()
  .custom(async (value, { req }) => {
    try {
      const user = await User.findOne({ email: value })
      if (user) {
        return Promise.reject('User with the same email already exists')
      }
    } catch (err) {
      console.log(err);
    }
  })
  // - sanitizer from validator.js library
  // - be careful! removes '+' character, which is not good for additional google accounts (your_account+test@gmail.com => youraccounttest@gmail.com)
  .normalizeEmail();

const loginEmailValidator = body('email', 'Enter correct email')
  .isEmail()
  .custom(async (value, { req }) => {
    try {
      const user = await User.findOne({ email: value})

      if (!user) {
        return Promise.reject('This user is not exist');
      }
    } catch (err) {
      console.log(err)
    }
  })
  .normalizeEmail();

const passwordValidator = body('password', 'Password must be at least 6 characters long and contain letters and numbers')
  .isLength({ min: 6, max: 56 })
  .isAlphanumeric()
  .trim();

const isPasswordCorrectValidator = body('password')
  .custom(async (value, { req }) => {
    try {
      const user = await User.findOne({ email: req.body.email })

      if (!user) {
        return Promise.reject('This user is not exist');
      }

      const isSame = await bcrypt.compare(value, user.password);

      if (!isSame) {
        return Promise.reject('Wrong password')
      }
    } catch (err) {
      console.log(err)
    }
  });

const confirmPasswordValidator = body('confirm')
  .custom((value, { req}) => {
    if (value !== req.body.password) {
      throw new Error('Passwords must match')
    }

    return true;
  })
  .trim();

const nameValidator = body('name', 'Name must be at least 3 characters')
  .isLength(({ min: 3 }))
  .trim();


const courseNameValidator = body('title')
  .isLength({ min: 3 })
  .withMessage('The minimum course name length is 3 characters')
  .trim()

const coursePriceValidator = body('price')
  .isNumeric()
  .withMessage('Enter correct numeric price')

const courseImgUrlValidator = body('img', 'Enter correct image url')
  .isURL();


exports.registerValidators = [
  registerEmailValidator,
  passwordValidator,
  confirmPasswordValidator,
  nameValidator
]

exports.loginValidators = [
  loginEmailValidator,
  passwordValidator,
  isPasswordCorrectValidator,
]

exports.courseValidators = [
  courseNameValidator,
  coursePriceValidator,
  courseImgUrlValidator
]
