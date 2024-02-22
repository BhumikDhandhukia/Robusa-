import React, { useState, useEffect } from 'react';
import { View, Text, Button, PermissionsAndroid } from 'react-native';
import { BleManager } from 'react-native-ble-plx';



const BluetoothScanner = () => {
  const [devices, setDevices] = useState([]);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    const initBluetooth = async () => {
      try {
        const manager = new BleManager();
        // Handle Bluetooth initialization if needed

        // Clean up on component unmount
        return () => {
          manager.destroy();
        };
      } catch (error) {
        console.error('Error initializing Bluetooth:', error);
      }
    };

    initBluetooth();
  }, []);

  const startScan = async () => {
    try {
      setScanning(true);

      // Request Bluetooth permissions dynamically
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADMIN,
      ]);
      console.log(granted)

      if (
        granted['android.permission.ACCESS_FINE_LOCATION'] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        granted['android.permission.BLUETOOTH'] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        granted['android.permission.BLUETOOTH_ADMIN'] ===
          PermissionsAndroid.RESULTS.GRANTED
      ) {
        const manager = new BleManager();
        const subscription = manager.onStateChange((state) => {
          if (state === 'PoweredOn') {
            manager.startDeviceScan(null, null, (error, device) => {
              if (error) {
                console.error(error);
                return;
              }
              if (!devices.some((dev) => dev.id === device.id)) {
                setDevices((prevDevices) => [...prevDevices, device]);
              }
            });
          }
        }, true);

        setTimeout(() => {
          manager.stopDeviceScan();
          setScanning(false);
          subscription.remove();
        }, 10000); // Stop scanning after 10 seconds
      } else {
        console.warn('Bluetooth permissions not granted');
        setScanning(false);
      }
    } catch (error) {
      console.error(error);
      setScanning(false);
    }
  };

  return (
    <View>
      <Text>Bluetooth Devices:</Text>
      {devices.map((device) => (
        <Text key={device.id}>{device.name || 'Unknown Device'}</Text>
      ))}
      <Button
        title={scanning ? 'Scanning...' : 'Start Scan'}
        onPress={startScan}
        disabled={scanning}
      />
    </View>
  );
};

export default BluetoothScanner;
