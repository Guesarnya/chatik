import { View, Text, StyleSheet, TouchableOpacity, Image, Modal } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Dimensions } from 'react-native';
import * as Font from 'expo-font';
import { useFonts } from 'expo-font';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import TestyAndHealthy from './TestyAndHealthy';

const { width } = Dimensions.get('window');

export default function Recepies() {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
        <SafeAreaProvider>
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.healthLabel}>Хочу Рецепт</Text>
            </View>
            <View style={styles.imageWrapper}>
              <Image
                source={require("../assets/recept.png")}
                style={styles.image}
              />
            </View>
          </View>
        </SafeAreaProvider>
      </TouchableOpacity>

      {/* Всплывающее окно */}
      <TestyAndHealthy visible={modalVisible} onClose={() => setModalVisible(false)} />
    </>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFF',
    borderRadius: 20,
    padding: 20,
    justifyContent: 'flex-start',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  healthLabel: {
    fontSize: 18,
    fontWeight: 500,
    marginTop: -10,
    color: "#0046F8"
  },

  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  imageWrapper: {
    width: '100%',
    height: 160,
    overflow: 'hidden',
    alignItems: 'flex-start',
  },


  button: {
    flex: 1,
    borderRadius: 20,
  },


});
