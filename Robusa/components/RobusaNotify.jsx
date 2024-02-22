import React, { useEffect , useState,useRef} from 'react';
import { Platform, ScrollView, Text  } from 'react-native';
import * as Notifications from 'expo-notifications';
import axios from 'axios';



const RobusaNotify = () => {

  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  useEffect(() => {
    // Request permission on component mount
    registerForPushNotificationsAsync();
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  

  }, []);

  async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'android') {
      // Set up notification channel for Android
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
   
    // Check notification permissions
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      // Request permission if not granted
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      
      console.log('Failed to get push token for push notification!');
      return;
    }
    
    // Obtain Expo Push Token
    const expoPushToken = await Notifications.getExpoPushTokenAsync({ projectId:'de4ba754-21e8-4f0f-a526-457c34b62824' });
    token = expoPushToken.data;
    await setExpoPushToken(token)
    console.log('Expo Push Token',token);



    


    // Handle the token (e.g., send it to your backend)

    // No need to return the token here
  }

  return (
    <ScrollView>
      <Text>Add Devices</Text>
      {/* Add UI components for device registration or push notification display */}
    </ScrollView>
  );
};

export default RobusaNotify;
