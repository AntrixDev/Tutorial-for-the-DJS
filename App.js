import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MenuScreen from './src/screens/MenuScreen';
import GuideScreen from './src/screens/GuideScreen';
import SongSelect from './src/screens/SongSelectScreen';
import DescSong from './src/screens/DescSong';
import Game from './src/screens/GameScreen';
import Test from './src/screens/TestScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Menu" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Menu" component={MenuScreen} />
        <Stack.Screen name="Guide" component={GuideScreen} />
        <Stack.Screen name="SongSelect" component={SongSelect} />
        <Stack.Screen name="DescSong" component={DescSong} />
        <Stack.Screen name="Game" component={Game} />
        <Stack.Screen name="Test" component={Test} />
        </Stack.Navigator>
    </NavigationContainer>
    </GestureHandlerRootView>
  );
}
