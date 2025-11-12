import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MenuScreen from './src/screens/MenuScreen';
import GuideScreen from './src/screens/GuideScreen';
import SongSelect from './src/screens/SongSelectScreen';
import DescSong from './src/screens/DescSong';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Menu" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Menu" component={MenuScreen} />
        <Stack.Screen name="Guide" component={GuideScreen} />
        <Stack.Screen name="SongSelect" component={SongSelect} />
        <Stack.Screen name="DescSong" component={DescSong} />
        </Stack.Navigator>
    </NavigationContainer>
  );
}
