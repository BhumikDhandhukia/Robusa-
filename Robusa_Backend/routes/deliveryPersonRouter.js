const express = require('express');
const router = express.Router();
const { Expo } = require('expo-server-sdk');
const User = require('../models/userModel'); // Import your User model here
const bodyParser = require('body-parser');
const cors = require('cors'); // Import cors

router.use(bodyParser.json());
router.use(cors());



async function sendNotification(expoToken, title, body) {
  try {
    const expo = new Expo();
    
    // Construct the message
    let pushMessage = [{
      to: expoToken,
      sound: 'default',
      title,
      body,
      
    }];

    // Send the notification
    const ticket = await expo.sendPushNotificationsAsync(pushMessage);
    console.log('Push notification ticket:', ticket);

    // Handle errors or failures if needed
    if (Expo.isExpoPushToken(expoToken) && ticket.details && ticket.details.error) {
      throw new Error(`Failed to send push notification: ${ticket.details.error}`);
    }

    return ticket;
  } catch (error) {
    console.error('Error sending push notification:', error);
    throw error;
  }
}



const axios = require('axios');

router.post('/pin', async (req, res) => {
  const { uniqueId , pincode } = req.body;
  console.log(pincode)

  try {
    // Find the user that has the device with the given uniqueId
    const user = await User.findOne({ 'devices.uniqueId': uniqueId });

    // If user not found, send error response
    if (!user) {
      return res.status(400).send('Device not found');
    }
    const expoToken = user.expoToken

    const device = user.devices.find(device => device.uniqueId === uniqueId);

    // Check if the pin has expired

   if(device.pin === pincode){
    if (device.pinCreatedAt) {
      const pinExpiration = new Date(device.pinCreatedAt.getTime() + (3 * 60 * 1000)); // 3 minutes expiry
      const currentTime = new Date();
      if (currentTime > pinExpiration) {
        // If pin has expired, remove the pin and pinCreatedAt from the device
        device.pin = undefined;
        device.pinCreatedAt = undefined;
        await user.save();
        return res.status(400).send('Pin is not valid');
      }
    }

   }else{
    return res.status(400).send('Pin is not valid ');
   }

    // Remove newline character from the end of communicationApi string
    const communicationApi = device.communicationApi.replace(/\n$/, '');

    // Send POST request to communicationApi with endpoint /2 to open the lock
    const openUrl = `${communicationApi}/2`;
    console.log(openUrl);
    const openResponse = await axios.get(openUrl);

    // If the lock is successfully opened (status code 200)
    if (openResponse.status === 200) {
      // Send a message in the response to indicate that the lock is open and should be pulled within 10 seconds
      sendNotification(expoToken,"Security Alert","SomeOne from outside opened your "+ device.deviceName+",Hoping you are aware")
      res.send('Pull the lock within 10 seconds');

      // Wait for 10 seconds
      await new Promise(resolve => setTimeout(resolve, 10000));

      // Send a GET request to communicationApi again after 10 seconds
      const getUrl = `${communicationApi}/1`;
      console.log(getUrl);
      const getResponse = await axios.get(getUrl);
      console.log(getResponse.data); // Log the response from the communication API
    } else {
      // If the lock cannot be opened for some reason, send an error response
      return res.status(500).send('Failed to open the lock');
    }
  } catch (error) {
    console.error('Error opening the lock:', error);
    return res.status(500).send('Internal Server Error');
  }
});



// Route to serve the webpage to the delivery person
router.get('/', async (req, res) => {
  try {
    // Extract uniqueId from request query
    const { uniqueId } = req.query;

    // Check if uniqueId is provided
    if (!uniqueId) {
      return res.status(400).send('Unique ID is required');
    }

    // Search for the user with the provided uniqueId
    const user = await User.findOne({ 'devices.uniqueId': uniqueId });

    // Check if user is found
    if (!user) {
      return res.status(404).send('User not found');
    }

    // Send the HTML page with the message and uniqueId as query parameter
    res.sendFile(__dirname + `/deliveryPerson.html`);

    // Send a notification to the owner
    await sendOwnerNotification(user);
    
  } catch (error) {
    console.error('Error serving webpage:', error);
    res.status(500).send('Internal Server Error');
  }
});


// Function to send notification to the owner
const sendOwnerNotification = async (user) => {
  try {
    // Get the Expo token from the user
    const expoToken = user.expoToken;

    // Check if Expo token exists
    if (!expoToken) {
      console.error('Expo token not found for user');
      return;
    }

    // Prepare the notification message
    const notification = [{
      to: expoToken,
      sound: 'default',
      title: 'Delivery Notification',
      body: 'The delivery person has arrived.'
    }];

    // Create a new Expo object
    const expo = new Expo();

    // Send the notification
    const ticket = await expo.sendPushNotificationsAsync(notification);

    // Check for errors
    if (ticket && ticket.details && ticket.details.error) {
      console.error('Error sending push notification to owner:', ticket.details.error);
    } else {
      console.log('Notification sent to owner successfully');
    }
  } catch (error) {
    console.error('Error sending push notification to owner:', error);
  }
};

module.exports = router;
