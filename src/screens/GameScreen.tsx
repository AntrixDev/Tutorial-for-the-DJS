import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ImageBackground, Text } from 'react-native';
// import { Audio } from 'expo-audio';

export default function GameScreen({ route }) {
  const { mp3 } = route.params;
  const [countdown, setCountdown] = useState<number | string>(3);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const startCountdown = () => {
      let count = 3;
      timer = setInterval(() => {
        if (count > 1) {
          count -= 1;
          setCountdown(count);
        } else if (count === 1) {
          count = 0;
          setCountdown('GO!');
        } else {
          clearInterval(timer);
          setCountdown('');
        }
      }, 1000);
    };

    startCountdown();

    return () => clearInterval(timer);
  }, []);

  return (
    <ImageBackground
      source={require('../assets/gameplay/gameBckg.png')}
      style={styles.container}
    >
      {countdown ? (
        <View style={styles.overlay}>
          <Text style={styles.countdownText}>{countdown}</Text>
        </View>
      ) : null}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  countdownText: {
    color: '#fff',
    fontSize: 72,
    fontWeight: '900',
    textShadowColor: '#000',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 10,
  },
});