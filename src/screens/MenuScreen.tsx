import { StyleSheet, View } from 'react-native';
import { Parallax } from '../components';
import { layers } from '../assets/parallax';
import { ParallaxButton } from '../components';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export default function MenuScreen() {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <Parallax layers={layers} />
      <View style={styles.buttonsWrapper}>
        <View style={styles.button}>
          <ParallaxButton 
            label="START GAME" 
            onPress={() => navigation.navigate('Mode')}
          />
        </View>
        <View style={styles.button}>
          <ParallaxButton
            label="HOW TO PLAY?"
            onPress={() => navigation.navigate('Guide')}
          />
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