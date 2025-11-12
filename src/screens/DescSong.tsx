import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function DescSong({ route }) {
  const song = route.params.song;

  return (
    <View style={styles.container}>
      <Image source={song.image} style={styles.image} />
      <Text style={styles.title}>{song.title}</Text>
      <Text style={styles.singer}>by {song.singer}</Text>
      <Text style={styles.difficulty}>Difficulty: {song.difficulty}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center',},
  image: { width: 200, height: 200 },
  title: { fontSize: 24, fontWeight: 'bold' },
  singer: { fontSize: 18 },
  difficulty: { fontSize: 16 },
});