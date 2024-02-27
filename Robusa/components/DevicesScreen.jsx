import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import config from '../config';
import { NotificationSetup } from './RobusaNotify';

const DevicesScreen = ({ route }) => {
  const [devices, setDevices] = useState([]);
  const navigation = useNavigation();
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  const fetchDevices = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      NotificationSetup(token);
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
            'Content-Type': 'application/json',
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
      navigation.navigate('LockSys', { uniqueId: item.uniqueId });
    } else {
      alert('Device Not Functional');
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
          <TouchableOpacity
            style={[styles.deviceCard, { width: screenWidth - 32 }]}
            onPress={() => handleDevicePress(item)}
          >
            <View style={styles.deviceCardContent}>
              <View style={styles.deviceHeader}>
                <Text style={styles.deviceName}>{item.deviceName}</Text>
                <TouchableOpacity onPress={() => confirmDeleteDevice(item.uniqueId)}>
                  <Ionicons name="trash-bin" size={24} color="red" />
                </TouchableOpacity>
              </View>
              <View style={styles.deviceInfo}>
                <Ionicons name={item.deviceType === 'Lock' ? 'lock-closed' : 'md-phone-portrait'} size={24} color="#666" />
                <Text style={styles.deviceType}>{item.deviceType}</Text>
              </View>
              <View style={styles.deviceInfo}>
                <Ionicons name={item.status === 'Active' ? 'md-checkmark-circle' : 'md-close-circle'} size={24} color={item.status === 'Active' ? 'green' : 'red'} />
                <Text style={[styles.deviceStatus, { color: item.status === 'Active' ? 'green' : 'red' }]}>{item.status}</Text>
              </View>
            </View>
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
    backgroundColor: '#f0f0f0',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  deviceCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 20,
    elevation: 3,
  },
  deviceCardContent: {
    padding: 16,
  },
  deviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  deviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  deviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  deviceType: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
  },
  deviceStatus: {
    fontSize: 16,
    marginLeft: 8,
  },
  deleteButton: {
    backgroundColor: 'red',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginLeft: 10,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  cameraLink: {
    fontSize: 16,
    color: '#007bff',
    marginBottom: 10,
  },
});

export default DevicesScreen;
