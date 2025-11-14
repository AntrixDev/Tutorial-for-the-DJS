import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import BackButton from '../components/BackButton';
import { SCREEN_WIDTH } from '../screenWH';
import { useNavigation } from '@react-navigation/native';

const SWidth = SCREEN_WIDTH;

export default function DescSong({ route }) {
  const navigation = useNavigation<any>();
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
        <View style={styles.scoreSection}>
          <Text style={styles.topScore}>Top Score: {song.topScore || 0}</Text>
          <TouchableOpacity 
            style={styles.playButton}
            onPress={() => {
              navigation.navigate('Game', { mp3: song.mp3, beatmapL: song.left, beatmapR: song.right });
            }}
          >
            <Text style={styles.playButtonText}>Play ➭</Text>
          </TouchableOpacity>
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
    padding: 20,
    alignItems: 'center',
    width: SWidth * 0.75,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  image: {
    width: SWidth * 0.2,
    height: SWidth * 0.2,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  details: {
    marginLeft: 15,
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  singer: {
    fontSize: 16,
    color: '#ccc',
  },
  difficulty: {
    fontSize: 14,
    color: '#aaa',
  },
  progressContainer: {
    width: '100%',
    height: 4,
    backgroundColor: '#555',
    marginTop: 20,
    borderRadius: 2,
  },
  progressFill: {
    width: '70%',
    height: 4,
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  scoreSection: {
    alignItems: 'center',
    marginTop: 20,
  },
  topScore: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 20,
  },
  playButton: {
    backgroundColor: '#ffffffff',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#aaa',
  },
  playButtonText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f0f0fff',
  },
});
