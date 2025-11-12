import timingsS1L from './beatmaps/beatmapS1L';
import timingsS1R from './beatmaps/beatmapS1R';
import timingsS2L from './beatmaps/beatmapS2L';
import timingsS2R from './beatmaps/beatmapS2R';

const songs = [
  {
    id: 1,
    title: 'Body Freak',
    singer: 'Soniq Branding',
    mp3: require('./tracks/BodyFreak.mp3'),
    image: require('../assets/songCovers/test.png'),
    difficulty: 'Easy',
    timings: {
      left: timingsS1L,
      right: timingsS1R,
    },
  },
  {
    id: 2,
    title: 'Are You Ready for Me Baby',
    singer: 'Funky Giraffe',
    mp3: require('./tracks/AreYouReadyforMeBaby.mp3'),
    image: require('../assets/songCovers/test.png'),
    difficulty: 'Hard',
    timings: {
      left: timingsS2L,
      right: timingsS2R,
    },
  },
];


export default songs;