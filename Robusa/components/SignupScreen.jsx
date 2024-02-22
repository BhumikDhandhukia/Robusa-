// SignupScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

const SignupScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMatchError, setPasswordMatchError] = useState('');

  const handleSignup = async () => {
    try {
      // Check if password and confirm password match
      if (password !== confirmPassword) {
        setPasswordMatchError('Password and Confirm Password do not match');
        return;
      }

      // Clear any previous password match error
      setPasswordMatchError('');

      // Make a POST request to the signup endpoint
      const response = await axios.post('http://192.168.1.204:3000/auth/signup', {
        email,
        name,
        password,
      });

      // Handle successful signup (e.g., navigate to login screen)
      console.log('Signup successful:', response.data);
      navigation.navigate('Login');
    } catch (error) {
      // Handle signup error
      console.error('Signup error:', error);

      // Show a user-friendly error popup
      let errorMessage = 'An error occurred during signup. Please try again.';
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }

      Alert.alert('Error', errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Signup</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
        style={styles.input}
      />
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={(text) => setName(text)}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
        style={styles.input}
      />
      <TextInput
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={(text) => setConfirmPassword(text)}
        secureTextEntry
        style={styles.input}
      />

      {/* Display password match error message */}
      {passwordMatchError ? (
        <Text style={styles.errorMessage}>{passwordMatchError}</Text>
      ) : null}

      <Button title="Signup" onPress={handleSignup} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: 300,
    height: 40,
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  errorMessage: {
    color: 'red',
    marginBottom: 10,
  },
});

export default SignupScreen;
