import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, Modal, ActivityIndicator, Platform } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { LinearGradient } from 'expo-linear-gradient';
import RedactModalContent from './RedactModalContent';

const { width, height } = Dimensions.get("window");

export default function ImagePreviewScreen({ route, navigation }) {
  const { imageUri, name, calories, protein, fat, carbs, joke, isLoading, weight, hash } = route.params;

  const [modalVisible, setModalVisible] = useState(false);
  const currentTime = new Date().toISOString();
  const [usId, setHash] = useState(hash);
  const [redactModalVisible, setRedactModalVisible] = useState(false);


  const [initialData, setInitialData] = useState({
    calories,
    protein,
    fat,
    carbs,
  });

  const [caloriess, setCalories] = useState(calories);
  const [proteinn, setProtein] = useState(protein);
  const [fatt, setFat] = useState(fat);
  const [carbss, setCarbs] = useState(carbs);

  const [isDataChanged, setIsDataChanged] = useState(false);

  const sendToBackend = async (currentTime, name, calories, protein, fat, carbs, weight, imageUri, usId) => {
    try {
      const dataToSend = isDataChanged ? {
        date_act: currentTime,
        dish_name: name,
        calories: caloriess,
        belki: proteinn,
        zhiri: fatt,
        uglevodi: carbss,
        weight: weight,
        path_image: imageUri,
        user: usId,
      } : {
        date_act: currentTime,
        dish_name: name,
        calories: calories,
        belki: protein,
        zhiri: fat,
        uglevodi: carbs,
        weight: weight,
        path_image: imageUri,
        user: usId,
      };

      console.log("Отправляемые данные на сервер:", dataToSend);

      if (!currentTime || !name || !dataToSend.calories || !dataToSend.belki || !dataToSend.zhiri || !dataToSend.uglevodi || !dataToSend.weight || !imageUri || !usId) {
        console.log("Данные не были получены");
        return;
      }

      const response = await fetch("https://www.xn--d1arx6a.xn--p1ai/dishes/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();
      console.log("Ответ от сервера  ", data);
    } catch (error) {
      console.error("Ошибка", error);
    }
  };



  const handlePressBack = () => {
    if (isDataChanged) {
      sendToBackend(currentTime, name, caloriess, proteinn, fatt, carbss, weight, imageUri, usId);
    } else {
      sendToBackend(currentTime, name, calories, protein, fat, carbs, weight, imageUri, usId);
    }
    navigation.goBack();
  };



  const updateDishData = (updatedData) => {
    setCalories(updatedData.calories);
    setProtein(updatedData.protein);
    setFat(updatedData.fat);
    setCarbs(updatedData.carbs);


    setIsDataChanged(
      updatedData.calories !== initialData.calories ||
      updatedData.protein !== initialData.protein ||
      updatedData.fat !== initialData.fat ||
      updatedData.carbs !== initialData.carbs
    );
  };




  useEffect(() => {
    if (joke) {
      setModalVisible(true);
    }
  }, [joke, isLoading]);

  const handleDelete = () => {
    navigation.goBack();
  };

  const handleRedact = () => {
    setRedactModalVisible(true);
  };


  const isSmallScreen = height < 700;

  const modalStyles = StyleSheet.create({
    modalContent: {
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 30,
      width: width * 0.9,
      height: isSmallScreen ? height * 0.26 : height * 0.2,
      alignItems: 'center',
      justifyContent: "space-between"
    },

    modalContentt: {
      backgroundColor: 'white',
      borderRadius: 30,
      width: width * 0.9,
      height: isSmallScreen ? height * 0.26 : height * 0.2,
      alignItems: 'center',
      justifyContent: "center"
    },
  });

  return (
    <View style={styles.SafeArea}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUri }} style={styles.image} />
        <LinearGradient
          colors={['#00000000', '#000000']}
          style={styles.gradientOverlay}
        />
        <TouchableOpacity style={styles.closeButton} onPress={handlePressBack}>
          <Ionicons name="chevron-back" size={28} color="white" />
        </TouchableOpacity>

        <View style={styles.centeredLabelContainer}>
          <Text style={styles.AnalyticLabel}>Анализ блюда</Text>
        </View>
      </View>

      <View style={styles.BottomBlock}>
        <View style={styles.forLabel}>
          <Text style={styles.DishLabel}>{name}</Text>
        </View>

        <View style={styles.TopBlockIn}>
          <View style={styles.KcalBlock}>
            <Text style={styles.Labels}>Каллории</Text>
            <Text style={styles.LabelsNumerik}>{isDataChanged ? caloriess : calories}</Text>
          </View>

          <View style={styles.FatBlock}>
            <Text style={styles.Labels}>Жиры</Text>
            <Text style={styles.LabelsNumerik}>{isDataChanged ? fatt : fat}</Text>
          </View>
        </View>

        <View style={styles.TopBlockIn}>
          <View style={styles.KcalBlock}>
            <Text style={styles.Labels}>Белки</Text>
            <Text style={styles.LabelsNumerik}>{isDataChanged ? proteinn : protein}</Text>
          </View>

          <View style={styles.FatBlock}>
            <Text style={styles.Labels}>Углеводы</Text>
            <Text style={styles.LabelsNumerik}>{isDataChanged ? carbss : carbs}</Text>
          </View>
        </View>

        <View style={styles.Buttons}>
          <TouchableOpacity style={styles.redact} onPress={handleRedact}>
            <Text style={styles.redactLabel}>Изменить</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.delete} onPress={handleDelete}>
            <Text style={styles.deleteLabel}>Удалить</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        transparent={true}
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={modalStyles.modalContent}>
            <Text style={styles.modalText}>{joke}</Text>

            <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalButtonText}>Сделать снимок еще раз</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        transparent={true}
        animationType="fade"
        visible={isLoading}
        onRequestClose={() => { }}
      >
        <View style={styles.modalOverlay}>
          <View style={modalStyles.modalContentt}>
            <ActivityIndicator size="large" color="#0046F8" />
            <Text style={styles.modalText}>Загрузка...</Text>
          </View>
        </View>
      </Modal>

      <RedactModalContent
        visible={redactModalVisible}
        setVisible={setRedactModalVisible}
        dishName={name}
        protein={protein}
        fat={fat}
        carbs={carbs}
        calories={calories}
        onSave={updateDishData}
      />
    </View>
  );
}

const styles = StyleSheet.create({


  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 30,
    width: width * 0.9,
    height: height * 0.2,
    alignItems: 'center',
    justifyContent: "space-between"
  },

  modalContentt: {
    backgroundColor: 'white',
    borderRadius: 30,
    width: width * 0.9,
    height: height * 0.2,
    alignItems: 'center',
    justifyContent: "center"
  },

  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },

  modalButton: {
    backgroundColor: '#0046F8',
    borderRadius: 20,
    height: height * 0.06,
    width: width * 0.8,
    justifyContent: "center",
    alignItems: "center"
  },

  modalButtonText: {
    color: 'white',
    fontSize: 16,
  },

  SafeArea: {
    flex: 1,
    backgroundColor: '#F9FAFC',
  },

  redactLabel: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "400"
  },

  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.2,
  },


  deleteLabel: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "400"
  },

  redact: {
    alignItems: "center",
    justifyContent: "center",
    height: height * 0.06,
    marginBottom: 10,
    marginTop: 10,
    width: width * 0.88,
    borderRadius: 70,
    backgroundColor: "#0046F8"
  },

  delete: {
    alignItems: "center",
    justifyContent: "center",
    height: height * 0.06,
    width: width * 0.88,
    borderRadius: 70,
    backgroundColor: "#000000"
  },

  Buttons: {
    alignItems: "center"
  },

  Labels: {
    padding: 12,
    fontSize: 16,
    fontWeight: "400"
  },

  LabelsNumerik: {
    fontSize: 28,
    position: "absolute",
    right: 14,
    bottom: 10
  },

  KcalBlock: {
    height: height * 0.14,
    width: width * 0.44,
    marginHorizontal: 8,
    borderRadius: 10,
    backgroundColor: 'white',
  },

  FatBlock: {
    height: height * 0.14,
    width: width * 0.44,
    marginHorizontal: 8,
    borderRadius: 10,
    backgroundColor: 'white',
  },

  TopBlockIn: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 18,
  },


  DishLabel: {
    fontSize: 20,
    fontWeight: "400"
  },

  forLabel: {
    alignItems: "center",
    paddingTop: 18
  },

  BottomBlock: {
    height: height * 0.56,
    backgroundColor: "#F9FAFC",
    position: "absolute",
    left: 0,
    right: 0,
    bottom: Platform.OS === "android" ? 56 : 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  },

  imageContainer: {
    width: width,
    height: height * 0.54,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: height * 0.54,
  },


  closeButton: {
    position: 'absolute',
    top: height * 0.06,
    left: 20,
    width: 46,
    height: 46,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },

  centeredLabelContainer: {
    position: 'absolute',
    top: height * 0.08,
    left: 0,
    right: 0,
    alignItems: 'center',
    transform: [{ translateY: -10 }],
  },


  AnalyticLabel: {
    fontSize: 22,
    color: "#FFFFFF",
    fontWeight: "500",
  },
});
