// notificationsRouter.js
const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();
const { Expo } = require('expo-server-sdk');

// Assuming you have a User model defined using Mongoose
const User = require('../models/userModel');

// Route to handle POST request for receiving notification tokens
router.post('/addExpoToken', authMiddleware, async (req, res) => {
  try {
    const { expoPushToken } = req.body;
    const user = req.user;

    // Update user object with ExpoToken
    user.expoToken = expoPushToken;

    // Save the updated user object to the database
    await user.save();

    console.log('ExpoToken added to user:', user);

    // Respond with success message
    res.json({ message: 'ExpoToken added to user and saved to database successfully', user: user });
  } catch (error) {
    console.error('Error adding ExpoToken to user and saving to database:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST endpoint to send notification
router.post('/sendNotification', async (req, res) => {
    try {
      // Extract the uniqueId from the request body
      const { uniqueId } = req.body;
  
      // Find the user based on the uniqueId
      const user = await User.findOne({ 'devices.uniqueId': uniqueId });
  
      // If user not found, return error
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Extract expoToken and deviceName from the user
      const expoToken = user.expoToken;
      const device = user.devices.find(device => device.uniqueId === uniqueId);
      const deviceName = device ? device.deviceName : 'Unknown Device';
  
      // Prepare the notification message
      const notification = [{
        to: expoToken,
        sound: 'default',
        title: 'Notification',
        body: `${deviceName} is now active`
      }];
  
      // Create a new Expo object
      const expo = new Expo();
  
      // Send the notification
      const ticket = await expo.sendPushNotificationsAsync(notification);
  
      // Check if ticket has an error
      if (ticket && ticket.details && ticket.details.error) {
        console.error('Error sending push notification:', ticket.details.error);
        return res.status(500).json({ error: 'Error sending push notification' });
      }
  
      // Notification sent successfully
      console.log('Notification sent successfully');
      return res.json({ message: 'Notification sent successfully' });
    } catch (error) {
      console.error('Error sending push notification:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  module.exports = router;
  
module.exports = router;
