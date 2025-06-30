import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native'; 
import { useRoute, useFocusEffect } from '@react-navigation/native';
import { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
const { height, width } = Dimensions.get('window');

export default function Biometry() {
  const handleSend = () => {
    navigation.navigate('ButtonBiometry'); 
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
    navigation.navigate('ButtonBiometry'); 
  };

  const [weight, setWeight] = useState(80); 
  const [goal, setGoal] = useState("Худею");
  const [activity, setActivity] = useState("low");

  const route = useRoute();

  const activityLevelLabels = {
    low: "Не активный",
    more: "Небольшая активность",
    MoreThanMore: "Высокая активность",
    TheMost: "Активный"
  };

  useFocusEffect(
    useCallback(() => {
      const loadBiometrics = async () => {
        try {
          const jsonValue = await AsyncStorage.getItem('@biometrics');
          if (jsonValue != null) {
            const data = JSON.parse(jsonValue);
            console.log('Загружено:', data);
            if (data.weight) setWeight(data.weight);
            if (data.goal) setGoal(data.goal);
            if (data.activityLevel) setActivity(data.activityLevel);
          }
        } catch (e) {
          console.log('Ошибка при загрузке', e);
        }
      };

      loadBiometrics();
    }, [])
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
            <TouchableOpacity style={styles.kilo} onPress={handleSendKilo}>
              <View style={styles.FirstButtonTextRow}>
                <Text style={styles.textKilo}>{weight}</Text>
                <Text style={styles.KG}>КГ</Text>
              </View>
            </TouchableOpacity>

            {/* Цель */}
            <TouchableOpacity style={styles.kilo} onPress={handleSendDieta}>
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
            <TouchableOpacity style={styles.kilo} onPress={handleSendAktive}>
              <View style={styles.FirstButtonText}>
                <Text 
                  style={styles.textKilo}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                >
                  {activityLevelLabels[activity] || "Активность не выбрана"}
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
    flex: 1,
    borderRadius: 20,
    alignItems: 'center',  
    justifyContent: "flex-end"
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
    paddingHorizontal: 10,
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

  textKilo: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
    textAlign: "center"
  },

  KG: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
    marginLeft: 4,
  },
});
