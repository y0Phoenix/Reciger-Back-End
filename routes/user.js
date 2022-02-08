const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const gravatar = require('gravatar');
const bc = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const User = require('../models/User');

// @post new user
router.post('/', [
    check('name', 'Name is Required').not().isEmpty(),
    check('email', 'A Valid Email is Required').isEmail(),
    check('password', 'Please Enter A Password With 6 Or More Characters').isLength({min: 6})
], async (req, res) => {

})