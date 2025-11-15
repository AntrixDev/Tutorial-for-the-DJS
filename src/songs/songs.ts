import beatmapS1L from './beatmaps/beatmapS1L';
import beatmapS1R from './beatmaps/beatmapS1R';
import beatmapS2L from './beatmaps/beatmapS2L';
import beatmapS2R from './beatmaps/beatmapS2R';
import beatmapS3L from './beatmaps/beatmapS2L';
import beatmapS3R from './beatmaps/beatmapS2R';

export interface Song {
  id: number;
  title: string;
  singer: string;
  mp3: any;
  image: any;
  difficulty: string;
  beatmaps: {
    left: any;
    right: any;
  };
}

const songs: Song[] = [
  {
    id: 1,
    title: 'Surrender',
    singer: 'Julien Schwarz',
    mp3: require('./tracks/Surrender.mp3'),
    image: require('../assets/songCovers/Surrender.png'),
    difficulty: 'Easy',
    beatmaps: {
      left: beatmapS1L,
      right: beatmapS1R,
    },
  },
  {
    id: 2,
    title: 'Seize The Day',
    singer: 'Andrey Rossi',
    mp3: require('./tracks/SeizeTheDay.mp3'),
    image: require('../assets/songCovers/SeizeTheDay.png'),
    difficulty: 'Hard',
    beatmaps: {
      left: beatmapS2L,
      right: beatmapS2R,
    },
  },
  {
    id: 3,
    title: "You've Got Control On Me",
    singer: 'Neozoic',
    mp3: require('./tracks/YouveGotControlOnMe.mp3'),
    image: require('../assets/songCovers/YouveGotControlOnMe.png'),
    difficulty: 'Medium',
    beatmaps: {
      left: beatmapS3L,
      right: beatmapS3R,
    },
  }
];


export default songs;