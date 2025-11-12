import React from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  Text,
  Image,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import songs from '../songs/songs';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../screenWH';

const SWidth = SCREEN_WIDTH;
const SHeight = SCREEN_HEIGHT;

interface Song {
  id: number;
  title: string;
  singer: string;
  image: any;
  difficulty: string;
}

export default function SongSelectScreen() {
  const navigation = useNavigation();

  const numColumns = 4;
  const containerWidth = 0.7 * SWidth;
  const containerPadding = 10;
  const containerBorder = 2;
  const availableWidth = containerWidth - 2 * containerPadding - 2 * containerBorder;
  const itemMargin = 10;
  const itemPadding = 10;
  const itemOccupied = availableWidth / numColumns;
  const itemWidth = itemOccupied - 2 * itemMargin;
  const imageSize = itemWidth - 2 * itemPadding;

  const renderItem = ({ item, index }: { item: Song; index: number }) => (
    <TouchableOpacity
      style={[
        styles.songItem,
        {
          width: itemWidth,
          backgroundColor: index % 2 === 0 ? '#8b8b8bff' : '#767676ff',
        },
      ]}
      onPress={() => {}}
    >
      <Image style={[styles.songImage, { width: imageSize, height: imageSize }]} source={item.image} />
      <View style={styles.songInfo}>
        <Text style={styles.songTitle}>{item.title}</Text>
        <Text style={styles.songSinger}>{item.singer}</Text>
        <Text style={styles.songDifficulty}>{item.difficulty}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.arrow}>⤶</Text>
      </TouchableOpacity>
      <View style={[styles.songListContainer, { width: containerWidth, height: 0.8 * SHeight }]}>
        <FlatList
          data={songs}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={numColumns}
          key={numColumns.toString()}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* <Image source={require('../assets/TUTfirst.png')} style={[styles.pinkBorder, { left: 0 }]} />
      <Image source={require('../assets/TUTfifth.png')} style={[styles.pinkBorder, { right: 0 }]} /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#131313ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
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
  songListContainer: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'flex-start',
    overflow: 'hidden',
  },
  songItem: {
    flexDirection: 'column',
    borderRadius: 8,
    margin: 10,
    alignItems: 'center',
    padding: 10,
  },
  songImage: {
    borderRadius: 8,
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
    color: '#000000ff',
    marginTop: 3,
    textAlign: 'center',
    fontWeight: '800',
  },
  pinkBorder: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 50,
    resizeMode: 'stretch',
  },
});