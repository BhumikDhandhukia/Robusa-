// devicesRoute.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/userModel');
const { validationResult } = require('express-validator');

router.use(express.json());
// Get devices for a specific user
router.get('/getdevices', async (req, res) => {
  try {
    const user = req.user
     console.log(user)
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    console.log(user.devices)

    res.json(user.devices.splice(1));
  } catch (error) {
    console.error('Error fetching devices:', error);
    res.status(500).send('Internal Server Error');
  }
});




// Route to add a new device
router.post('/addnew', async (req, res) => {
  try {
    const { deviceName, scannedData } = req.body;
    console.log(deviceName)

    // Parse scanned data
    console.log(scannedData.data)
    const { uniqueId, devicetype } = JSON.parse(JSON.parse(JSON.stringify(scannedData.data)));

    // Check if uniqueId is already associated with another device across all users
    const users = await User.find();
    const existingDevice = users.some(user => user.devices.some(device => device.uniqueId === uniqueId));
    if (existingDevice) {
      console.log(existingDevice)
      return res.status(400).json({ message: 'Device with provided uniqueId already exists' });
    }

    // Create new device
    const newDevice = {
      deviceName: deviceName,
      uniqueId,
      deviceType:devicetype,
      status: 'Inactive',
      communicationApi: 'Unknown'
    };

    // Add the new device to the user's devices array
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.devices.push(newDevice);

    // Save the user object with the new device
    await user.save();
    console.log(newDevice)

    res.status(201).json({ message: 'Device added successfully', device: newDevice });
  } catch (error) {
    console.error('Error adding new device:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Route to delete a device
// Route to delete a device
router.post('/delete', async (req, res) => {
  try {
    const user = req.user;
    console.log(user)

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { uniqueId } = req.body;
    

    // Find the device with the given uniqueId
    const deviceIndex = user.devices.findIndex(device => device.uniqueId === uniqueId);

    if (deviceIndex === -1) {
      return res.status(404).json({ message: 'Device not found' });
    }
    // deviceCommunicationApi = user.devices[deviceIndex].communicationApi
        

    // Remove the device from the user's devices array
    user.devices.splice(deviceIndex, 1);

    // Save the user object without the deleted device
    await user.save()
    
      
   
    res.json({ message: 'Device deleted successfully' });
  } catch (error) {
    
    console.error('Error deleting device:', error);
    res.status(500).send('Internal Server Error');
  }
});


router.post('/getCommunicationApi',async(req,res)=>{

  console.log('GET API' )
  const user = req.user
  const {uniqueId} = req.body;
  const device = user.devices.find(device => device.uniqueId === uniqueId);
  const communicationApi = device.communicationApi.replace(/\n/g, '');
  if(communicationApi ==='Unknown')
  {
    return res.status(404).send('Not able to connect. Try restarting your Smart Device')
  }
  console.log(device)
  res.json({message:'COMMUNICATION API', communicationApi: communicationApi})
  
});





module.exports = router;
// Route to generate and save PIN for a device
router.post('/generatePin', authMiddleware, async (req, res) => {
  try {
    const { uniqueId } = req.body;

    // Find the device with the given uniqueId
    const device = req.user.devices.find(device => device.uniqueId === uniqueId);
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }

    // Generate a PIN
    const pin = Math.floor(1000 + Math.random() * 9000); // Generate a 4-digit PIN

    // Save the PIN and pinCreatedAt in the device object
    device.pin = pin;
    device.pinCreatedAt = new Date();
    await req.user.save();

    // Send the PIN back to the user as a response
    res.status(201).json({ message: 'PIN generated and saved successfully', pin });
  } catch (error) {
    console.error('Error generating PIN:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
