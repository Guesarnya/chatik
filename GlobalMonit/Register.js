import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';


const { height, width } = Dimensions.get('window');


export default function Register() {


  return (
    <View style = {styles.container}>
        <Text>QWEQWEWQEQWEQWE</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFF',
    borderRadius: 20,
    padding: 20,
    justifyContent: 'flex-start',
  },
});
