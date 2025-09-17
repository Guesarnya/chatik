import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, TextInput, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';

const { height, width } = Dimensions.get('window');

export default function ButtonBiometry({ route }) {
  const [selectedGender, setSelectedGender] = useState('Мужчина');
  const [selectedActivity, setSelectedActivity] = useState('low');
  const [goal, setGoal] = useState('Набрать мышечную массу');
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const navigation = useNavigation();

  const handleBiomerty = () => {
    navigation.goBack();
  };

  const userId = route.params.hash.hash;


  const goals = [
    'Похудеть',
    'Набрать мышечную массу',
    'Удерживать вес',
    'Улучшить выносливость',
  ];

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [heightValue, setHeightValue] = useState('');


  useEffect(() => {
    const fetchBiometrics = async () => {
      try {
        if (!userId) return;

        const res = await fetch(`https://www.xn--d1arx6a.xn--p1ai/biometry/${userId}`);
        if (!res.ok) throw new Error("Ошибка загрузки данных");

        const data = await res.json();

        if (data) {
          setName(data.name || '');
          setAge(data.age ? String(data.age) : '');
          setWeight(data.weight ? String(data.weight) : '');
          setHeightValue(data.hight ? String(data.hight) : '');
          setSelectedGender(data.male || 'Мужчина');
          setGoal(data.point || 'Набрать мышечную массу');

          if (data.activity === "Не активный") setSelectedActivity("low");
          else if (data.activity === "Небольшая активность") setSelectedActivity("more");
          else if (data.activity === "Высокая активность") setSelectedActivity("MoreThanMore");
          else if (data.activity === "Активный") setSelectedActivity("TheMost");
        }
      } catch (err) {
        console.log('Ошибка загрузки биометрии:', err);
      }
    };

    fetchBiometrics();
  }, [userId]);



  const handleSave = async () => {
    if (!userId) {
      Alert.alert('Ошибка', 'Пользователь ещё не инициализирован. Подождите.');
      return;
    }

    if (!name.trim()) {
      Alert.alert('Ошибка', 'Пожалуйста, введите имя.');
      return;
    }

    if (!age.trim() || isNaN(parseInt(age))) {
      Alert.alert('Ошибка', 'Возраст не был введен.');
      return;
    }

    if (!weight.trim() || isNaN(parseInt(weight))) {
      Alert.alert('Ошибка', 'Вес не был введен.');
      return;
    }

    if (!heightValue.trim() || isNaN(parseInt(heightValue))) {
      Alert.alert('Ошибка', 'Рост не был введен.');
      return;
    }

    const activityLevelLabels = {
      low: "Не активный",
      more: "Небольшая активность",
      MoreThanMore: "Высокая активность",
      TheMost: "Активный"
    };

    const biometricsData = {
      name,
      age: parseInt(age),
      weight: parseInt(weight),
      hight: parseInt(heightValue),
      male: selectedGender,
      point: goal,
      activity: activityLevelLabels[selectedActivity],
    };

    const payload = {
      userId,
      biometrics: biometricsData,
    };

    try {
      const response = await fetch(`https://www.xn--d1arx6a.xn--p1ai/biometry/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        navigation.goBack();
      } else {
        Alert.alert('Ошибка', result.message || 'Произошла ошибка при сохранении данных.');
      }
    } catch (error) {
      console.error('Ошибка при отправке данных:', error);
      Alert.alert('Ошибка', 'Не удалось связаться с сервером.');
    }
  };






  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <SafeAreaView style={styles.safeArea} edges={['bottom']} backgroundColor="#f1f4f8">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.container}>
            <View style={{ flex: 1 }}>
              <View style={styles.header}>

                <TouchableOpacity style={styles.closeButton} onPress={handleBiomerty}>
                  <Ionicons name="chevron-back" size={24} color="white" />
                </TouchableOpacity>

                <Text style={styles.headerText}>Биометрия</Text>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Имя:</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="Введите имя"
                    placeholderTextColor="#C8D0DC"
                    value={name}
                    onChangeText={setName}
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Возраст:</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="Введите возраст"
                    placeholderTextColor="#C8D0DC"
                    value={age}
                    onChangeText={setAge}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Вес:</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="Введите вес"
                    placeholderTextColor="#C8D0DC"
                    value={weight}
                    onChangeText={setWeight}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Рост:</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="Введите рост"
                    placeholderTextColor="#C8D0DC"
                    value={heightValue}
                    onChangeText={setHeightValue}
                    keyboardType="numeric"
                  />
                </View>
              </View>


              <View style={styles.genderToggleContainer}>
                <TouchableOpacity
                  style={[
                    styles.genderOption,
                    selectedGender === 'Мужчина' && styles.genderSelected,
                  ]}
                  onPress={() => setSelectedGender('Мужчина')}
                >
                  <Text
                    style={[
                      styles.genderText,
                      selectedGender === 'Мужчина' ? styles.genderTextSelected : styles.genderTextUnselected,
                    ]}
                  >
                    Мужчина
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.genderOption,
                    selectedGender === 'Женщина' && styles.genderSelected,
                  ]}
                  onPress={() => setSelectedGender('Женщина')}
                >
                  <Text
                    style={[
                      styles.genderText,
                      selectedGender === 'Женщина' ? styles.genderTextSelected : styles.genderTextUnselected,
                    ]}
                  >
                    Женщина
                  </Text>
                </TouchableOpacity>
              </View>


              {/* Цель */}
              <View style={styles.point}>
                <Text style={styles.textPoint}>Цель</Text>
              </View>

              <View style={styles.dropdownContainer}>
                <TouchableOpacity
                  style={styles.dropdownButton}
                  onPress={() => setDropdownVisible(!isDropdownVisible)}
                >
                  <Text style={styles.dropdownText}>{goal}</Text>
                  <Ionicons name={isDropdownVisible ? 'caret-up' : 'caret-down'} size={14} color="black" />
                </TouchableOpacity>

                {isDropdownVisible && (
                  <View style={styles.dropdownList}>
                    {goals.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.dropdownItem}
                        onPress={() => {
                          setGoal(item);
                          setDropdownVisible(false);
                        }}
                      >
                        <Text style={styles.dropdownItemText}>{item}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>


              {/* ---------------------------------------------------------------------- Нижняя выбор актвиности -------------------------------------------------------------------- */}
              <View style={styles.point}>
                <Text style={styles.textPoint}>Уровень активности в неделю</Text>
              </View>

              <View style={styles.genderToggleContainer}>
                <TouchableOpacity
                  style={[
                    styles.genderOption,
                    selectedActivity === 'low' && styles.genderSelected,
                  ]}
                  onPress={() => setSelectedActivity('low')}
                >
                  <Text
                    style={[
                      styles.genderText,
                      selectedActivity === 'low' ? styles.genderTextSelected : styles.genderTextUnselected,
                    ]}
                  >
                    Мало
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.genderOption,
                    selectedActivity === 'more' && styles.genderSelected,
                  ]}
                  onPress={() => setSelectedActivity('more')}
                >
                  <Text
                    style={[
                      styles.genderText,
                      selectedActivity === 'more' ? styles.genderTextSelected : styles.genderTextUnselected,
                    ]}
                  >
                    1-3 тренировки
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.genderToggleContainer}>
                <TouchableOpacity
                  style={[
                    styles.genderOption,
                    selectedActivity === 'MoreThanMore' && styles.genderSelected,
                  ]}
                  onPress={() => setSelectedActivity('MoreThanMore')}
                >
                  <Text
                    style={[
                      styles.genderText,
                      selectedActivity === 'MoreThanMore' ? styles.genderTextSelected : styles.genderTextUnselected,
                    ]}
                  >
                    3-5 тренировок
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.genderOption,
                    selectedActivity === 'TheMost' && styles.genderSelected,
                  ]}
                  onPress={() => setSelectedActivity('TheMost')}
                >
                  <Text
                    style={[
                      styles.genderText,
                      selectedActivity === 'TheMost' ? styles.genderTextSelected : styles.genderTextUnselected,
                    ]}
                  >
                    5+ тренировок
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.Save}>
              <TouchableOpacity style={styles.SaveButton} onPress={handleSave}>
                <Text style={styles.textSave}>Сохранить</Text>
              </TouchableOpacity>
            </View>

          </View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f4f8',
  },

  safeArea: {
    flex: 1,
    backgroundColor: "#0046F8",
  },

  SaveButton: {
    width: width * 0.93,
    height: height * 0.06,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    backgroundColor: "#0046F8",
    borderRadius: 20,
    alignSelf: "center",
  },

  Save: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    marginBottom: 10
  },

  textSave: {
    color: "white",
    fontSize: 18,
    fontWeight: "500"
  },

  point: {
    width: width * 0.93,
    paddingHorizontal: 16,
    marginTop: 10
  },

  textPoint: {
    fontSize: 16,
    fontWeight: "400",
    color: "#8E98A6"
  },

  header: {
    height: height * 0.08,
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

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    width: width * 0.93,
    height: height * 0.066,
    borderRadius: 20,
    alignSelf: "center",
    paddingHorizontal: 16,
    marginTop: 10,
  },

  label: {
    fontSize: 16,
    color: "#8E98A6",
    marginRight: 12,
    minWidth: 80,
    marginRight: 70
  },

  inputWrapper: {
    flex: 1,
  },

  input: {
    fontSize: 16,
    color: "black",
    textAlign: "left",
  },

  genderToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    width: width * 0.93,
    height: height * 0.066,
    borderRadius: 20,
    backgroundColor: '#f1f4f8',
    marginTop: 10,
  },

  genderOption: {
    flex: 1,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: 'white',
    marginHorizontal: 2,
  },

  genderSelected: {
    borderWidth: 2,
    borderColor: '#0046F8',
  },

  genderText: {
    fontSize: 16,
  },

  genderTextSelected: {
    color: '#000',
    fontWeight: '400',
  },

  genderTextUnselected: {
    color: '#C8D0DC',
    fontWeight: '400',
  },


  dropdownContainer: {
    width: width * 0.93,
    alignSelf: 'center',
    marginTop: 10,
  },

  dropdownButton: {
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: height * 0.07,
  },

  dropdownText: {
    fontSize: 16,
    color: 'black',
    fontWeight: "400"
  },

  dropdownList: {
    position: 'absolute',
    top: height * 0.07 + 10,
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    zIndex: 999,
  },

  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },

  dropdownItemText: {
    fontSize: 16,
    color: '#000',
  },

});
