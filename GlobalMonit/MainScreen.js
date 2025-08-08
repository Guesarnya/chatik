import React, { useState, useMemo } from 'react';
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


export default function MainScreen() {


  const navigation = useNavigation(); 
  const [activeTab, setActiveTab] = useState('map');
  const isCompactRing = useMemo(() => width < 360 || height < 640, []);

  return (
    <>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* Верхний блок с кольцом */}
          <View style={[
            styles.topBlock,
            isCompactRing && styles.topBlockSmall 
          ]}>
            <FirstRing isSmall={isCompactRing} />
          </View>

          {/* Две колонки */}
          <View style={styles.columns}>
            <View style={styles.leftColumn}>
              <View style={styles.healthBlock}>
                <Health />
              </View>
              <View style={styles.motivationBlock}>
                <Motivation />
              </View>
            </View>

            <View style={styles.rightColumn}>
              <View style={styles.recepiesBlock}>
                <Recepies />
              </View>
              <View style={styles.biometryBlock}>
                <Biometry />
              </View>
            </View>
          </View>
        </View>
        <BottomNavBar activeTab={activeTab} setActiveTab={setActiveTab} />
      </SafeAreaView>

    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFC',
  },

  topBlockSmall: {
    height: height * 0.48, 
    aspectRatio: undefined, 
    width: "100%"
  },

  container: {
    flex: 1,
    padding: width * 0.01,
    backgroundColor: '#F1F3F6',

  },
  topBlock: {
    aspectRatio: 1,
    borderRadius: 20,
    marginBottom: 4,
    width: "100%"
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
  motivationBlock: {
    flex: 0.5,
    borderRadius: 20,
    overflow: 'hidden',
  },
  recepiesBlock: {
    flex: 0.5,
    borderRadius: 20,
    marginBottom: 8,
    overflow: 'hidden',
  },
  biometryBlock: {
    flex: 0.8,
    borderRadius: 20,
    overflow: 'hidden',
  },

});

