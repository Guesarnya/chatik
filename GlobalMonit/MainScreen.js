import React, { useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');
import Biometry from './Biometry';
import Health from './Health';
import Motivation from './Motivation';
import Recepies from './Recepies';
import FirstRing from './FirstRing'; 
import TestyAndHealthy from './TestyAndHealthy';

export default function MainScreen() {


  const [activeTab, setActiveTab] = useState('map');
  const isCompactRing = useMemo(() => width < 360 || height < 640, []);

  const tabs = [
    {
      id: 'map',
      label: 'Map',
      icon: 'map-marker',
      iconSet: MaterialCommunityIcons,
      iconStyle: {
        size: 24,
        activeColor: 'white',
        inactiveColor: 'black',
        customStyle: {},
      },
    },
    {
      id: 'notes',
      label: 'Notes',
      icon: 'bookmark-outline',
      iconSet: MaterialCommunityIcons,
      iconStyle: {
        size: 24,
        activeColor: 'white',
        inactiveColor: 'black',
        customStyle: {},
      },
    },
    {
      id: 'alerts',
      label: 'Alerts',
      icon: 'bell-outline',
      iconSet: MaterialCommunityIcons,
      iconStyle: {
        size: 24,
        activeColor: 'white',
        inactiveColor: 'black',
        customStyle: {},
      },
    },
  ];

  return (
    <>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.container}>
          {/* Верхний блок с кольцом */}
          <View style={styles.topBlock}>
            <FirstRing isSmall = {isCompactRing} />
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
        {/* Нижняя панель навигации */}
      <View style={styles.bottomNavBar}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const IconComponent = tab.iconSet;

          return (
            <TouchableOpacity
              key={tab.id}
              style={styles.navButton}
              onPress={() => setActiveTab(tab.id)}
            >
              <View
                style={[
                  tab.iconStyle.customStyle,
                  isActive && {
                    backgroundColor: '#0046F8',
                    borderRadius: 20,
                    width: 80,
                    height: 40,
                    justifyContent: 'center',
                    alignItems: 'center',
                  },
                ]}
              >
                <IconComponent
                  name={tab.icon}
                  size={tab.iconStyle.size}
                  color={
                    isActive
                      ? tab.iconStyle.activeColor
                      : tab.iconStyle.inactiveColor
                  }
                />
              </View>
              <Text style={styles.navText}>{tab.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      </SafeAreaView>

    
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F1F3F6',
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
  bottomNavBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#F9FAFC',
    paddingBottom: Platform.select({
      android: 10,
      ios: 20
    })
  },
  navButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '33%',
  },
  navText: {
    fontSize: 12,
    color: '#333',
    marginTop: 2,
  },
});

