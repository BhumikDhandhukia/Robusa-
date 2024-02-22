import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Dimensions, Alert } from 'react-native';

import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import config from '../config';

const DevicesScreen = ({ route }) => {
  const [devices, setDevices] = useState([]);
  const navigation = useNavigation();
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  const fetchDevices = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(
        config.API_URL + `/auth/devices/getdevices`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setDevices(response.data);
    } catch (error) {
      navigation.navigate('Login');
      console.error('Error fetching devices:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchDevices();
    }, [])
  );

  const navigateToCamera = () => {
    navigation.navigate('Camera');
  };

  const handleDeleteDevice = async (uniqueId) => {
    try {
      
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post(
        config.API_URL + '/auth/devices/delete',
        { uniqueId: uniqueId },
        {
          headers: {
            Authorization: token,
            'Content-Type': 'application/json'
          },
        }
      );
      fetchDevices();
    } catch (error) {
      console.error('Error deleting device:', error);
      Alert.alert('Error', 'Failed to delete device. Please try again later.');
    }
  };

  const handleDevicePress = (item) => {
    if (item.deviceType === 'Lock') {
      
      
      navigation.navigate('LockSys', {uniqueId:item.uniqueId});
    } else {
      alert("Device Not Functional")
    }
  };

  const confirmDeleteDevice = (deviceId) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this device?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: () => handleDeleteDevice(deviceId) },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={navigateToCamera}>
        <Text style={styles.cameraLink}>Add Devices</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Your Devices</Text>

      <FlatList
        data={devices}
        keyExtractor={(item) => item.uniqueId}
        renderItem={({ item }) => (
          <TouchableOpacity style={[styles.deviceCard, { width: screenWidth - 32, height: screenHeight * 0.3 }]} onPress={() => handleDevicePress(item)}>
            <View style={styles.deviceCardContent}>
              <Text style={styles.deviceName}>{item.deviceName}</Text>
              <Text style={styles.deviceType}>{item.deviceType}</Text>
              <Text style={styles.deviceType}>{item.status}</Text>
              
            </View>
            <TouchableOpacity style={styles.deleteButton} onPress={() => confirmDeleteDevice(item.uniqueId)}>
              <Text style={styles.deleteButtonText}>X</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text>No devices found</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  deviceCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dddddd',
    marginBottom: 10,
    elevation: 3,
    position: 'relative',
  },
  deviceCardContent: {
    padding: 16,
  },
  deviceName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  deviceType: {
    fontSize: 16,
  },
  deleteButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'red',
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cameraLink: {
    fontSize: 16,
    color: 'blue',
    marginBottom: 10,
  },
});

export default DevicesScreen;
