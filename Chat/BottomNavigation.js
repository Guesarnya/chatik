import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Alert } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useTab } from '../AllBackEnd/TabContext';
import * as ImagePicker from "expo-image-picker";
import * as Camera from "expo-camera";
import { useFocusEffect } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';

import ImagePreviewModal from './ImagePreviewModal';
import CameraModal from './CameraModal';

const tabs = [
  { id: 'home', label: 'Главная', icon: 'home' },
  { id: 'kamera', label: 'Новое блюдо', icon: 'camera' },
  { id: 'chat', label: 'ИИ чат', icon: 'message' },
];

export default function BottomNavBar() {
  const [previewUri, setPreviewUri] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const navigation = useNavigation();
  const route = useRoute();
  const { activeTab, setActiveTab } = useTab();


  useFocusEffect(
    React.useCallback(() => {
      if (route.name === 'MainScreen') {
        setActiveTab('home');
      } else if (route.name === 'Chat') {
        setActiveTab('chat');
      }
    }, [route.name])
  );



  const handleTabPress = (tabId) => {
    setActiveTab(tabId);
    if (tabId === 'chat') navigation.navigate('Chat');
    else if (tabId === 'home') navigation.navigate('MainScreen');
    else if (tabId === 'kamera') setModalVisible(true);
  };

  const resetPreview = () => {
    setPreviewUri(null);
    setPreviewVisible(false);
  };

  const takePhoto = async () => {
    setModalVisible(false);

    setTimeout(async () => {
      const { status } = await Camera.Camera.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Ошибка", "Разрешение на использование камеры отклонено");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setPreviewUri(result.assets[0].uri);
        setPreviewVisible(true);
      }
    }, 700);
  };

  const pickFromGallery = async () => {
    setModalVisible(false);

    setTimeout(async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Ошибка", "Разрешение на доступ к галерее отклонено");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setPreviewUri(result.assets[0].uri);
        setPreviewVisible(true);
      }
    }, 700);
  };

  return (
    <>
      <View style={styles.bottomNavBar}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={styles.navButton}
              onPress={() => handleTabPress(tab.id)}
            >
              <View style={isActive ? styles.activeIconWrapper : null}>
                <MaterialCommunityIcons
                  name={tab.icon}
                  size={24}
                  color={isActive ? '#0046F8' : 'black'}
                />
              </View>
              <Text style={styles.navText}>{tab.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <CameraModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onTakePhoto={takePhoto}
        onPickFromGallery={pickFromGallery}
      />

      <ImagePreviewModal
        key={previewUri}
        visible={previewVisible}
        imageUri={previewUri}
        onSend={() => {
          console.log("Отправка фото:", previewUri);
          resetPreview();
        }}
        onDelete={resetPreview}
        onClose={resetPreview}
      />
    </>
  );
}

const styles = StyleSheet.create({
  bottomNavBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#F9FAFC',
  },
  navButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '25%',
  },
  navText: {
    fontSize: 12,
    color: '#333',
    marginTop: 2,
  },
  activeIconWrapper: {
    backgroundColor: '#F9FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
