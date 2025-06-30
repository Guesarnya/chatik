import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // или другой икон-пакет, если не используешь Expo
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native'; // 👈 Добавить

export default function Biometry() {
  const handleSend = () => {
    console.log('Настройки');
  };

  const kilo = 80

  const handleSendKilo = () => {
    console.log(kilo+" КГ")
  }
  
  const handleSendDieta = () => {
    console.log("Худею")
  }

  const handleSendAktive = () => {
    console.log("Активный")
  }

  const navigation = useNavigation();

  const handleBiomerty = () => {
    navigation.navigate('ButtonBiometry'); 
  };




  return (
    <TouchableOpacity style = {styles.TouchableOpacity} onPress={handleBiomerty}>
    <SafeAreaProvider>
        <View style={styles.container}>
        {/* Верхний блок: калории и кнопка */}
        <View style={styles.header} >
            <View>
            <Text style={styles.BiometryLabel}>Биометрия</Text>
            </View>

            <TouchableOpacity 
            style={styles.QuestionButton}
            onPress={handleSend}>
            <Ionicons 
            name="settings-outline" 
            size={27} 
            color={"#C8D0DC"} 
            />
            </TouchableOpacity>
        </View>
        <View style={styles.BottomButtons}>
        <TouchableOpacity style={styles.kilo} onPress={handleSendKilo}>
          <View style = {styles.FirstButtonText}>
            <Text style={styles.textKilo}>{kilo}</Text>
            <Text style={styles.KG}>КГ</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.kilo} onPress={handleSendDieta}>
          <View style = {styles.FirstButtonText}>
            <Text style={styles.textKilo}>Худею</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.kilo} onPress={handleSendAktive}>
          <View style = {styles.FirstButtonText}>
            <Text style={styles.textKilo}>Активный</Text>
          </View>
        </TouchableOpacity>
        </View>
        </View>

    </SafeAreaProvider>
    </TouchableOpacity>
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

  TouchableOpacity: {
    flex: 1
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  BiometryLabel: {
    marginTop: -15,
    fontWeight: "400",
    fontSize: 16,
    color: "#8E98A6"
  },

  QuestionButton: {
    width: 32,
    height: 32,
    backgroundColor: 'white',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -10,
  },

  BottomButtons: {
    flex: 1,
    borderRadius: 20,
    alignItems: 'center',  
    justifyContent: "flex-end"
  },

  FirstButtonText: {
    alignItems: "center",
    flexDirection: "row",
  },

  kilo: {
    backgroundColor: '#0046F8',
    borderRadius: 10,
    paddingVertical: 10,
    width: '100%',
    alignItems: 'center',
    marginTop: 4,
  },


  textKilo: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
    marginRight: 6,
  },

  KG: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
  },
});
