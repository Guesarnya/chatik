import React, { useState, forwardRef, useRef, useEffect } from 'react';
import { View, Text, Button, Dimensions, StyleSheet, TextInput, TouchableOpacity, Alert, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get("window");

const FloatingLabelInput = forwardRef(({ label, value, onChangeText, placeholder, onSubmitEditing, returnKeyType = "next" }, ref) => {
  const handleChangeText = (text) => {
    if (!/^\d*\.?\d*$/.test(text) && text !== '') {
      Alert.alert('Ошибка', 'Недопустимое значение. Используйте только цифры и точку.');
      return;
    }
    onChangeText(text);
  };

  return (
    <View style={floatingStyles.wrapper}>
      <Text style={floatingStyles.label}>{label}</Text>
      <TextInput
        ref={ref}
        style={floatingStyles.input}
        value={value}
        onChangeText={handleChangeText}
        placeholder={placeholder}
        placeholderTextColor="#C8D0DC"
        keyboardType="numeric"
        returnKeyType={returnKeyType}
        onSubmitEditing={onSubmitEditing}
      />
    </View>
  );
});

export default FloatingLabelInput;

const floatingStyles = StyleSheet.create({
  wrapper: { marginBottom: 24, position: 'relative', marginTop: 12 },
  label: {
    position: 'absolute', top: -10, left: 12,
    backgroundColor: 'white', paddingHorizontal: 4,
    fontSize: 14, color: '#000000', zIndex: 1,
  },
  input: {
    borderWidth: 1, borderColor: '#C8D0DC', borderRadius: 4,
    paddingVertical: 12, paddingHorizontal: 12,
    fontSize: 16, color: '#000', height: 48,
  },
});

export const SettingsModalContent = ({ onClose, onConfirm, cardId, dishName, currentDish, protein, calories, fat, carbs }) => {


  const [isDataChanged, setIsDataChanged] = useState(false);

  const [belki, setBelki] = useState(protein);
  const [szhiri, setSzhiri] = useState(fat);
  const [uglevodi, setUglevodi] = useState(carbs);
  const [kcal, setKcal] = useState(calories);


  const fatRef = useRef();
  const carbRef = useRef();
  const kcalRef = useRef();

  const isSmallScreen = height < 700;

  const modalStyles = StyleSheet.create({
    container: {
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 10,
      width: width * 0.9,
      height: isSmallScreen ? height * 0.76 : height * 0.60,
    },
    middleBlock: {
      paddingHorizontal: 10,
      marginTop: isSmallScreen ? 0 : 10,
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: 'auto',
      gap: 12,
      paddingHorizontal: 10,
      paddingBottom: 10,
    },
  });

  const handleConfirm = async () => {
    try {
      const parsedBelki = parseFloat(belki) || 0;
      const parsedZhiri = parseFloat(szhiri) || 0;
      const parsedUglevodi = parseFloat(uglevodi) || 0;
      const parsedKcal = parseFloat(kcal) || 0;

      if (isNaN(parsedBelki) || isNaN(parsedZhiri) || isNaN(parsedUglevodi) || isNaN(parsedKcal)) {
        Alert.alert('Ошибка', 'Все значения должны быть числовыми.');
        return;
      }

      const updatedDish = {};

      if (parsedBelki !== currentDish.belki) updatedDish.belki = parsedBelki;
      if (parsedZhiri !== currentDish.zhiri) updatedDish.zhiri = parsedZhiri;
      if (parsedUglevodi !== currentDish.uglevodi) updatedDish.uglevodi = parsedUglevodi;
      if (parsedKcal !== currentDish.calories) updatedDish.calories = parsedKcal;

      if (dishName !== currentDish.dish_name) updatedDish.dish_name = dishName;


      if (!cardId) {
        Alert.alert('Ошибка', 'ID блюда не передан');
        return;
      }


      const url = `https://www.xn--d1arx6a.xn--p1ai/dishes/${cardId}`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedDish),
      });

      const data = await response.json();

      if (response.ok) {
        if (onConfirm) {
          await onConfirm(updatedDish);
        }
        onClose();
      } else {
        throw new Error(data.message || 'Не удалось обновить блюдо');
      }
    } catch (error) {
      Alert.alert('Ошибка', error.message || 'Не удалось отправить данные.');
    }
  }



  const insets = useSafeAreaInsets();

  const { height: screenHeight } = Dimensions.get('screen');
  const { height: windowHeight } = Dimensions.get('window');
  const [hasNavBar, setHasNavBar] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'android') {
      setHasNavBar(screenHeight > windowHeight + insets.bottom + 20);
    }
  }, []);

  console.log(hasNavBar)

  return (
    <View style={[modalStyles.container, hasNavBar && styles.hasnavContainer]}>
      <View style={styles.topBlock}>
        <Text style={styles.mainLabel}>Изменить блюдо</Text>
        <Text style={styles.name}>{dishName}</Text>
      </View>

      <View style={modalStyles.middleBlock}>
        <FloatingLabelInput
          label="Белки"
          value={belki}
          onChangeText={setBelki}
          placeholder={String(protein)}
          onSubmitEditing={() => fatRef.current?.focus()}
        />
        <FloatingLabelInput
          label="Жиры"
          value={szhiri}
          onChangeText={setSzhiri}
          placeholder={String(fat)}
          ref={fatRef}
          onSubmitEditing={() => carbRef.current?.focus()}
        />
        <FloatingLabelInput
          label="Углеводы"
          value={uglevodi}
          onChangeText={setUglevodi}
          placeholder={String(carbs)}
          ref={carbRef}
          onSubmitEditing={() => kcalRef.current?.focus()}
        />
        <FloatingLabelInput
          label="Ккал"
          value={kcal}
          onChangeText={setKcal}
          placeholder={String(calories)}
          ref={kcalRef}
          returnKeyType="done"
        />
      </View>

      <View style={modalStyles.buttonRow}>
        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
          <Text style={styles.buttonText}>Отменить</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={handleConfirm}
        >
          <Text style={styles.buttonText}>Применить</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    height: height * 0.58
  },
  topBlock: {
    padding: 2
  },
  mainLabel: {
    fontSize: 24,
    fontWeight: "400"
  },
  name: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: "400",
    marginBottom: 16
  },
  middleBlock: {
    paddingHorizontal: 10,
    marginTop: 10,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: "auto",
    gap: 12,
    paddingHorizontal: 10,
    paddingBottom: 10
  },
  button: {
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10
  },
  cancelButton: {
    backgroundColor: "white"
  },
  buttonText: {
    color: "black",
    fontSize: 14,
    fontWeight: "500"
  },

  hasnavContainer: {
    height: height * 0.86,
  }
});
