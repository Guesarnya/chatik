import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainScreen from './GlobalMonit/MainScreen';
import Chat from './Chat/Chat'; 
import MainScreenRing from './ButtonRing/MainScreenRing';
import { MacroProvider } from './AllBackEnd/MacroContext'; 
import TestyAndHealthy from './GlobalMonit/TestyAndHealthy';
import ButtonBiometry from './InGLobalMonit/ButtonBiometry'
import { TabProvider } from './AllBackEnd/TabContext';
import { enableScreens } from 'react-native-screens';
import ImagePreviewScreen from './Chat/ImagePreviewScreen';
import LogIn from './GlobalMonit/LogIn';
import Register from './GlobalMonit/Register';
import RedactModalContent from "./Chat/RedactModalContent"

enableScreens();

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <MacroProvider>
      <TabProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="MainScreen"
            screenOptions={{
              headerShown: false,
              animation: 'none',
            }}
          >
            <Stack.Screen name = "LogIn" component={LogIn} />
            <Stack.Screen name="MainScreen" component={MainScreen} />
            <Stack.Screen name="Chat" component={Chat} />
            <Stack.Screen name="MainScreenRing" component={MainScreenRing} />
            <Stack.Screen name="TestyAndHealthy" component={TestyAndHealthy} />
            <Stack.Screen name="ButtonBiometry" component={ButtonBiometry} />
            <Stack.Screen name='ImagePreview' component={ImagePreviewScreen}/>
            <Stack.Screen name='Register' component={Register}/>
            <Stack.Screen name='RedactModalContent' component={RedactModalContent}/>
          </Stack.Navigator>
        </NavigationContainer>
      </TabProvider>
    </MacroProvider>
  );
}

