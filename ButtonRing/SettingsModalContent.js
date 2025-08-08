import React, { useState, forwardRef, useRef } from 'react';
import { View, Text, Button, Dimensions, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';

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

export const SettingsModalContent = ({ onClose, onConfirm, cardId, dishName }) => {
  const [belki, setBelki] = useState('');
  const [szhiri, setSzhiri] = useState('');
  const [uglevodi, setUglevodi] = useState('');
  const [kcal, setKcal] = useState('');

  const fatRef = useRef();
  const carbRef = useRef();
  const kcalRef = useRef();

  const isSmallScreen = height < 700;

  const modalStyles = StyleSheet.create({
    container: {
      height: isSmallScreen ? height * 0.72 : height * 0.58,
    },
    middleBlock: {
      paddingHorizontal: 10,
      marginTop: isSmallScreen ? 0 : 10, 
    },
    buttonRow: {
      flexDirection: "row",
      justifyContent: "flex-end",
      marginTop: "auto",
      gap: 12,
      paddingHorizontal: 10,
      paddingBottom: 10,
    },
  });

  return (
    <View style={modalStyles.container}>
      <View style={styles.topBlock}>
        <Text style={styles.mainLabel}>Изменить блюдо</Text>
        <Text style={styles.name}>{dishName}</Text>
      </View>

      <View style={modalStyles.middleBlock}>
        <FloatingLabelInput
          label="Белки"
          value={belki}
          onChangeText={setBelki}
          placeholder="0"
          onSubmitEditing={() => fatRef.current?.focus()}
        />
        <FloatingLabelInput
          label="Жиры"
          value={szhiri}
          onChangeText={setSzhiri}
          placeholder="0"
          ref={fatRef}
          onSubmitEditing={() => carbRef.current?.focus()}
        />
        <FloatingLabelInput
          label="Углеводы"
          value={uglevodi}
          onChangeText={setUglevodi}
          placeholder="0"
          ref={carbRef}
          onSubmitEditing={() => kcalRef.current?.focus()}
        />
        <FloatingLabelInput
          label="Ккал"
          value={kcal}
          onChangeText={setKcal}
          placeholder="0"
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
          onPress={async () => {
            try {
              const parsedBelki = parseFloat(belki || '0');
              const parsedZhiri = parseFloat(szhiri || '0');
              const parsedUglevodi = parseFloat(uglevodi || '0');
              const parsedKcal = parseFloat(kcal || '0');

              if (isNaN(parsedBelki) || isNaN(parsedZhiri) || isNaN(parsedUglevodi) || isNaN(parsedKcal)) {
                Alert.alert('Ошибка', 'Все значения должны быть числовыми.');
                return;
              }

              if (cardId === undefined) {
                Alert.alert('Ошибка', 'cardId не передан');
                return;
              }

              const url = `https://chatik-1.onrender.com/api/edit_card?card_id=${cardId}&belki=${parsedBelki}&zhiri=${parsedZhiri}&uglevodi=${parsedUglevodi}&kkal=${parsedKcal}`;

              const response = await fetch(url);
              const data = await response.json();
              if (onConfirm) {
                await onConfirm({
                  id: cardId,
                  dish_name: dishName,
                  белки: parsedBelki,
                  жиры: parsedZhiri,
                  углеводы: parsedUglevodi,
                  калории: parsedKcal
                });
              }
              onClose();
            } catch (error) {
              Alert.alert('Ошибка', 'Не удалось отправить данные.');
            }
          }}
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
  }
});
