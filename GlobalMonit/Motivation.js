import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import InMotivationApi from './InMotivationApi';
import React, { useState } from 'react';

const { width } = Dimensions.get('window');

export default function Motivation() {
  const [modalVisible, setModalVisible] = useState(false);

  

  return (
    <>
    <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
      <SafeAreaProvider>
        <View style={styles.container}>
          <Text style={styles.motivationLabel}>Мотивация</Text>

          <View style={styles.imageContainer}>
            <Image
              source={require("../assets/motivation.png")}
              style={styles.image}
            />
          </View>
        </View>
      </SafeAreaProvider>
    </TouchableOpacity>

    <InMotivationApi visible={modalVisible} onClose={() => setModalVisible(false)} />
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    borderRadius: 20,
  },

  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    justifyContent: 'space-between',
  },

  motivationLabel: {
    fontSize: 18,
    fontWeight: 500,
    marginTop: -10,
    color: '#0046F8',
  },

  imageContainer: {
    width: '100%',
    aspectRatio: 190 / 119, 
    overflow: 'hidden',
    alignItems: 'flex-start', 
  },

  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});
