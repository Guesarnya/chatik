import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ring from './Ring';
import DateSelector from './Date';
import MenuItem from './Menu';
import dishes from '../AllBackEnd/Dishes';
import React, { useState, useMemo } from 'react';

const { width, height } = Dimensions.get('window');

const MainScreenRing = () => {

  const isCompactRing = useMemo(() => width < 360 || height < 640, []);


  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.topBlock}>
          <Ring isSmall = {isCompactRing} />
        </View>
        <DateSelector style={styles.dateSelector} />
        <FlatList
          style = {styles.FlatList}
          data={dishes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MenuItem
              name={item.name}
              kcal={item.kcal}
              protein={item.protein}
              fat={item.fat}
              carbs={item.carbs}
              image={item.image}
            />
          )}
          contentContainerStyle={styles.listContent}
        />
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
    paddingHorizontal: 8
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
  }
});
