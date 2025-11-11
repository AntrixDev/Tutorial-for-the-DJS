import { StyleSheet, View } from 'react-native';
import { Parallax } from '../components';
import { layers } from '../assets/parallax';

export default function MenuScreen() {
  return (
    <View style={styles.container}>
      <Parallax layers={layers}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000ff',
    overflow: 'hidden',
  },
});