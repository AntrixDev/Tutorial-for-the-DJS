import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import songs from '../songs/songs';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../screenWH';
import BackButton from '../components/BackButton';
import SongCard from '../components/SongCard';

const SWidth = SCREEN_WIDTH;
const SHeight = SCREEN_HEIGHT;

export default function SongSelectScreen() {
  const navigation = useNavigation<any>();

  const numColumns = 4;
  const containerWidth = 0.7 * SWidth;
  const containerPadding = 10;
  const containerBorder = 2;
  const availableWidth =
    containerWidth - 2 * containerPadding - 2 * containerBorder;

  const itemMargin = 10;
  const itemPadding = 10;

  const itemOccupied = availableWidth / numColumns;
  const itemWidth = itemOccupied - 2 * itemMargin;
  const imageSize = itemWidth - 2 * itemPadding;

  const availableSongs = 1;

  return (
    <View style={styles.container}>
      <BackButton />

      <View
        style={[
          styles.songListContainer,
          { width: containerWidth, height: SHeight },
        ]}
      >
        <FlatList
          data={songs}
          keyExtractor={(item) => item.id.toString()}
          numColumns={numColumns}
          renderItem={({ item, index }) => (
            <SongCard
              item={item}
              index={index}
              availableSongs={availableSongs}
              width={itemWidth}
              imageSize={imageSize}
              onPress={() => navigation.navigate('DescSong', { song: item })}
            />
          )}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <Image
        source={require('../assets/ui/SSCorner.png')}
        style={[styles.pinkBorder, { left: 0 }]}
      />
      <Image
        source={require('../assets/ui/SSCorner.png')}
        style={[
          styles.pinkBorder,
          { right: 0, transform: [{ scaleX: -1 }] },
        ]}
      />
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
  songListContainer: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'flex-start',
    overflow: 'hidden',
  },
  pinkBorder: {
    position: 'absolute',
    bottom: 0,
    width: SCREEN_WIDTH * 0.2,
    height: SCREEN_WIDTH * 0.23,
  },
});
