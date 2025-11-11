import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Guide } from '../components';
import { TouchableOpacity, View, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function GuideScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.arrow}>←</Text>
      </TouchableOpacity>

      <Guide />
    </GestureHandlerRootView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#131313ff',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 35,
    height: 35,
    backgroundColor: '#fff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  arrow: {
    fontSize: 24,
    color: '#000',
    fontWeight: 'bold',
  },
});