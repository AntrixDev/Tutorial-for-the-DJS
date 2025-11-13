import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
// import { Audio } from 'expo-audio';

export default function GameScreen({ route }) {
  const { mp3 } = route.params;

  return (
    <View style={styles.container}>
      {mp3 ? <Text style={styles.text}>Yes</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#000000ff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});
