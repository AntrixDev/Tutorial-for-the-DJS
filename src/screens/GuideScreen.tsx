import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Guide } from '../components';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Guide />
    </GestureHandlerRootView>
  );
}