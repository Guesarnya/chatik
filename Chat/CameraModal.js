import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Dimensions, TouchableWithoutFeedback, Platform } from 'react-native';

const { width, height } = Dimensions.get("window")

export default function CameraModal({ visible, onClose, onTakePhoto, onPickFromGallery }) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={onTakePhoto} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Сделать снимок</Text>
            </TouchableOpacity>
            <View style={styles.separator} />
            <TouchableOpacity onPress={onPickFromGallery} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Фото из галереи</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },

  modalContent: {
    backgroundColor: '#F2F2F2',
    borderRadius: 20,
    marginBottom: Platform.select({
      ios: 94,
      android: 72
    }),
    width: "90%",
    marginLeft: "5%"
  },

  modalButton: {
    paddingVertical: 22,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 18,
    color: '#0046F8',
    fontWeight: "400"
  },
  separator: {
    height: 1,
    backgroundColor: "#C8D0DC"
  }
});
