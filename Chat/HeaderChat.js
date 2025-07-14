import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
const { height, width } = Dimensions.get('window');


export default function HeaderChat() {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>FoodMood</Text>
    </View>
  );
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: "white",
        height: height * 0.1,
    },

    title: {
        fontSize: 18,
        fontWeight: "500",
        paddingTop: height * 0.055,
        paddingLeft: 12,
        color: "#44506D"
    }
});
