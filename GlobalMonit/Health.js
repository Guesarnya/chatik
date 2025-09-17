import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Svg, {
  Defs,
  LinearGradient,
  Stop,
  Rect,
} from 'react-native-svg';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { height: screenHeight } = Dimensions.get('window');

export default function Health() {
  const navigation = useNavigation();

  const handleSearch = () => {
    console.log('Здоровье вопрос');
  };

  const clearStorage = async () => {
    try {
      await AsyncStorage.clear();
      console.log('AsyncStorage успешно очищен!');
    } catch (e) {
      console.error('Ошибка при очистке AsyncStorage:', e);
    }
  };

  const handleHealthPress = () => {
    console.log('Здоровье');
    clearStorage()
  };

  const getPatternFill = () => 'url(#grad)';


  const baseHeight = 129;
  const totalHeight = screenHeight < 900 ? baseHeight * 0.76 : baseHeight;

  const progress = 76;
  const filledHeight = (progress / 100) * totalHeight;

  return (
    <TouchableOpacity style={styles.button} onPress={handleHealthPress}>
      <View style={styles.container}>

        <View style={styles.topRow}>
          <Text style={styles.healthLabel}>Здоровье</Text>
          <TouchableOpacity style={styles.questionButton} onPress={handleSearch}>
            <Ionicons name="help-circle-outline" size={32} color="#C8D0DC" />
          </TouchableOpacity>
        </View>

        <View style={styles.progressRow}>
          <View style={styles.leftBottomText}>
            <Text style={styles.points}>76</Text>
            <Text style={styles.precents}>%</Text>
          </View>
          <View style={[styles.progressContainer, { height: totalHeight }]}>
            <Svg height={totalHeight} width="26">
              <Defs>
                <LinearGradient id="grad" x1="0" y1="1" x2="0" y2="0">
                  <Stop offset="0" stopColor="#628EFF" />
                  <Stop offset="1" stopColor="#0046F8" />
                </LinearGradient>
              </Defs>

              {/* Серый фон */}
              <Rect x="0" y="0" width="26" height={totalHeight} rx="10" fill="#F1F3F6" />

              {/* Прогресс */}
              <Rect
                x="0"
                y={totalHeight - filledHeight}
                width="26"
                height={filledHeight}
                rx="10"
                fill={getPatternFill()}
              />
            </Svg>
          </View>
        </View>

      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    borderRadius: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  healthLabel: {
    fontSize: 16,
    fontWeight: '400',
    color: '#8E98A6',
    marginTop: -14
  },
  questionButton: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  progressRow: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    position: 'relative',
  },
  leftBottomText: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  points: {
    fontSize: 41,
    fontWeight: '500',
    color: '#0046F8',
    marginRight: 3,
  },
  precents: {
    fontSize: 20,
    color: "#CFD6E0",
    marginBottom: 20
  },
  progressContainer: {
    width: 26,
    backgroundColor: '#F1F3F6',
    borderRadius: 10,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
});
