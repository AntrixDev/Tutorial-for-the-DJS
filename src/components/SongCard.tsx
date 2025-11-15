import React from 'react';
import { TouchableOpacity, View, Text, Image, StyleSheet } from 'react-native';
import { Song } from '../songs/songs';

interface SongCardProps {
  item: Song;
  index: number;
  availableSongs: number;
  width: number;
  imageSize: number;
  onPress: () => void;
}

export default function SongCard({
  item,
  index,
  availableSongs,
  width,
  imageSize,
  onPress,
}: SongCardProps) {
  const locked = index > availableSongs;

  return (
    <TouchableOpacity
      style={[
        styles.songItem,
        {
          width,
          backgroundColor: locked ? '#ffffff97' : '#ffffffff',
          opacity: locked ? 0.25 : 1,
        },
      ]}
      onPress={!locked ? onPress : undefined}
    >
      <Image
        style={[styles.songImage, { width: imageSize, height: imageSize }]}
        source={item.image}
      />

      <Text style={styles.songDifficulty}>{item.difficulty}</Text>

      <View style={styles.songInfo}>
        <Text style={styles.songTitle}>{item.title}</Text>
        <Text style={styles.songSinger}>by {item.singer}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  songItem: {
    flexDirection: 'column',
    borderRadius: 8,
    marginVertical: 8,
    marginHorizontal: 8,
    alignItems: 'center',
    padding: 10,
    borderWidth: 2,
    borderColor: 'black',
    position: 'relative',
  },
  songImage: {
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'black',
  },
  songInfo: {
    marginTop: 5,
    alignItems: 'center',
  },
  songTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  songSinger: {
    fontSize: 13,
    color: '#333',
    marginTop: 2,
    textAlign: 'center',
  },
  songDifficulty: {
    fontSize: 12,
    color: 'white',
    marginTop: 3,
    textAlign: 'center',
    fontWeight: '800',
    backgroundColor: '#f393cbff',
    borderColor: 'black',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    position: 'absolute',
  },
});
