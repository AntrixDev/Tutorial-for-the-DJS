import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function BackButton() {
  const navigation = useNavigation<any>();

  return (
    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
      <Text style={styles.arrow}>⤶</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    top: 25,
    left: 25,
    width: 50,
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    borderWidth: 4,
    borderColor: '#000',
  },
  arrow: {
    fontSize: 30,
    color: '#000',
    fontWeight: 'bold',
  },
});