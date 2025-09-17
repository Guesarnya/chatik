import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useRoute, useFocusEffect } from '@react-navigation/native';
import { useState, useCallback } from 'react';


const { height, width } = Dimensions.get('window');
const isSmallScreen = width < 400;

export default function Biometry(hash) {
  const userId = hash.hash;


  const handleSend = () => {
    navigation.navigate('ButtonBiometry', { hash: hash });
  };
  const handleSendKilo = () => {
    console.log(weight + " КГ")
  }

  const handleSendDieta = () => {
    console.log(goal)
  }

  const handleSendAktive = () => {
    console.log("Активность")
  }

  const navigation = useNavigation();

  const handleBiomerty = () => {
    navigation.navigate('ButtonBiometry', { hash: hash });
  };

  const [weight, setWeight] = useState("-");
  const [goal, setGoal] = useState("-");
  const [activity, setActivity] = useState("-");

  const route = useRoute();



  const fetchBiometrics = async () => {
    try {
      const response = await fetch(`https://www.xn--d1arx6a.xn--p1ai/biometry/${userId}`);

      if (!response.ok) {
        console.log("Нет данных в БД, использую дефолтные");
        return;
      }

      const data = await response.json();

      setWeight(data.weight ?? "-");
      setGoal(data.point ?? "-");
      setActivity(data.activity ?? "-");
    } catch (e) {
      console.log("Ошибка при загрузке из API:", e);
    }
  };

  // Вместо useEffect:
  useFocusEffect(
    useCallback(() => {
      if (userId) {
        fetchBiometrics();
      }
    }, [userId])
  );








  return (
    <TouchableOpacity style={styles.TouchableOpacity} onPress={handleBiomerty}>
      <SafeAreaProvider>
        <View style={styles.container}>

          {/* Верхний блок: заголовок и кнопка настроек */}
          <View style={styles.header}>
            <View>
              <Text style={styles.BiometryLabel}>Биометрия</Text>
            </View>

            <TouchableOpacity
              style={styles.QuestionButton}
              onPress={handleSend}>
              <Ionicons
                name="settings-outline"
                size={27}
                color={"#C8D0DC"}
              />
            </TouchableOpacity>
          </View>

          {/* Кнопки */}
          <View style={styles.BottomButtons}>
            {/* Вес */}
            <TouchableOpacity style={[styles.kilo, isSmallScreen && styles.kiloSmall]} onPress={handleSendKilo}>
              <View style={styles.FirstButtonTextRow}>
                <Text style={styles.textKilo}>
                  {weight}{weight !== "-" ? " кг" : ""}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Цель */}
            <TouchableOpacity style={[styles.kilo, isSmallScreen && styles.kiloSmall]} onPress={handleSendDieta}>
              <View style={styles.FirstButtonText}>
                <Text
                  style={styles.textKilo}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                >
                  {goal}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Активность */}
            <TouchableOpacity style={[styles.kilo, isSmallScreen && styles.kiloSmall]} onPress={handleSendAktive}>
              <View style={styles.FirstButtonText}>
                <Text
                  style={styles.textKilo}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                >
                  {activity || "Активность не выбрана"}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

        </View>
      </SafeAreaProvider>
    </TouchableOpacity>
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

  TouchableOpacity: {
    flex: 1
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  BiometryLabel: {
    marginTop: -15,
    fontWeight: "400",
    fontSize: 16,
    color: "#8E98A6"
  },

  QuestionButton: {
    width: 32,
    height: 32,
    backgroundColor: 'white',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -10,
  },

  BottomButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    borderRadius: 20,
  },

  FirstButtonText: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    flex: 1
  },

  FirstButtonTextRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },

  kilo: {
    backgroundColor: '#0046F8',
    borderRadius: 10,
    paddingVertical: 10,
    width: '100%',
    alignItems: 'center',
    marginTop: 4,
    height: 46
  },

  kiloSmall: {
    height: 40,
    paddingVertical: 6,
  },

  textKilo: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
    textAlign: "center",
  },

  KG: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
    marginLeft: 4,
  },
});
