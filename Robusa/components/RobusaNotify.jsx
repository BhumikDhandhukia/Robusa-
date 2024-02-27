import * as Notifications from 'expo-notifications';
import axios from 'axios';
import config from '../config';

export async function NotificationSetup(token) {
  // Check notification permissions
  console.log("NOTIFICATION SETUP ", token)
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    // Request permission if not granted
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    console.log('Failed to get push token for push notification!');
    alert('Permission denied. You won\'t be receiving notifications.');
    return;
  }

  // Obtain Expo Push Token
  const expoPushToken = (await Notifications.getExpoPushTokenAsync()).data;
  console.log('Expo Push Token', expoPushToken);

  // Send token and ExpoPushToken to backend
  try {
    const response = await axios.post(config.API_URL+'/notifications/addExpoToken', {
      token: token,
      expoPushToken: expoPushToken
    }, {
      headers: {
        Authorization: token
      }
    });
    console.log('Token sent successfully:', response.data);
  } catch (error) {
    console.error('Error sending token to backend:', error);
    // Handle error appropriately
  }
}
