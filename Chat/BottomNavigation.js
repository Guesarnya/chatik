import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Alert } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTab } from '../AllBackEnd/TabContext';
import * as ImagePicker from "expo-image-picker";
import * as Camera from "expo-camera";
import { useFocusEffect } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';

import CameraModal from './CameraModal';

const tabs = [
  { id: 'home', label: 'Главная', icon: 'home' },
  { id: 'kamera', label: 'Новое блюдо', icon: 'camera' },
  { id: 'chat', label: 'ИИ чат', icon: 'message' },
];

export default function BottomNavBar({ hash }) {
  const [previewUri, setPreviewUri] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const navigation = useNavigation();
  const route = useRoute();
  const { activeTab, setActiveTab } = useTab();

  const [isLoading, setIsLoading] = useState(true);

  const [dishName, setDishName] = useState('');
  const [kcal, setKcal] = useState(0);
  const [protein, setProtein] = useState(0);
  const [fat, setFat] = useState(0);
  const [uglevodi, setUglevodi] = useState(0);


  useFocusEffect(
    React.useCallback(() => {
      if (route.name === 'MainScreen') {
        setActiveTab('home');
      } else if (route.name === 'Chat') {
        setActiveTab('chat');
      }
    }, [route.name])
  );



  const handleTabPress = async (tabId) => {
    setActiveTab(tabId);

    if (tabId === 'chat') {
      try {
        const response = await fetch('https://www.xn--d1arx6a.xn--p1ai/users/create-thread', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: hash,  // Передаем hash уникального пользователя
          }),
        });

        if (response.ok) {
          // Переход на экран чата только если запрос успешен
          navigation.navigate('Chat', { usId: hash });
        } else {
          console.error('Ошибка при отправке запроса на бэк:', response.status);
        }
      } catch (error) {
        console.error('Ошибка при отправке запроса:', error);
      }
    } else if (tabId === 'home') {
      navigation.navigate('MainScreen');
    } else if (tabId === 'kamera') {
      setModalVisible(true);
    }
  };



  const resetPreview = () => {
    setPreviewUri(null);
    setPreviewVisible(false);
  };

  const takePhoto = async () => {
    setModalVisible(false);
    setIsLoading(true);

    setTimeout(async () => {
      const { status } = await Camera.Camera.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Ошибка", "Разрешение на использование камеры отклонено");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        quality: 0.5,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        setPreviewUri(uri);
        setPreviewVisible(true);
        navigation.navigate('ImagePreview', { imageUri: uri, isLoading: true, hash: hash });

        const cloudinaryUrl = await uploadImageToCloudinary(uri);
        if (cloudinaryUrl) {
          console.log('Изображение загружено на Cloudinary:', cloudinaryUrl);

          analyzeImage(cloudinaryUrl);
        }
      }
    }, 700);
  };

  const pickFromGallery = async () => {
    setModalVisible(false);
    setIsLoading(true);

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
        const uri = result.assets[0].uri;
        setPreviewUri(uri);
        setPreviewVisible(true);

        navigation.navigate('ImagePreview', { imageUri: uri, isLoading: true, hash: hash });

        const cloudinaryUrl = await uploadImageToCloudinary(uri);
        if (cloudinaryUrl) {
          console.log('Изображение загружено на Cloudinary:', cloudinaryUrl);

          analyzeImage(cloudinaryUrl);
        }
      }
    }, 700);
  };


  const uploadImageToCloudinary = async (uri) => {
    const formData = new FormData();

    const file = {
      uri: uri,
      type: 'image/jpeg',
      name: 'photo.jpg',
    };

    formData.append('file', file);
    formData.append('upload_preset', 'FoodMood');

    try {
      const response = await fetch('https://api.cloudinary.com/v1_1/dsmswpqzj/image/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.secure_url) {
        return data.secure_url;
      } else {
        console.error('Ошибка загрузки изображения:', data);
        return null;
      }
    } catch (error) {
      console.error('Ошибка при загрузке на Cloudinary:', error);
      return null;
    }
  };


  const analyzeImage = async (cloudinaryUrl) => {
    setIsLoading(true);

    try {
      const response = await fetch(`https://www.xn--d1arx6a.xn--p1ai/food/analyze?imageUrl=${encodeURIComponent(cloudinaryUrl)}`, {
        method: 'GET',
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Результат анализа:', result);

        const analysisResult = result.result;

        if (analysisResult) {
          const { name, nutrients, joke, weight } = analysisResult;

          const imageData = {
            imageUri: cloudinaryUrl,
            name: name || 'Неизвестное блюдо',
            calories: nutrients?.calories || 0,
            protein: nutrients?.protein || 0,
            fat: nutrients?.fat || 0,
            carbs: nutrients?.carbs || 0,
            joke: joke || '',
            isLoading: false,
            weight: weight || 0,
          };

          navigation.navigate('ImagePreview', imageData);
        } else {
          console.error('Результат анализа изображения пустой');
        }
      } else {
        console.error('Ошибка при анализе изображения на сервере');
      }
    } catch (error) {
      console.error('Ошибка при отправке изображения на сервер:', error);
    } finally {
      setIsLoading(false);
    }
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
