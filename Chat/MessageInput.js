import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';

export default function MessageInput() {
  const [message, setMessage] = useState('');
  const [inputHeight, setInputHeight] = useState(50);

  const handleSend = () => {
    console.log("KUKU EPTA:", message);
    setMessage('');
    setInputHeight(50); 
  };

  return (
    <View style={styles.container}>
      <View style={styles.containerInput}>
        <View style={[styles.inputWrapper]}>
          <TextInput
            style={[styles.input, { height: inputHeight }]}
            placeholder="Написать сообщение..."
            placeholderTextColor="#C8D0DC"
            value={message}
            onChangeText={setMessage}
            multiline
            onContentSizeChange={(event) => {
              const newHeight = event.nativeEvent.contentSize.height;
              const clampedHeight = Math.min(Math.max(newHeight, 50), 120);
              setInputHeight(clampedHeight);
            }}
          />
        </View>
        <TouchableOpacity
          onPress={handleSend}
          disabled={!message.trim()}
          style={styles.ButtonSend}
        >
          <Ionicons
            name='arrow-forward'
            size={24}
            color={message.trim() ? "#FFFFFF" : "#959195"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    paddingVertical: 8,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    justifyContent: "center"
  },
  containerInput: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    paddingHorizontal: 12
  },
  ButtonSend: {
    width: 50,
    height: 50,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20,
    backgroundColor: "black"
  },
  inputWrapper: {
    backgroundColor: "#F1F3F6",
    width: "80%",
    borderRadius: 28,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  input: {
    fontSize: 16,
    fontWeight: '400',
    width: '100%',
    textAlignVertical: 'top',
    paddingVertical: 13,
  },
});
