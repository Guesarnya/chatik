import { Modal, Text, TouchableOpacity, View, StyleSheet, Dimensions, TouchableWithoutFeedback, Keyboard, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FloatingLabelInput from '../ButtonRing/SettingsModalContent';
import React, { useState, useRef, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const RedactModalContent = ({ visible, setVisible, dishName, protein, fat, carbs, calories, onSave }) => {


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


  const [initialData, setInitialData] = useState({
    calories,
    protein,
    fat,
    carbs,
  });

  const isSmallScreen = height < 700;

  const modalStyles = StyleSheet.create({
    container: {
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 10,
      width: width * 0.9,
      height: isSmallScreen ? height * 0.8 : height * 0.62,
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

  const [isDataChanged, setIsDataChanged] = useState(false);

  const [belki, setBelki] = useState(protein);
  const [szhiri, setSzhiri] = useState(fat);
  const [uglevodi, setUglevodi] = useState(carbs);
  const [kcal, setKcal] = useState(calories);

  const fatRef = useRef();
  const carbRef = useRef();
  const kcalRef = useRef();

  const onClose = () => {
    setVisible(false);
  };

  const handleConfirm = () => {
    const updatedData = {
      protein: belki,
      fat: szhiri,
      carbs: uglevodi,
      calories: kcal,
    };
    onSave(updatedData);
    setVisible(false);
  };

  const handleDismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const updateDishData = (updatedData) => {
    setKcal(updatedData.calories);
    setBelki(updatedData.protein);
    setSzhiri(updatedData.fat);
    setUglevodi(updatedData.carbs);
    setIsDataChanged(
      updatedData.calories !== initialData.calories ||
      updatedData.protein !== initialData.protein ||
      updatedData.fat !== initialData.fat ||
      updatedData.carbs !== initialData.carbs
    );
  };

  useEffect(() => {
    updateDishData({ calories, protein, fat, carbs });
  }, [calories, protein, fat, carbs]);

  return (
    <Modal transparent={true} animationType="fade" visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={handleDismissKeyboard}>
          <View>
            <View style={[modalStyles.container, hasNavBar && styles.hasnavContainer]}>
              <Text style={styles.mainLabel}>Изменить блюдо</Text>
              <Text style={styles.name}>{dishName}</Text>

              <View style={modalStyles.middleBlock}>
                <FloatingLabelInput
                  label="Белки"
                  value={isDataChanged ? belki : protein}
                  onChangeText={setBelki}
                  placeholder={isDataChanged ? String(belki) : String(protein)}
                  onSubmitEditing={() => fatRef.current?.focus()}
                />
                <FloatingLabelInput
                  label="Жиры"
                  value={isDataChanged ? szhiri : fat}
                  onChangeText={setSzhiri}
                  placeholder={isDataChanged ? String(szhiri) : String(fat)}
                  ref={fatRef}
                  onSubmitEditing={() => carbRef.current?.focus()}
                />
                <FloatingLabelInput
                  label="Углеводы"
                  value={isDataChanged ? uglevodi : carbs}
                  onChangeText={setUglevodi}
                  placeholder={isDataChanged ? String(uglevodi) : String(carbs)}
                  ref={carbRef}
                  onSubmitEditing={() => kcalRef.current?.focus()}
                />
                <FloatingLabelInput
                  label="Ккал"
                  value={isDataChanged ? kcal : calories}
                  onChangeText={setKcal}
                  placeholder={isDataChanged ? String(kcal) : String(calories)}
                  ref={kcalRef}
                  returnKeyType="done"
                />
              </View>

              <View style={modalStyles.buttonRow}>
                <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                  <Text style={styles.buttonText}>Отменить</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleConfirm}>
                  <Text style={styles.buttonText}>Применить</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({

  topBlock: {
    padding: 2,
  },
  mainLabel: {
    fontSize: 24,
    fontWeight: "400",
  },
  name: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: "400",
    marginBottom: 16,
  },

  button: {
    backgroundColor: "white",
    borderRadius: 10,
    marginRight: 14,
  },
  cancelButton: {
    backgroundColor: "white",
    marginRight: 30,
  },
  buttonText: {
    color: "black",
    fontSize: 14,
    fontWeight: "500",
  },

  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  container: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: width * 0.9,
    height: height * 0.62,
  },

  hasnavContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: width * 0.9,
    height: height * 0.76,
  }

});

export default RedactModalContent;
