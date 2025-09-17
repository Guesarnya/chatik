import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');
import Biometry from './Biometry';
import Health from './Health';
import Motivation from './Motivation';
import Recepies from './Recepies';
import FirstRing from './FirstRing';
import TestyAndHealthy from './TestyAndHealthy';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import BottomNavBar from '../Chat/BottomNavigation';
import md5 from 'crypto-js/md5';
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';



export default function MainScreen() {

  const [userId, setUserId] = useState('');

  const isSmallScreen = height < 750;

  useEffect(() => {
    const generateUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');

        if (storedUserId) {
          setUserId(storedUserId);
          setHash(storedUserId)
        } else {
          const phoneModel = Device.modelName;
          const firstVisitTime = new Date().toLocaleString();
          const uniqueString = phoneModel + ' ' + firstVisitTime;
          const hash = md5(uniqueString).toString();

          await AsyncStorage.setItem('userId', hash);

          setUserId(hash);
          setHash(hash)
          console.log("Generated User ID: ", hash);
        }
      } catch (error) {
        console.error('Error generating or retrieving user ID:', error);
      }
    };

    generateUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      console.log("Sending User ID: ", userId);
      sendUserIdToBackend(userId);
    }
  }, [userId]);



  const sendUserIdToBackend = async (userId) => {

    const isUserIdSent = await AsyncStorage.getItem('userIdSent');

    if (isUserIdSent) {
      console.log("User ID already sent to the backend.");
      return;
    }

    if (!userId) {
      console.warn('User ID is empty, not sending to backend.');
      return;
    }

    try {
      const response = await fetch('https://www.xn--d1arx6a.xn--p1ai/users/create-or-update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
        }),
      });

      const data = await response.json();
      console.log('Response from server:', data);

      await AsyncStorage.setItem('userIdSent', 'true');

    } catch (error) {
      console.error('Error sending user ID:', error);
    }
  };

  const [hash, setHash] = useState("");
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('map');
  const isCompactRing = useMemo(() => width < 360 || height < 640, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <SafeAreaView style={styles.safeArea} backgroundColor={"#F9FAFC"} edges={['bottom']}>
        <View style={styles.container}>
          {/* Верхний блок с кольцом */}
          <View style={[styles.topBlock, isSmallScreen && styles.SmallTopBlock]}>
            {hash && <FirstRing isSmall={isCompactRing} hash={hash} />}
          </View>

          {/* Две колонки */}
          <View style={styles.columns}>
            <View style={styles.leftColumn}>
              <View style={[styles.healthBlock, isSmallScreen && styles.SmallHealth]}>
                <Health />
              </View>
              <View style={[styles.motivationBlock, isSmallScreen && styles.SmallMotivation]}>
                <Motivation />
              </View>
            </View>

            <View style={styles.rightColumn}>
              <View style={[styles.recepiesBlock, isSmallScreen && styles.SmallRecept]}>
                <Recepies />
              </View>
              <View style={[styles.biometryBlock, isSmallScreen && styles.SmallBiometry]}>
                {hash && <Biometry hash={hash} />}
              </View>
            </View>
          </View>
        </View>
        {hash && <BottomNavBar activeTab={activeTab} setActiveTab={setActiveTab} hash={hash} />}
      </SafeAreaView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F1F3F6',
  },
  topBlockSmall: {
    height: height * 0.38,
    width: "100%",
  },
  container: {
    flex: 1,
    padding: width * 0.04,
    backgroundColor: '#F1F3F6',
  },
  topBlock: {
    aspectRatio: 1,
    borderRadius: 20,
    marginBottom: 4,
    width: "100%",
  },


  SmallTopBlock: {
    aspectRatio: 1.4,
    borderRadius: 20,
    marginBottom: 4,
    width: "100%",
  },

  columns: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  leftColumn: {
    flex: 1,
    justifyContent: 'space-between',
    marginRight: 4,
  },
  rightColumn: {
    flex: 1,
    justifyContent: 'space-between',
    marginLeft: 4,
  },
  healthBlock: {
    flex: 0.8,
    borderRadius: 20,
    marginBottom: 8,
    overflow: 'hidden',
  },

  SmallHealth: {
    flex: 0.58,
    borderRadius: 20,
    marginBottom: 8,
    overflow: 'hidden',
  },

  motivationBlock: {
    flex: 0.5,
    borderRadius: 20,
    overflow: 'hidden',
  },

  SmallMotivation: {
    flex: 0.4,
    borderRadius: 20,
    overflow: 'hidden',
  },


  recepiesBlock: {
    flex: 0.5,
    borderRadius: 20,
    marginBottom: 8,
    overflow: 'hidden',
  },

  SmallRecept: {
    flex: 0.4,
    borderRadius: 20,
    marginBottom: 8,
    overflow: 'hidden',
  },


  biometryBlock: {
    flex: 0.8,
    borderRadius: 20,
    overflow: 'hidden',
  },

  SmallBiometry: {
    flex: 0.58,
    borderRadius: 20,
    overflow: 'hidden',
  }
});
