import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MainScreen from './GlobalMonit/MainScreen';
import Chat from './Chat/Chat'; 
import MainScreenRing from './ButtonRing/MainScreenRing';
import { MacroProvider } from './AllBackEnd/MacroContext'; 
import TestyAndHealthy from './GlobalMonit/TestyAndHealthy';
import ButtonBiometry from './InGLobalMonit/ButtonBiometry'

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <MacroProvider>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Main">
        <Stack.Screen name="Main" component={MainScreen} options={{ headerShown: false , title: "Главный экран"}} />
        <Stack.Screen name="Chat" component={Chat} options={{headerShown: false}} />
        <Stack.Screen name='MainScreenRing' component={MainScreenRing} options={{headerShown: false}}/>
        <Stack.Screen name='TestyAndHealthy' component={TestyAndHealthy} options={{headerShown: false}}/>
        <Stack.Screen name='ButtonBiometry' component={ButtonBiometry} options={{headerShown: false}}/>
      </Stack.Navigator>
    </NavigationContainer>
    </MacroProvider>
  );
}
