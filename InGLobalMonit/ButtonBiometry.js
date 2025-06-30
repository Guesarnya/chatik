import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { height } = Dimensions.get('window');

export default function ButtonBiometry() {
  const navigation = useNavigation();

  const handleBiomerty = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* Кнопка назад - абсолютно слева по центру */}
        <TouchableOpacity style={styles.closeButton} onPress={handleBiomerty}>
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>

        {/* Заголовок строго по центру */}
        <Text style={styles.headerText}>Биометрия</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: height * 0.13,
    backgroundColor: "#0046F8",
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    position: "relative",
  },
  headerText: {
    color: "white",
    fontSize: 18,
    fontWeight: "500",
  },
  closeButton: {
    position: "absolute", 
    left: 16,
    top: "50%",
    transform: [{ translateY: -23 }], 
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0046F8",
  },
});
