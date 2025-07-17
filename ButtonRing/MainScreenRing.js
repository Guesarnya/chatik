import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  FlatList,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import Ring from './Ring';
import DateSelector from './Date';
import MenuItem from './Menu';
import SettingsModalContent from './SettingsModalContent'; 

const { width, height } = Dimensions.get('window');

const MainScreenRing = () => {
  const isCompactRing = useMemo(() => width < 360 || height < 640, []);

  const [dishes, setDishes] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedDish, setSelectedDish] = useState(null);
  const [needsRefresh, setNeedsRefresh] = useState(false);

  const fetchDishes = async () => {
    try {
      const response = await fetch('https://chatik-zp8f.onrender.com/dishes');
      const data = await response.json();
      setDishes(data);
    } catch (error) {
      console.error('Ошибка при получении блюд:', error);
    }
  };

useEffect(() => {
  if (filteredDishes.length === 0) {
    console.log(`⚠️ Нет данных на дату: ${selectedDate.toLocaleDateString('en-CA')}`);
  } else {
    console.log(`✅ ${filteredDishes.length} блюд на ${selectedDate.toISOString().slice(0, 10)}`);
  }
}, [filteredDishes, selectedDate]);


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


  useFocusEffect(
    useCallback(() => {
      if (needsRefresh) {
        fetchDishes();
        setNeedsRefresh(false);
      }
    }, [needsRefresh])
  );



  const handleDelete = async (idToDelete) => {
    try {
      await fetch(`https://chatik-zp8f.onrender.com/api/delete_card?card_id=${idToDelete}`);
      await fetchDishes();
      setDishes(prev => prev.filter(d => d.id !== idToDelete));
    } catch (error) {
      console.error('Ошибка при удалении блюда:', error);
    }
  };



  const [selectedDate, setSelectedDate] = useState(new Date());

const filteredDishes = useMemo(() => {
  const selectedDateStr = selectedDate.toLocaleDateString('en-CA');
  return dishes.filter(dish => {
    const dishDateStr = new Date(dish.date_act).toLocaleDateString('en-CA');
    return dishDateStr === selectedDateStr;
  });
}, [dishes, selectedDate]);




  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.topBlock}>
          <Ring isSmall={isCompactRing} />
        </View>

        <DateSelector style={styles.dateSelector} onDateChange={setSelectedDate} />

        <FlatList
          style={styles.FlatList}
          data={filteredDishes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
          <MenuItem
            id={item.id}
            name={item.name}
            kcal={item.kcal}
            protein={item.protein}
            fat={item.fat}
            carbs={item.carbs}
            image={{ uri: item.image }}
            onPress={() => openEditModal(item)}
            onDelete={() => handleDelete(item.id)}
            onSettingsConfirm={handleConfirmEdit}
          />
          )}
          contentContainerStyle={styles.listContent}
        />

        <Modal visible={isModalVisible} transparent animationType="slide">
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalBackground}>
              <View style={styles.modalContent}>
                {selectedDish && (
                  <SettingsModalContent
                    cardId={selectedDish.id}
                    dishName={selectedDish.name}
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
    padding: width * 0.01,
    backgroundColor: '#F1F3F6',
  },
  topBlock: {
    aspectRatio: 1,
    borderRadius: 20,
    marginBottom: 4,
    paddingHorizontal: 8,
  },
  dateSelector: {
    marginTop: 12,
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
