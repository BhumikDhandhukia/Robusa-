// Import necessary modules
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import config from '../config';

// Define the LoginScreen component
const LoginScreen = () => {
  // State variables for email, password, and loading status
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Get navigation object
  const navigation = useNavigation();

  // Function to handle login
  const handleLogin = async () => {
    setIsLoading(true); // Set loading to true while processing login
  
    try {
      // Make a POST request to the login endpoint
      const response = await fetch(config.API_URL+'/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      // Get the response as JSON
      const jsonData = await response.json();

      // Check if login was successful
      if (response.ok) {
        // Save token in AsyncStorage
        await AsyncStorage.setItem('token', jsonData.token);
  
        // Navigate to DevicesScreen
        navigation.navigate('Devices');
      } else {
        // Alert the user about login failure
        Alert.alert('Login Failed', jsonData.message);
      }
    } catch (error) {
      // Alert the user about the error
      Alert.alert('Login Error', 'An error occurred while logging in. Please try again later.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false); // Set loading back to false after login attempt
    }
  };

  // Function to handle navigation to sign up screen
  const handleSignUp = () => {
    navigation.navigate('Signup');
  };

  // Function to check if user is already logged in
  const checkLoginStatus = async () => {
    setIsLoading(true); // Set loading to true while checking login status
    
    try {
      // Make a POST request to check if user is logged in
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(config.API_URL+'/auth/checkLogin', {
        method: 'POST',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      // Check if response is ok
      if (response.ok) {
        // Navigate to DevicesScreen if user is logged in
        navigation.navigate('Devices');
      }
    } catch (error) {
      // Log any errors
      console.error('Error checking login status:', error);
    } finally {
      setIsLoading(false); // Set loading back to false after checking login status
    }
  };

  // Call checkLoginStatus function when component is rendered
  useEffect(() => {
    checkLoginStatus();
  }, []);

  // Render the component
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back!</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
        style={styles.input}
      />
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        {isLoading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity onPress={handleSignUp}>
        <Text style={styles.signupText}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    elevation: 3, // for 3D effect
  },
  loginButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    elevation: 3, // for 3D effect
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  signupText: {
    marginTop: 10,
    color: '#007bff',
    textDecorationLine: 'underline',
  },
});

// Export the component
export default LoginScreen;
