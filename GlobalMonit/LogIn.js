import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, TextInput, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Register from './Register';

const { height, width } = Dimensions.get('window');

export default function LogIn({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [KeyboardVisible, setKeyboardVisible] = useState(false);

  const handleLogin = () => {
    if (email && password) {
      console.log('Logging in with:', email, password);
    } else {
      alert('Пожалуйста, заполните все поля');
    }
  };
  const handleRegister = () => {
    navigation.navigate("Register");
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={styles.TopBlock}>
            <View style={styles.LoginContainer}>
              <Text style={styles.header}>Вход в аккаунт</Text>

              <TextInput
                style={styles.Input}
                placeholder='Логин или Email'
                value={email}
                onChangeText={setEmail}
                keyboardType='email-address'
                selectionColor="#0046F8"
              />

              <TextInput
                style={styles.Input}
                placeholder='Пароль'
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
                selectionColor="#0046F8"
              />

              <TouchableOpacity style={styles.Enter} onPress={handleLogin}>
                <Text style={styles.EnterText}>Войти</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Забыли пароль?</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      {/* Нижний блок вынесен за пределы KeyboardAvoidingView */}
      <View style={styles.BottomBlock}>
        <View style={styles.create}>
          <View style={styles.containerNewAcc}>
            <Text style={styles.newAccText1}>Еще не зарегестрировались?</Text>
          </View>

          <TouchableOpacity style={styles.createButton} onPress={handleRegister}>
            <Text style={styles.newAccText}>Создать новый аккаунт</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },

  safe: {
    flex: 1,
  },

  TopBlock: {
    flex: 1,
  },

  BottomBlock: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 50,
  },

  createButton: {
    borderColor: 'black',
    alignItems: "center",
    justifyContent: "center",
  },

  containerNewAcc: {
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  newAccText: {
    fontSize: 16,
    fontWeight: '400',
    color: "#0046F8",
  },

  newAccText1: {
    fontSize: 16,
    fontWeight: '400',
  },

  forgotPasswordText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '400',
    color: "#0046F8",
  },

  Input: {
    width: width * 0.9,
    height: height * 0.06,
    borderWidth: 2,
    margin: 10,
    borderRadius: 20,
    borderColor: '#0046F8',
    paddingLeft: 20,
    textDecorationLine: 'none',
    backgroundColor: "white",
  },

  LoginContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    flex: 1,
  },

  header: {
    padding: 20,
    fontSize: 24,
    fontWeight: '500',
  },

  Enter: {
    width: width * 0.9,
    height: height * 0.06,
    margin: 10,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0046F8',
  },

  EnterText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
  },
});
