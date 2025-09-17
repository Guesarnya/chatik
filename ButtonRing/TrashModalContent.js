import React, { useState, forwardRef, useRef } from 'react';
import { View, Text, Button , Dimensions, StyleSheet, TextInput, TouchableOpacity, Alert} from 'react-native';
const { width, height } = Dimensions.get("window")

export const TrashModalContent = ({ onClose, onConfirm, cardId, dishName}) => {

  return (
    <View style={styles.container}>
      <View style = {styles.topBlock}>
        <Text style={styles.mainDeleteLabel}>Вы уверены?</Text>
        <Text style={styles.name}>Удалить "{dishName}"</Text>
      </View>


      <View style={styles.buttonRow}>
      <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
        <Text style={styles.buttonText}>Отменить</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, styles.cancelButton]} 
        onPress={() => onConfirm(cardId)}
      >
        <Text style={styles.buttonText}>Удалить</Text>
      </TouchableOpacity>

      </View>


    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    height: height * 0.18
  },

  topBlock: {
    padding: 2
  },

  mainDeleteLabel:{
    fontSize: 24,
    fontWeight: "400"
  },

  name:{
    marginTop: 20
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: "auto", 
    gap: 12, 
    paddingHorizontal: 10,
    paddingBottom: 10
  },

  button: {
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10
  },

  cancelButton: {
    backgroundColor: "white"
  },

  buttonText: {
    color: "black",
    fontSize: 14,
    fontWeight: "500"
  }
});
