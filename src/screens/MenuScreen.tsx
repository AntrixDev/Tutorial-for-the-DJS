import { StyleSheet, View } from 'react-native';
import { Parallax } from '../components';
import { layers } from '../assets/parallax';
import { ParallaxButton } from '../components';

export default function MenuScreen() {
  return (
    <View style={styles.container}>
      <Parallax layers={layers}/>
      <View style={styles.buttonsWrapper}>
        <View style={styles.button}>
          <ParallaxButton label="START GAME" onPress={() => {}} />
        </View>
        <View style={styles.button}>
          <ParallaxButton label="HOW TO PLAY?" onPress={() => {}} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000ff',
    overflow: 'hidden',
  },
  buttonsWrapper: {
    position: 'absolute',
    bottom: '5%',
    width: '100%',
    alignItems: 'center',
  },
  button: {
    marginVertical: 10,
    width: '70%',
  },
});