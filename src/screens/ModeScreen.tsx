import React from 'react';
import { View, ImageBackground, TouchableOpacity, Image, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BackButton from '../components/BackButton';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../screenWH';

export default function ModeScreen() {
  const navigation = useNavigation<any>();

  return (
    <ImageBackground
      //source={require('../assets/ui/modeBckg.png')}
      style={styles.bg}
      resizeMode="cover"
    >
      <BackButton />
      <View style={styles.cardRow}>
        <TouchableOpacity
          style={styles.cardWrapper}
          onPress={() => navigation.navigate('Train')}
          activeOpacity={0.9}
        >
          <Image style={styles.cardImage} source={require('../assets/ui/TrainingModeCard.png')} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cardWrapper}
          onPress={() => navigation.navigate('SongSelect')}
          activeOpacity={0.9}
        >
          <Image style={styles.cardImage} source={require('../assets/ui/NormalModeCard.png')} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cardWrapper}
          onPress={() => {}}
          activeOpacity={0.9}
        >
          <Image style={styles.cardImage} source={require('../assets/ui/LoopModeCard.png')} />
          <View style={styles.overlay}>
            <Text style={styles.overlayText}>WORKING ON IT ✌︎㋡ </Text>
          </View>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const CARD_WIDTH = SCREEN_WIDTH * 0.25;
const CARD_HEIGHT = SCREEN_HEIGHT * 0.82;

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
  },

  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: SCREEN_WIDTH * 0.8,
    height: '100%',
  },

  cardWrapper: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    overflow: 'hidden',
    alignItems: 'center',
    borderRadius: 5,
  },

  cardImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  overlayText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
