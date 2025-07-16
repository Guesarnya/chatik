import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Stop,
  Mask,
  Pattern,
  Rect,
  Line,
  G,
  Path,
  ClipPath
} from 'react-native-svg';
import * as d3 from 'd3-shape';
import { useNavigation } from '@react-navigation/native';
import { useMacro } from '../AllBackEnd/MacroContext';

export default function FirstRing({ isSmall = false }) {


  
  const { macros, setMacros } = useMacro();
  const { protein, fat, carbs, target } = macros;


  
  const navigation = useNavigation();
  const handleSendRing = () => {
    navigation.navigate('MainScreenRing');
  }


  const calories = protein * 4 + fat * 9 + carbs * 4;

  const ringSize = isSmall ? 150 : 180;
  const radius = isSmall ? 60 : 80;
  const strokeWidth = isSmall ? 20 : 30;
  const fontSizeCalories = isSmall ? 24 : 41;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const progress = target > 0 ? Math.min(calories / target, 1) : 0;
  const totalAngle = 2 * Math.PI * progress;
  const strokeDashoffset = circumference - progress * circumference;


  const total = protein + fat + carbs;

  const data = [];

  if (total > 0) {
    data.push({
      value: (carbs / total) * 2 * Math.PI,
      fill: "url(#grad)",
    });

    data.push({
      value: (protein / total) * 2 * Math.PI,
      fill: "url(#diagonalStripes)",
    });

    data.push({
      value: (fat / total) * 2 * Math.PI,
      fill: "url(#plusPattern)",
    });
  } else {
    // если всё по нулям — показываем пустой круг
    data.push({
      value: 2 * Math.PI,
      fill: "#1E3A8A",
    });
  }





  const macroTargets = {
    protein: target * 0.3,
    fat: target * 0.3,
    carb: target * 0.40
  };


  const macroGrams = {
    protein: macroTargets.protein / 4,
    fat: macroTargets.fat / 9,
    carb: macroTargets.carb / 4
  };



  return (
    <TouchableOpacity style = {styles.TouchableOpacityScreen} onPress={handleSendRing}>
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.caloriesValue}>{calories}</Text>
          <Text style={styles.caloriesLabel}>Калорий</Text>
        </View>
        <TouchableOpacity style={styles.arrowButton} onPress={handleSendRing}>
          <Ionicons name="chevron-forward" size={24} color="#0046F8" />
        </TouchableOpacity>
      </View>

      <View style={styles.ringWrapper}>
      <Svg height={ringSize} width={ringSize}>
        <Defs>

      <Pattern
        id="diagonalStripes"
        patternUnits="userSpaceOnUse"
        width="6"
        height="6"
      >
        {/* Первая диагональная линия */}
        <Path
          d="M0,0 L6,6"
          stroke="white"
          strokeWidth="1.5"
          shapeRendering="crispEdges"
        />

        {/* Вторая диагональная линия — смещена внутрь клетки */}
        <Path
          d="M-3,3 L3,9"
          stroke="white"
          strokeWidth="1.5"
          shapeRendering="crispEdges"
        />
      </Pattern>
          {/* Plus */}
          <Pattern
            id="plusPattern"
            patternUnits="userSpaceOnUse"
            width="6"
            height="6"

          >
            {/* Горизонтальная линия */}
            <Line x1="1" y1="3" x2="5" y2="3" stroke="white" strokeWidth="1.2" />

            {/* Вертикальная линия */}
            <Line x1="3" y1="1" x2="3" y2="5" stroke="white" strokeWidth="1.2" />
          </Pattern>


          {/* Градиент */}
          <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor="#0046F8" />
            <Stop offset="0.55" stopColor="white" />
            <Stop offset="1" stopColor="white" />
          </LinearGradient>

        </Defs>
          <G x={ringSize / 2} y={ringSize / 2}>
            {
              (() => {
                const d3 = require('d3-shape');
                const arcGenerator = d3.arc()
                  .innerRadius(normalizedRadius - strokeWidth / 2)
                  .outerRadius(normalizedRadius + strokeWidth / 2)
                  .cornerRadius(6);

                let startAngle = 0;
                const gapAngle = 0.06; 

                return data.map((slice, index) => {
                  const endAngle = startAngle + slice.value - gapAngle;
                  const path = arcGenerator({
                    startAngle,
                    endAngle,
                  });
                  startAngle = endAngle + gapAngle;

                  return (
                    <Path
                      key={index}
                      d={path}
                      fill={slice.fill}
                    />
                  );
                });
              })()
            }
          </G>
      </Svg>
      </View>
      <View style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-around',
      }}>

      <MacroProgressBar label="Белки" value={protein} max={macroGrams.protein} type="protein" />
      <MacroProgressBar label="Жиры" value={fat} max={macroGrams.fat} type="fat" />
      <MacroProgressBar label="Углеводы" value={carbs} max={macroGrams.carb} type="carb" />

      </View>
    </View>
    </TouchableOpacity>
  );
}


{/* ------------------------------------------------------------------Нижние линии белки жиры углеводы-------------------------------------------------------------------- */}
const MacroProgressBar = ({ label, value, max, type }) => {
  const progress = Math.min(value / max, 1);
  const barWidth = 100 * progress;

  const getPatternFill = () => {
    if (type === 'protein') return 'url(#diagonalLines)';
    if (type === 'fat') return 'url(#plus)';
    if (type === 'carb') return 'url(#grad)';
    return 'white';
  };

  return (
    <View style={{ alignItems: 'center'}}>
      <Text style={{ color: 'white', fontSize: 12 }}>
        {label} <Text style={{ color: '#88B0FF' }}>{value}</Text>
      </Text>
      <Svg height="25" width="100" style={{ marginTop: 4 }}>
        <Defs>
          {/* Диагональные линии */}
          <Pattern id="diagonalLines" patternUnits="userSpaceOnUse" width="6" height="6">

            <Path 
            d="M0,0 L6,6" 
            stroke="white" 
            strokeWidth="1.5" 
            shapeRendering="crispEdges" />
            <Path 
            d="M-3,3 L3,9" 
            stroke="white" 
            strokeWidth="1.5" 
            shapeRendering="crispEdges" />
          </Pattern>

          {/* Plus */}
          <Pattern id="plus" patternUnits="userSpaceOnUse" width="6" height="6">

            <Line x1="1" y1="3" x2="5" y2="3" stroke="white" strokeWidth="1.2" />

            <Line x1="3" y1="1" x2="3" y2="5" stroke="white" strokeWidth="1.2" />

          </Pattern>

          {/* Градиент */}
          <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor="#0046F8" />
            <Stop offset="1" stopColor="white" />
          </LinearGradient>

          {/* Clip path — чтобы паттерн не выходил за рамку */}
          <ClipPath id="roundedClip">
            <Rect x="0" y="0" width="100" height="25" rx="15" ry="15" />
          </ClipPath>
        </Defs>

        {/* Серый фон */}
        <Rect x="0" y="0" width="100" height="25" rx="15" fill="#2C66F8" />

        {/* Прогресс с клипом */}
        <G clipPath="url(#roundedClip)">
          <Rect
            x="0"
            y="0"
            width={barWidth}
            height="25"
            rx="15"
            fill={getPatternFill()}
          />
        </G>
      </Svg>
    </View>
  );
};


{/* ------------------------------------------------------------------Стили-------------------------------------------------------------------- */}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0046F8',
    borderRadius: 20,
    padding: 20,
    justifyContent: 'flex-start',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  caloriesValue: {
    fontSize: 41,
    color: 'white',
    fontWeight: "500",
  },
  caloriesLabel: {
    color: 'white',
    fontSize: 12,
    marginTop: -8,
    marginLeft: 4,
    fontWeight: "400"
  },
  arrowButton: {
    width: 40,
    height: 40,
    backgroundColor: 'white',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ringWrapper: {
    paddingTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  TouchableOpacityScreen: {
    flex: 1
  }
});