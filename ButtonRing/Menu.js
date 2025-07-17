import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle, Defs, LinearGradient, Stop, Mask, Pattern, Rect, Line, G, Path, ClipPath } from 'react-native-svg';
import { SettingsModalContent } from "./SettingsModalContent"
import { TrashModalContent } from "./TrashModalContent"


export default function MenuItem({ id, name, kcal, protein, fat, carbs, image, onDelete, onSettingsConfirm, date_act }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState(''); 

  const onPressSettings = () => {
    setModalType('settings');
    setModalVisible(true);
  };

  const onPressTrash = () => {
    setModalType('delete');
    setModalVisible(true);
  };

  const macroGrams = { protein: 100, fat: 100, carb: 100 };

  const screenWidth = Dimensions.get('window').width;
  const imageSectionWidth = 92 + 14;
  const availableWidth = screenWidth - imageSectionWidth - 24;
  const barWidth = ((availableWidth - 2 * 12) / 3) - 8;


  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleConfirmDelete = (cardId) => {
    handleCloseModal();
    onDelete && onDelete(cardId);
  };


  const handleSettingsAction = () => {
    handleCloseModal();
    if (onSettingsConfirm) {
      onSettingsConfirm(); 
    }
  };

  return (
    <View style={styles.dishes}>
      <View style={styles.TopPanel}>
        <View style={{ flex: 1 }}>
          <Text style={styles.text}>{name}</Text>
          <Text style={styles.kcal}>{kcal} ккал</Text>
        </View>

        <View style={styles.icons}>
          <TouchableOpacity style={styles.iconButton} onPress={onPressSettings}>
            <Ionicons name="options-outline" size={24} color="#1D1D1D" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={onPressTrash}>
            <Ionicons name="trash-outline" size={24} color="#1D1D1D" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        marginLeft: 10
      }}>
        <MacroProgressBar label="Б" value={protein} max={macroGrams.protein} type="protein" width={barWidth} />
        <MacroProgressBar label="Ж" value={fat} max={macroGrams.fat} type="fat" width={barWidth} />
        <MacroProgressBar label="У" value={carbs} max={macroGrams.carb} type="carb" width={barWidth} />
      </View>

      <View style={styles.BottomPanel}>
        <View style={styles.imageWrapper}>
          <Image
            source={image}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
      </View>
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCloseModal}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.4)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
        }}>
          <View style={{
            backgroundColor: 'white',
            borderRadius: 20,
            padding: 20,
            width: '100%',
            maxWidth: 320
          }}>
            {modalType === 'settings' && (
              <SettingsModalContent
                onClose={handleCloseModal}
                onConfirm={handleSettingsAction}
                cardId={id}
                dishName={name}
              />
            )}
            {modalType === 'delete' && (
              <TrashModalContent 
              onClose={handleCloseModal} 
              onConfirm={handleConfirmDelete}
              cardId={id}
              dishName={name}
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}


const MacroProgressBar = ({ label, value, max, type, width }) => {
  const progress = Math.min(value / max, 1);

  return (
    <View style={{ alignItems: 'center', width, marginHorizontal: 6 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', width, paddingHorizontal: 5 }}>
        <Text style={{ color: '#C8D0DC', fontSize: 12, fontWeight: "400" }}>{label}</Text>
        <Text style={{ color: '#0046F8', fontSize: 12, fontWeight: "500" }}>{value}</Text>
      </View>

      <Svg height="47" width={width} style={{ marginTop: 4 }}>
        <Defs>
          <Pattern id="diagonalLines" patternUnits="userSpaceOnUse" width="6" height="6">
            <Path d="M0,0 L6,6" stroke="white" strokeWidth="1.5" />
            <Path d="M-3,3 L3,9" stroke="white" strokeWidth="1.5" />
          </Pattern>

          <Pattern id="plus" patternUnits="userSpaceOnUse" width="6" height="6">
            <Line x1="1" y1="3" x2="5" y2="3" stroke="white" strokeWidth="1.2" />
            <Line x1="3" y1="1" x2="3" y2="5" stroke="white" strokeWidth="1.2" />
          </Pattern>

          <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#0046F8" />
            <Stop offset="1" stopColor="white" />
          </LinearGradient>

        <ClipPath id="roundedTop">
          <Path
            d={`
              M0,${47 - 47 * progress + 15}
              A15,15 0 0 1 15,${47 - 47 * progress}
              H${width - 15}
              A15,15 0 0 1 ${width},${47 - 47 * progress + 15}
              V47
              H0
              Z
            `}
          />
        </ClipPath>

        </Defs>

        <Svg height="47" width={width}>
        <Path
          d={`
            M0,15
            A15,15 0 0 1 15,0
            H${width - 15}
            A15,15 0 0 1 ${width},15
            V47
            H0
            Z
          `}
          fill="#F1F3F6"
        />
        </Svg>

      <G clipPath="url(#roundedTop)">
        <Rect
          x="0"
          y={47 - 47 * progress}
          width={width}
          height={47 * progress}
          fill="#0046F8"
        />
        <Rect
          x="0"
          y={47 - 47 * progress}
          width={width}
          height={47 * progress}
          fill={
            type === 'protein'
              ? 'url(#diagonalLines)'
              : type === 'fat'
                ? 'url(#plus)'
                : 'url(#grad)'
          }
        />
      </G>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  dishes: {
    height: 146,
    marginTop: 12,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    overflow: "hidden"
  },
  TopPanel: {
    flexDirection: "row",
    padding: 12
  },
  BottomPanel: {
    flexDirection: "row",
    alignItems: "center"
  },
  image: {
    width: 92,
    height: 50,
    borderRadius: 10
  },
  icons: {
    flexDirection: "row"
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 30,
    backgroundColor: '#F1F3F6',
    alignItems: "center",
    justifyContent: "center",
    margin: 4
  },
  text: {
    fontSize: 16,
    fontWeight: "400",
    color: "#000000"
  },
  kcal: {
    fontSize: 14,
    fontWeight: "400",
    color: "#C8D0DC",
    marginTop: 3
  },
  imageWrapper: {
    alignItems: "flex-end",
    flex: 1,
    marginRight: 8,
    marginTop: 10
  }
});


