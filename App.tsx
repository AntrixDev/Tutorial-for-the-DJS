import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Tarot } from './src'; // Adjust path if your src folder is elsewhere

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Tarot />
    </GestureHandlerRootView>
  );
}