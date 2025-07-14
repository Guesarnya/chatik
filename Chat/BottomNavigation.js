// components/BottomNavBar.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useTab } from '../AllBackEnd/TabContext';

const tabs = [
  {
    id: 'map',
    label: 'Map',
    icon: 'map-marker',
  },
  {
    id: 'notes',
    label: 'Notes',
    icon: 'bookmark-outline',
  },
  {
    id: 'alerts',
    label: 'Alerts',
    icon: 'bell-outline',
  },
];

export default function BottomNavBar() {
  const navigation = useNavigation();
  const { activeTab, setActiveTab } = useTab(); 

  const handleTabPress = (tabId) => {
    setActiveTab(tabId); 

    if (tabId === 'notes') {
      setActiveTab(tabId); 
      navigation.navigate('Chat');
    } else if (tabId === 'map') {
      setActiveTab(tabId); 
      navigation.navigate('MainScreen'); 
    } else {
      setActiveTab(tabId); 
    }
  };


  return (
    <View style={styles.bottomNavBar}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            style={styles.navButton}
            onPress={() => handleTabPress(tab.id)}
          >
            <View
              style={[
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
              <MaterialCommunityIcons
                name={tab.icon}
                size={24}
                color={isActive ? 'white' : 'black'}
              />
            </View>
            <Text style={styles.navText}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNavBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#F9FAFC',
    paddingBottom: Platform.select({
      ios: 20,
    }),
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
