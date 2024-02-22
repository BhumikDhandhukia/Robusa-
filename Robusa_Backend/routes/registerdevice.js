// registerdevice.js

const express = require('express');
const router = express.Router();
const User = require('../models/userModel'); // Import the user model

// POST route to register a new device
router.post('/', async (req, res) => {
  try {
    console.log(req.body)
    const { uniqueId } = req.body; // Extract uniqueId from request body

    // Check if the device with the given uniqueId exists in any user's devices
    const deviceExists = await User.exists({ 'devices.uniqueId': uniqueId });

    if (deviceExists) {
      return res.status(400).json({ message: 'Device already exists' });
    } else {
      return res.status(200).json({ message: 'Device does not exist' });
    }
  } catch (error) {
    console.error('Error registering device:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});


router.post('/communicationapi', async (req, res) => {
    try {
      const { uniqueId, communicationApi } = req.body; // Extract uniqueId and communicationApi from request body
  
      // Check if the device with the given uniqueId exists in any user's devices
      const user = await User.findOne({ 'devices.uniqueId': uniqueId });
  
         user.devices.forEach(device => {
          if (device.uniqueId === uniqueId) {
            device.communicationApi = communicationApi;
          }
        });
        await user.save();
  
        return res.status(200).json({ message: 'Communication API updated'});
      
    } catch (error) {
      console.error('Error registering device:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });
  

module.exports = router;