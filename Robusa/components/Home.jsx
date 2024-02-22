// Home.jsx

import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const Home = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Any side effects or initializations can go here
    // This function will be called once when the component mounts
    return () => {
      // Clean up or clear any subscriptions when the component unmounts
    };
  }, []);

  const handleIncrement = () => {
    setCount(count + 1);
  };

  const handleDecrement = () => {
    setCount(count - 1);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to the Expo React Native App</Text>
      <Text style={styles.text}>Count: {count}</Text>
      <View style={styles.buttonContainer}>
        <Button title="Increment" onPress={handleIncrement} />
        <Button title="Decrement" onPress={handleDecrement} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '50%',
  },
});

export default Home;
