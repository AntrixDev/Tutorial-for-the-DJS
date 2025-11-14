import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View, StyleSheet, ImageBackground, Text, TouchableOpacity, Modal, Dimensions, AppState, Animated, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SCREEN_WIDTH } from '../screenWH';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import Vinyl from '../components/Vinyl';

const SWidth = SCREEN_WIDTH;

interface RequiredState {
  dir: string;
  beatIndex: number;
}

export default function GameScreen({ route }) {
  const { mp3, beatmapL, beatmapR } = route.params;
  const [countdown, setCountdown] = useState<string>('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [isGameOverModalVisible, setGameOverModalVisible] = useState(false);
  const navigation = useNavigation<any>();
  const timerRefs = useRef<NodeJS.Timeout[]>([]);
  const lastPauseTime = useRef<number | null>(null);
  const [gameStarted, setGameStarted] = useState(false);

  const [requiredStateLeft, setRequiredStateLeft] = useState<RequiredState | null>(null);
  const [requiredStateRight, setRequiredStateRight] = useState<RequiredState | null>(null);
  const [triggerSliceGroupLeft, setTriggerSliceGroupLeft] = useState<string | null>(null);
  const [triggerSliceGroupRight, setTriggerSliceGroupRight] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [nextBeatIndexLeft, setNextBeatIndexLeft] = useState(0);
  const [nextBeatIndexRight, setNextBeatIndexRight] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [paused, setPaused] = useState(true);
  const [showCentralError, setShowCentralError] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const directions = ['vertical', 'horizontal', 'diagLeft', 'diagRight'];
  const directionToGroup: { [key: string]: string } = {
    vertical: 'gh',
    horizontal: 'ef',
    diagLeft: 'cd',
    diagRight: 'ab',
  };

  const player = useAudioPlayer(mp3, { updateInterval: 50 });
  const status = useAudioPlayerStatus(player);

  const clearTimers = useCallback(() => {
    timerRefs.current.forEach(clearTimeout);
    timerRefs.current = [];
  }, []);

  const startCountdown = useCallback(() => {
    clearTimers();
    setCountdown('3');
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const nextCount = 3 - Math.floor(elapsed / 1000);
      if (nextCount > 0) {
        setCountdown(nextCount.toString());
      } else if (nextCount === 0) {
        setCountdown('GO!');
      } else {
        clearInterval(interval);
        timerRefs.current = timerRefs.current.filter(t => t !== interval);
        setCountdown('');
        player.play();
        setPaused(false);
        setGameStarted(true);
      }
    }, 1000);
    timerRefs.current.push(interval);
  }, [clearTimers, player]);

  useEffect(() => {
    startCountdown();
    return clearTimers;
  }, [startCountdown, clearTimers]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active' && lastPauseTime.current) {
        if (gameStarted) {
          player.play();
          setPaused(false);
        } else {
          startCountdown();
        }
        lastPauseTime.current = null;
      } else if (nextAppState.match(/inactive|background/)) {
        lastPauseTime.current = Date.now();
        clearTimers();
        player.pause();
        setPaused(true);
      }
    });
    return () => subscription.remove();
  }, [startCountdown, clearTimers, player, gameStarted]);

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
        setGameOverModalVisible(true);
      }
      return newLives;
    });
    flashError();
  };

  useEffect(() => {
    if (gameOver || paused || nextBeatIndexLeft >= beatmapL.length) return;

    let newIndex = nextBeatIndexLeft;
    while (newIndex < beatmapL.length && status.currentTime >= beatmapL[newIndex]) {
      const beatIndex = newIndex;
      const dir = directions[Math.floor(Math.random() * directions.length)];

      setRequiredStateLeft({ dir, beatIndex });
      setTimeout(() => {
        if (requiredStateLeft?.beatIndex === beatIndex) {
          const group = directionToGroup[dir];
          setTriggerSliceGroupLeft(group);
          setTimeout(() => setTriggerSliceGroupLeft(null), 100);
          handleError();
          setRequiredStateLeft(null);
        }
      }, 1000);

      newIndex++;
    }
    if (newIndex > nextBeatIndexLeft) {
      setNextBeatIndexLeft(newIndex);
    }
  }, [status.currentTime, nextBeatIndexLeft, gameOver, paused, requiredStateLeft, beatmapL, directions, directionToGroup]);

  useEffect(() => {
    if (gameOver || paused || nextBeatIndexRight >= beatmapR.length) return;

    let newIndex = nextBeatIndexRight;
    while (newIndex < beatmapR.length && status.currentTime >= beatmapR[newIndex]) {
      const beatIndex = newIndex;
      const dir = directions[Math.floor(Math.random() * directions.length)];

      setRequiredStateRight({ dir, beatIndex });
      setTimeout(() => {
        if (requiredStateRight?.beatIndex === beatIndex) {
          const group = directionToGroup[dir];
          setTriggerSliceGroupRight(group);
          setTimeout(() => setTriggerSliceGroupRight(null), 100);
          handleError();
          setRequiredStateRight(null);
        }
      }, 1000);

      newIndex++;
    }
    if (newIndex > nextBeatIndexRight) {
      setNextBeatIndexRight(newIndex);
    }
  }, [status.currentTime, nextBeatIndexRight, gameOver, paused, requiredStateRight, beatmapR, directions, directionToGroup]);

  const handleResume = () => {
    setModalVisible(false);
    startCountdown();
  };

  const handleRestart = () => {
    setModalVisible(false);
    player.pause();
    player.seekTo(0);
    setScore(0);
    setLives(3);
    setNextBeatIndexLeft(0);
    setNextBeatIndexRight(0);
    setGameOver(false);
    setRequiredStateLeft(null);
    setRequiredStateRight(null);
    setTriggerSliceGroupLeft(null);
    setTriggerSliceGroupRight(null);
    setGameStarted(false);
    startCountdown();
  };

  const handleGoHome = () => {
    setModalVisible(false);
    player.remove();
    navigation.navigate('Menu');
  };

  const handleGameOverRestart = () => {
    setGameOverModalVisible(false);
    player.pause();
    player.seekTo(0);
    setScore(0);
    setLives(3);
    setNextBeatIndexLeft(0);
    setNextBeatIndexRight(0);
    setGameOver(false);
    setRequiredStateLeft(null);
    setRequiredStateRight(null);
    setTriggerSliceGroupLeft(null);
    setTriggerSliceGroupRight(null);
    setGameStarted(false);
    startCountdown();
  };

  const handleGameOverGoHome = () => {
    setGameOverModalVisible(false);
    player.remove();
    navigation.navigate('Game');
  };

  const hearts = '❤️'.repeat(lives);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ImageBackground
        source={require('../assets/gameplay/gameBckg.png')}
        style={styles.container}
      >
        <TouchableOpacity style={styles.menuButton} onPress={() => { setModalVisible(true); player.pause(); setPaused(true); }}>
          <Text style={styles.arrow}>☰</Text>
        </TouchableOpacity>
        <View style={styles.topBar}>
          <View style={styles.empty} />
          <Text style={styles.hudText}>{score}</Text>
          <Text style={styles.hudText}>{hearts}</Text>
        </View>
        {countdown ? (
          <View style={styles.overlay}>
            <Text style={styles.countdownText}>{countdown}</Text>
          </View>
        ) : null}
        <View style={styles.vinylContainer}>
          {showCentralError && (
            <View style={styles.centralError} >
              <Image source={require('../assets/gameplay/error.png')} style={styles.centralX} />
            </View>
          )}
          <Vinyl
            requiredDirection={requiredStateLeft?.dir || null}
            triggerSliceGroup={triggerSliceGroupLeft}
            onCorrect={() => {
              handleSuccess();
              setRequiredStateLeft(null);
            }}
            onError={() => {
              handleError();
              setRequiredStateLeft(null);
            }}
          />
          <Vinyl
            requiredDirection={requiredStateRight?.dir || null}
            triggerSliceGroup={triggerSliceGroupRight}
            onCorrect={() => {
              handleSuccess();
              setRequiredStateRight(null);
            }}
            onError={() => {
              handleError();
              setRequiredStateRight(null);
            }}
          />
        </View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent]}>
              <Text style={styles.modalTitle}>Menu</Text>
              <Text style={styles.scoreText}>Current Score: {score}</Text>
              <Text style={styles.scoreText}>Best Score: -</Text>
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.menuItemButton]}
                  onPress={handleResume}
                >
                  <Text style={styles.buttonText}>Resume</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.menuItemButton]}
                  onPress={handleRestart}
                >
                  <Text style={styles.buttonText}>Restart</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.menuItemButton]}
                  onPress={handleGoHome}
                >
                  <Text style={styles.buttonText}>Home</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <Modal
          animationType="fade"
          transparent={true}
          visible={isGameOverModalVisible}
          onRequestClose={() => setGameOverModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent]}>
              <Text style={styles.modalTitle}>Game Over</Text>
              <Text style={styles.scoreText}>Final Score: {score}</Text>
              <Text style={styles.scoreText}>Best Score: -</Text>
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.menuItemButton]}
                  onPress={handleGameOverRestart}
                >
                  <Text style={styles.buttonText}>Restart</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.menuItemButton]}
                  onPress={handleGameOverGoHome}
                >
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffff',
    borderRadius: 10,
    paddingVertical: 25,
    alignItems: 'center',
    width: SWidth * 0.5,
  },
  modalTitle: {
    fontSize: 30,
    fontWeight: '900',
    marginBottom: 10,
    color: '#000',
  },
  scoreText: {
    fontSize: 18,
    color: '#000',
    marginBottom: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: 20,
  },
  menuItemButton: {
    height: 55,
    backgroundColor: '#000',
    marginHorizontal: 5,
    marginVertical: 5,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '40%',
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    height: '13%',
    width: '100%',
  },
  empty: {
    width: 50,
  },
  hudText: {
    fontSize: 25,
    color: 'white',
    fontWeight: 'bold',
  },
  vinylContainer: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'relative',
  },
  centralError: {
    position: 'absolute',
    top: 50,
    left: '50%',
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    transform: [{ translateX: -40 }],
  },
  centralX: {
    width: 60,
    height: 60,
  },
});