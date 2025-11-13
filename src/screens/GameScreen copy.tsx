import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View, StyleSheet, ImageBackground, Text, TouchableOpacity, Modal, Animated, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SCREEN_WIDTH } from '../screenWH';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import Vinyl from '../components/Vinyl';

const SWidth = SCREEN_WIDTH;

interface RequiredState {
  dir: string;
  beatIndex: number;
}

export default function GameScreen({ route }) {
    const { mp3, beatmapL = [], beatmapR = [] } = route?.params ?? {};
    const navigation = useNavigation<any>();

    const player = useAudioPlayer(mp3, { updateInterval: 50 });
    const status = useAudioPlayerStatus(player);

    const [countdown, setCountdown] = useState<string>('');
    const [gameStarted, setGameStarted] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);
    const [score, setScore] = useState(0);
    const [bestScore, setBestScore] = useState<number | null>(null);
    const [lives, setLives] = useState(3);
    const [gameOver, setGameOver] = useState(false);

    const [requiredStateLeft, setRequiredStateLeft] = useState<RequiredState | null>(null);
    const [requiredStateRight, setRequiredStateRight] = useState<RequiredState | null>(null);
    const [triggerSliceGroupLeft, setTriggerSliceGroupLeft] = useState<string | null>(null);
    const [triggerSliceGroupRight, setTriggerSliceGroupRight] = useState<string | null>(null);
    const [nextBeatIndexLeft, setNextBeatIndexLeft] = useState(0);
    const [nextBeatIndexRight, setNextBeatIndexRight] = useState(0);

    const [showCentralError, setShowCentralError] = useState(false);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const timerRefs = useRef<NodeJS.Timeout[]>([]);

    const clearTimers = useCallback(() => {
        timerRefs.current.forEach(clearTimeout);
        timerRefs.current = [];
    }, []);

 const startCountdown = useCallback(() => {
    clearTimers();
    setCountdown('3');

    const t1 = setTimeout(() => setCountdown('2'), 1000);
    const t2 = setTimeout(() => setCountdown('1'), 2000);
    const t3 = setTimeout(() => setCountdown('GO!'), 3000);
    const t4 = setTimeout(() => {
      setCountdown('');
      setGameStarted(true);
      player.play();
    }, 4000);

    timerRefs.current = [t1, t2, t3, t4];
  }, [clearTimers, player]);

 useEffect(() => {
    startCountdown();
    return () => {
      clearTimers();
      // Removed player.pause() here to avoid calling on a potentially released player during unmount
    };
  }, []);

  const flashError = () => {
    setShowCentralError(true);
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
      Animated.delay(200),
      Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
    ]).start(() => setShowCentralError(false));
  };

  const handleSuccess = () => {
    setScore((s) => s + 10);
  };

  const handleError = () => {
    setLives((l) => {
      const newLives = l - 1;
      if (newLives <= 0) {
        setGameOver(true);
        player.pause();
      }
      return newLives;
    });
    flashError();
  };

  const handleResume = () => {
    setModalVisible(false);
    if (!gameOver) player.play();
  };

  const handleRestart = () => {
    setModalVisible(false);
    startCountdown();
  };

  const handleGoHome = () => {
    navigation.navigate('Menu');
  };

return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ImageBackground
        source={require('../assets/gameplay/gameBckg.png')}
        style={styles.container}
        resizeMode="cover"
      >
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => {
            setModalVisible(true);
            if (gameStarted && !gameOver) player.pause();
          }}
        >
          <Text style={styles.arrow}>☰</Text>
        </TouchableOpacity>

        <View style={styles.hud}>
          <Text style={styles.hudText}>Score: {score}</Text>
          <Text style={styles.hudText}>❤️×{lives}</Text>
        </View>

        {countdown ? (
          <View style={styles.overlay}>
            <Text style={styles.countdownText}>{countdown}</Text>
          </View>
        ) : null}

        <Modal animationType="fade" transparent visible={isModalVisible} onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{gameOver ? 'Game Over!' : 'Menu'}</Text>
              <Text style={styles.modalScore}>Score: {score}</Text>
              <Text style={styles.modalScore}>Best: {bestScore ?? '-'}</Text>

              <View style={styles.buttonRow}>
                {!gameOver && (
                  <TouchableOpacity style={styles.menuItemButton} onPress={handleResume}>
                    <Text style={styles.buttonText}>Resume</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.menuItemButton} onPress={handleRestart}>
                  <Text style={styles.buttonText}>Restart</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItemButton} onPress={handleGoHome}>
                  <Text style={styles.buttonText}>Home</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ImageBackground>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  hud: {
    position: 'absolute',
    top: 40,
    left: 90,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  hudText: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '900',
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  menuButton: {
    position: 'absolute',
    top: 25,
    left: 25,
    width: 50,
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    borderWidth: 4,
    borderColor: '#000',
  },
  arrow: {
    fontSize: 30,
    color: '#000',
    fontWeight: 'bold',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 50,
  },
  countdownText: {
    color: '#fff',
    fontSize: 180,
    fontWeight: '900',
    textShadowColor: '#000',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 10,
  },
  vinylContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
  },
  centralError: {
    position: 'absolute',
    top: '20%',
    left: '50%',
    marginLeft: -50,
    zIndex: 20,
  },
  centralX: {
    width: 100,
    height: 50,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    width: SWidth * 0.85,
  },
  modalTitle: {
    fontSize: 36,
    fontWeight: '900',
    color: '#000',
    marginBottom: 20,
  },
  modalScore: {
    fontSize: 22,
    color: '#000',
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 20,
    gap: 15,
  },
  menuItemButton: {
    backgroundColor: '#000',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 12,
    minWidth: 120,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});