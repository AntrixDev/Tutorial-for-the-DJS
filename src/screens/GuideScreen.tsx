import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Guide } from '../components';
import { View, StyleSheet, ImageBackground, } from 'react-native';
import BackButton from '../components/BackButton';

export default function GuideScreen() {

  return (
    <View style={styles.container}>
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ImageBackground source={require('../assets/guide/GuideBckg.png')} style={{flex: 1}}>
        <BackButton />
      </ImageBackground>
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
});