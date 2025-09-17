import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, Modal } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { SettingsModalContent } from "./SettingsModalContent"
import { TrashModalContent } from "./TrashModalContent"

const { width, height } = Dimensions.get("window")

export default function MenuItem({ id, name, kcal, protein, fat, carbs, image, onDelete, onSettingsConfirm, date_act, currentDish }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('');


  const [prot, setProt] = useState(protein)


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


      <View style={styles.BJU}>
        <View style={styles.bjuItem}>
          <Text style={styles.bjuTitle}>Белок</Text>
          <View style={styles.blocks}>
            <Text style={styles.BJULabel}>{protein}</Text>
          </View>
        </View>

        <View style={styles.bjuItem}>
          <Text style={styles.bjuTitle}>Жиры</Text>
          <View style={styles.blocks}>
            <Text style={styles.BJULabel}>{fat}</Text>
          </View>
        </View>

        <View style={styles.bjuItem}>
          <Text style={styles.bjuTitle}>Углев</Text>
          <View style={styles.blocks}>
            <Text style={styles.BJULabel}>{carbs}</Text>
          </View>
        </View>
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
            maxWidth: 320,
          }}>
            {modalType === 'settings' && (
              <SettingsModalContent
                onClose={handleCloseModal}
                onConfirm={handleSettingsAction}
                cardId={id}
                dishName={name}
                currentDish={currentDish}
                protein={protein}
                calories={kcal}
                fat={fat}
                carbs={carbs}
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


const styles = StyleSheet.create({

  dishes: {
    width: width - 36,
    alignSelf: "center",
    height: 146,
    marginTop: 12,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    overflow: "hidden"
  },




  BJU: {
    flexDirection: "row",
    position: "absolute",
    bottom: 12,
    left: 10
  },


  bjuTitle: {
    fontSize: 12,
    color: "#616366ff",
    marginBottom: 4,
    marginLeft: 14
  },

  BJULabel: {
    fontSize: 16,
    fontWeight: "400",
    color: "#000000"
  },

  blocks: {
    height: 38,
    width: width * 0.17,
    marginLeft: 10,
    borderRadius: 12,
    backgroundColor: "#F1F3F6",
    alignItems: "center",
    justifyContent: "center"
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
    fontSize: 20,
    fontWeight: "400",
    color: "#010101",
    marginTop: 3
  },
  imageWrapper: {
    alignItems: "flex-end",
    flex: 1,
    marginRight: 8,
    marginTop: 10
  }
});


