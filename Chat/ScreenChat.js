import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import HeaderChat from './HeaderChat';
import MessageInput from './MessageInput';
import BottomNavigation from './BottomNavigation';

export default function ScreenChat() {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', (event) => {
      setKeyboardHeight(event.endCoordinates.height);
      setKeyboardVisible(true); 
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
      setKeyboardVisible(false); 
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  console.log({ keyboardHeight, keyboardVisible });

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <HeaderChat />

        <View style={styles.content} />

        {Platform.OS === 'ios' ? (
          <KeyboardAvoidingView
            behavior="padding"
            keyboardVerticalOffset={0}
          >
            <MessageInput />
          </KeyboardAvoidingView>
        ) : (
          <View
            style={[
              styles.AndroidInput,
              keyboardVisible && { marginBottom: keyboardHeight - 83 },
            ]}
          >
            <MessageInput />
          </View>
        )}

        <BottomNavigation />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F3F6',
  },
  content: {
    flex: 1,
    borderWidth: 3,
  },
  AndroidInput: {
    // твои базовые стили
  },
});
