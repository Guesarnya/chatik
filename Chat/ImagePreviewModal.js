import React from 'react';
import { Modal, View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
const {width, height} = Dimensions.get("window")


export default function ImagePreviewModal({ visible, imageUri, onSend, onDelete, onClose }) {
  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Image source={{ uri: imageUri }} style={styles.image} />
          <View style={styles.buttons}>
            <TouchableOpacity style={styles.button} onPress={onSend}>
              <Text style={styles.buttonText}>Отправить</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={onDelete}>
              <Text style={styles.buttonText}>Удалить</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={onClose}>
              <Text style={styles.buttonText}>Назад</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#000000AA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 10,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: height * 0.48,
    borderRadius: 10,
    marginBottom: 15,
  },
  buttons: {
    flexDirection: 'column',
    gap: 10,
  },
  button: {
    backgroundColor: '#0046F8',
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
    width: 200,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});
