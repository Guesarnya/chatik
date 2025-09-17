import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import DateTimePickerModal from 'react-native-modal-datetime-picker';

export default function DateSelector({ onDateChange }) {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [daysOfWeek, setDaysOfWeek] = useState([]);
  const flatListRef = useRef(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const getCurrentWeek = (dateRef = new Date()) => {
    const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    const currentDay = dateRef.getDay();

    const monday = new Date(dateRef);
    monday.setDate(dateRef.getDate() - ((currentDay + 6) % 7));

    const week = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      week.push({
        day: days[date.getDay()],
        date: date.getDate(),
        month: date.getMonth(),
        year: date.getFullYear(),
      });
    }
    return week;
  };

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirm = (date) => {
    hideDatePicker();

    const week = getCurrentWeek(date);


    const todayIndex = week.findIndex(
      (item) =>
        item.date === date.getDate() &&
        item.month === date.getMonth() &&
        item.year === date.getFullYear()
    );


    const indices = [...Array(week.length).keys()];
    const randomTwo = indices.sort(() => 0.5 - Math.random()).slice(0, 2);

    const withWeekendFlags = week.map((item, index) => ({
      ...item,
      isWeekend: randomTwo.includes(index),
    }));

    setDaysOfWeek(withWeekendFlags);
    setSelectedIndex(todayIndex);


    const formattedDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
      .toISOString()
      .split('T')[0];
    setSelectedDate(formattedDate);


    if (onDateChange) {
      onDateChange(formattedDate);
    }

    console.log('Выбранная дата:', formattedDate);

    if (todayIndex !== -1) {
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({ index: todayIndex, animated: true });
      }, 100);
    }
  };



  useEffect(() => {
    const generatedWeek = getCurrentWeek();

    const indices = [...Array(generatedWeek.length).keys()];
    const randomTwo = indices.sort(() => 0.5 - Math.random()).slice(0, 2);

    const withWeekendFlags = generatedWeek.map((item, index) => ({
      ...item,
      isWeekend: randomTwo.includes(index),
    }));

    setDaysOfWeek(withWeekendFlags);

    const today = new Date();
    const todayIndex = generatedWeek.findIndex(
      (item) =>
        item.date === today.getDate() &&
        item.month === today.getMonth() &&
        item.year === today.getFullYear()
    );

    setSelectedIndex(todayIndex);

    if (todayIndex !== -1) {
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({ index: todayIndex, animated: false });
      }, 100);
    }
  }, []);

  const handleDayPress = (index, item) => {
    setSelectedIndex(index);

    const formattedDate = new Date(Date.UTC(item.year, item.month, item.date)).toISOString().split('T')[0];
    setSelectedDate(formattedDate);

    if (onDateChange) {
      onDateChange(formattedDate);
    }

    console.log('Выбранная дата при нажатии на кнопку:', formattedDate);
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.roundedContainer}>
        <FlatList
          ref={flatListRef}
          horizontal
          data={daysOfWeek}
          keyExtractor={(_, index) => index.toString()}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          renderItem={({ item, index }) => {
            const selected = index === selectedIndex;
            const isWeekend = item.isWeekend;



            return (
              <TouchableOpacity
                style={[styles.buttonContainer, selected && styles.selectedButtonContainer]}
                onPress={() => handleDayPress(index, item)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.dayText,
                    isWeekend && styles.weekendDayText,
                    selected && styles.selectedDayText,
                  ]}
                >
                  {item.day}
                </Text>
                <View style={[styles.circle, selected && styles.selectedCircle]}>
                  <Text
                    style={[
                      styles.dateText,
                      isWeekend && styles.weekendDateText,
                      selected && (isWeekend ? styles.selectedWeekendDateText : styles.selectedDateText),
                    ]}
                  >
                    {item.date}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />

        <TouchableOpacity style={styles.calendarButton} onPress={showDatePicker}>
          <Ionicons name="calendar-outline" size={24} color="#0046F8" />
        </TouchableOpacity>
      </View>


      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        locale="ru-RU"
        headerTextIOS="Выберите дату"
        cancelTextIOS="Отмена"
        confirmTextIOS="Выбрать"
        themeVariant="light"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    paddingTop: 10,

  },

  roundedContainer: {
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#F1F3F6',
    marginRight: -4,
    flexDirection: "row"
  },

  listContent: {
  },
  buttonContainer: {
    width: 50,
    height: 70,
    borderRadius: 70,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,

  },
  selectedButtonContainer: {
    backgroundColor: '#0046F8',
  },
  dayText: {
    color: 'black',
    marginBottom: 5,
    fontSize: 12,
  },
  weekendDayText: {
    color: '#A1A1A1',
  },
  selectedDayText: {
    color: 'white',
  },
  circle: {
    width: 34,
    height: 34,
    borderRadius: 60,
    backgroundColor: '#F1F3F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCircle: {
    backgroundColor: '#FFFFFF',
  },
  dateText: {
    color: 'black',
    fontSize: 12,
  },
  weekendDateText: {
    color: '#FFFFFF',
  },
  selectedDateText: {
    color: '#0046F8',
    fontWeight: '400',
  },
  selectedWeekendDateText: {
    color: '#0046F8',
    fontWeight: '400',
  },
  calendarButton: {
    width: 49,
    height: 70,
    borderRadius: 70,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 2,
    marginRight: 12,
  },
});
