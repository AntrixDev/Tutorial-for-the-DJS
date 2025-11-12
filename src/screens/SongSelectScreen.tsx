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
import songs, { Song } from '../songs/songs';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../screenWH';

const SWidth = SCREEN_WIDTH;
const SHeight = SCREEN_HEIGHT;

export default function SongSelectScreen() {
  const navigation = useNavigation<any>();

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
  const avalibleSongs = 1; //last index

  const renderItem = ({ item, index }: { item: Song; index: number }) => (
    <TouchableOpacity
      style={[
        styles.songItem,
        {
          width: itemWidth,
          backgroundColor: index > avalibleSongs ? '#ffffff97' : '#ffffffff',
          opacity: index > avalibleSongs ? 0.25 : 1,
        },
      ]}
      onPress={() => {
        if (index <= avalibleSongs) {
          //nav
          navigation.navigate('DescSong', { song: item});
      }
      }}
    >
      <Image style={[styles.songImage, { width: imageSize, height: imageSize }]} source={item.image} />
      <Text style={styles.songDifficulty}>{item.difficulty}</Text>
      <View style={styles.songInfo}>
        <Text style={styles.songTitle}>{item.title}</Text>
        <Text style={styles.songSinger}>by {item.singer}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.arrow}>⤶</Text>
      </TouchableOpacity>
      <View style={[styles.songListContainer, { width: containerWidth, height: SHeight }]}>
        <FlatList
          data={songs}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={numColumns}
          key={numColumns.toString()}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <Image source={require('../assets/ui/SSCorner.png')} style={[styles.pinkBorder, { left: 0 }]} />
      <Image source={require('../assets/ui/SSCorner.png')} style={[styles.pinkBorder, { right: 0, transform: [{ scaleX: -1 }] }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000ff',
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
    alignItems: 'center',
    justifyContent: 'flex-start',
    overflow: 'hidden',
  },
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

  pinkBorder: {
  position: 'absolute',
  bottom: 0,
  width: SCREEN_WIDTH * 0.20,
  height: SCREEN_WIDTH *0.23,
  },
});