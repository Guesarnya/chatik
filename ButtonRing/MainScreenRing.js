import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  FlatList,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import Ring from './Ring';
import DateSelector from './Date';
import MenuItem from './Menu';
import SettingsModalContent from './SettingsModalContent';

const { width, height } = Dimensions.get('window');

const MainScreenRing = ({ route, navigation }) => {
  const isCompactRing = useMemo(() => width < 360 || height < 640, []);

  const [dishes, setDishes] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedDish, setSelectedDish] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const { hash } = route.params;

  const [usId, setHash] = useState(hash)

  const fetchDishes = async () => {
    try {
      const response = await fetch(`https://www.xn--d1arx6a.xn--p1ai/dishes?user_id=${usId}`);
      const data = await response.json();

      const filteredDishes = data.filter(dish => dish.user.unique_user_id === usId);

      setDishes(filteredDishes);
      setLoading(false);
      if (!selectedDate) {
        const today = new Date().toISOString().split('T')[0];
        setSelectedDate(today);
      }
    } catch (error) {
      console.error("Error fetching dishes:", error);
      setLoading(false);
    }
  }


  useEffect(() => {
    fetchDishes();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (selectedDate) {
        fetchDishes();
      }
    }, [selectedDate])
  );

  const openEditModal = (dish) => {
    setSelectedDish(dish);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedDish(null);
  };

  const handleConfirmEdit = async () => {
    await fetchDishes();
    closeModal();
  };

  const handleDelete = async (idToDelete) => {
    try {
      const response = await fetch(`https://www.xn--d1arx6a.xn--p1ai/dishes/?dish_id=${idToDelete}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setDishes((prev) => prev.filter((d) => d.id !== idToDelete));
      } else {
        console.error('Не удалось удалить блюдо');
      }
    } catch (error) {
      console.error('Ошибка при удалении блюда:', error);
    }
  };


  const filteredDishes = selectedDate
    ? dishes.filter((dish) => new Date(dish.date_act).toISOString().split('T')[0] === selectedDate)
    : dishes;

  const isSmallScreen = height < 750;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <View style={[styles.topBlock, isSmallScreen && styles.SmallTopBlock]}>
          <Ring isSmall={isCompactRing} />
        </View>

        <DateSelector style={styles.dateSelector} onDateChange={setSelectedDate} />

        {loading ? (
          <ActivityIndicator size="large" color="#007BFF" style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }} />
        ) : (
          <FlatList
            style={styles.FlatList}
            data={filteredDishes}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <MenuItem
                id={item.id}
                name={item.dish_name}
                kcal={item.calories}
                protein={item.belki}
                fat={item.zhiri}
                carbs={item.uglevodi}
                image={{ uri: item.path_image }}
                currentDish={filteredDishes}
                onPress={() => openEditModal(item)}
                onDelete={() => handleDelete(item.id)}
                onSettingsConfirm={handleConfirmEdit}
              />
            )}
            contentContainerStyle={styles.listContent}
          />
        )}

        <Modal visible={isModalVisible} transparent animationType="slide">
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalBackground}>
              <View style={styles.modalContent}>
                {selectedDish && (
                  <SettingsModalContent
                    cardId={selectedDish.id}
                    dishName={selectedDish.dish_name}
                    belkiq={selectedDish.belki}
                    currentDish={selectedDish}
                    onClose={closeModal}
                    onConfirm={handleConfirmEdit}
                  />
                )}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default MainScreenRing;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F1F3F6',
  },
  container: {
    flex: 1,
    padding: width * 0.04,
    backgroundColor: '#F1F3F6',
  },
  topBlock: {
    aspectRatio: 1,
    borderRadius: 20,
    marginBottom: 4,
    width: "100%",
  },

  SmallTopBlock: {
    aspectRatio: 1.4,
    borderRadius: 20,
    marginBottom: 4,
    width: "100%",
  },

  dateSelector: {
    marginTop: 12,
    width: "100%"
  },
  listContent: {
    paddingBottom: 24,
  },
  FlatList: {
    marginTop: 10,
    borderRadius: 20,
    paddingHorizontal: 10,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    maxHeight: height * 0.7,
  },
});
