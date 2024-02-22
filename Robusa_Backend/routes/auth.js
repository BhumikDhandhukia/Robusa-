// auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');
const devicesRoute = require('./devicesRoute'); // Import the devicesRoute
const authMiddleware = require('../middleware/authMiddleware');

// Authentication route
router.get('/', (req, res) => {
  res.send('AUTHENTICATION ROUTE');
});

// Login route
router.post('/login', async (req, res) => {
  try {
   
    const { email, password } = req.body;

    // Find user by email
    const user = await UserModel.findOne({ email });
    console.log(await bcrypt.compare(password, user.password))

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ userId: user._id }, 'your_secret_key', { expiresIn: '1hr' });
      
      // Save the token in the user's document
      user.token = token;
      await user.save();

      // Return user details and token
      res.json({ userId: user._id, name: user.name, token });
    } else {
      res.status(401).send('Invalid credentials');
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send('Internal Server Error');
  }
});


// Signup route
router.post('/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({
      email,
      password: hashedPassword,
      name,
    });

    const savedUser = await newUser.save();

    res.send('Signup successful. User created');
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/checkLogin',authMiddleware, async (req, res) => {
  try {
    res.status(200).send('OK');
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Use the devices route
router.use('/devices',authMiddleware, devicesRoute);

module.exports = router;
