import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import BackButton from '../components/BackButton';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SWidth = SCREEN_WIDTH;
const SHeight = SCREEN_HEIGHT;

export default function DescSong({ route }) {
  const song = route.params.song;

  return (
    <View style={styles.container}>
      <BackButton />
      <View style={styles.card}>
        <View style={styles.topRow}>
          <Image source={song.image} style={styles.image} />
          <View style={styles.details}>
            <Text style={styles.title}>{song.title}</Text>
            <Text style={styles.singer}>by {song.singer}</Text>
            <Text style={styles.difficulty}>Difficulty: {song.difficulty}</Text>
          </View>
        </View>
        <View style={styles.progressContainer}>
          <View style={styles.progressFill} />
        </View>
        <View style={styles.controlsRow}>
          <Text style={styles.time}>1:57</Text>
          <TouchableOpacity onPress={() => console.log('Rewind pressed')}>
            {/* <Image source={require('../assets/rewind.png')} style={styles.controlImage} /> */}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => console.log('Pause pressed')}>
            {/* <Image source={require('../assets/pause.png')} style={styles.controlImage} /> */}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => console.log('Forward pressed')}>
            {/* <Image source={require('../assets/forward.png')} style={styles.controlImage} /> */}
          </TouchableOpacity>
          <Text style={styles.time}>-0:34</Text>
        </View>
        <View style={styles.volumeRow}>
          <View style={styles.sliderTrack}>
            <View style={styles.sliderFill} />
            <View style={styles.sliderKnob} />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
  },
  card: {
    backgroundColor: '#333',
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
    width: SWidth * 0.9,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  image: {
    width: SWidth * 0.2,
    height: SWidth * 0.2,
    backgroundColor: '#fff',
  },
  details: {
    marginLeft: 15,
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  singer: {
    fontSize: 16,
    color: '#fff',
  },
  difficulty: {
    fontSize: 14,
    color: '#fff',
  },
  progressContainer: {
    width: '100%',
    height: 2,
    backgroundColor: '#555',
    marginTop: 15,
    marginBottom: 5,
  },
  progressFill: {
    width: '70%',
    height: 2,
    backgroundColor: '#fff',
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  time: {
    fontSize: 12,
    color: '#fff',
  },
  controlImage: {
    width: 30,
    height: 30,
    tintColor: '#fff',
    marginHorizontal: 10,
  },
  volumeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: 15,
  },
  volumeImage: {
    width: 20,
    height: 20,
    tintColor: '#fff',
  },
  sliderTrack: {
    flex: 1,
    height: 2,
    backgroundColor: '#555',
    marginHorizontal: 10,
    position: 'relative',
  },
  sliderFill: {
    position: 'absolute',
    left: 0,
    width: '50%',
    height: 2,
    backgroundColor: '#fff',
  },
  sliderKnob: {
    position: 'absolute',
    left: '50%',
    top: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
});