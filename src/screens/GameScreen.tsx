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

  const handleSuccess = () => setScore((s) => s + 10);

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
    if (newIndex > nextBeatIndexLeft) setNextBeatIndexLeft(newIndex);
  }, [status.currentTime, nextBeatIndexLeft, gameOver, paused, requiredStateLeft, beatmapL]);

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
    if (newIndex > nextBeatIndexRight) setNextBeatIndexRight(newIndex);
  }, [status.currentTime, nextBeatIndexRight, gameOver, paused, requiredStateRight, beatmapR]);

  useEffect(() => {
    if (status.isLoaded && status.duration && !gameOver && gameStarted && status.currentTime >= status.duration - 40) {
      setGameOver(true);
      player.pause();
      setScore(s => s + 100);
      setGameOverModalVisible(true);
    }
  }, [status, gameOver, gameStarted, player]);

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

  const handleGoMenu = () => {
    setModalVisible(false);
    player.remove();
    navigation.navigate('Menu');
  };

  const handleGameOverRestart = () => {
    setGameOverModalVisible(false);
    handleRestart();
  };

  const handleGameOverGoMenu = () => {
    setGameOverModalVisible(false);
    player.remove();
    navigation.navigate('Menu');
  };

  const hearts = '❤︎'.repeat(lives);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ImageBackground source={require('../assets/gameplay/gameBckg.png')} style={styles.container}>

        {/* Menu Button (left corner) */}
        <TouchableOpacity style={styles.menuButton} onPress={() => { setModalVisible(true); player.pause(); setPaused(true); }}>
          <Text style={styles.arrow}>☰</Text>
        </TouchableOpacity>

        {/* ⭐ NEW TOP BAR ⭐ */}
        <View style={styles.topBar}>
          <Text style={styles.scoreCenter}>{score}</Text>
          <Text style={styles.heartsRight}>{hearts}</Text>
        </View>

        {countdown ? (
          <View style={styles.overlay}>
            <Text style={styles.countdownText}>{countdown}</Text>
          </View>
        ) : null}

        <View style={styles.vinylContainer}>
          {showCentralError && (
            <Animated.View style={[styles.centralError, { opacity: fadeAnim }]}>
              <Image source={require('../assets/gameplay/error.png')} style={styles.centralX} />
            </Animated.View>
          )}

          <Vinyl
            requiredDirection={requiredStateLeft?.dir || null}
            triggerSliceGroup={triggerSliceGroupLeft}
            onCorrect={() => { handleSuccess(); setRequiredStateLeft(null); }}
            onError={() => { handleError(); setRequiredStateLeft(null); }}
          />

          <Vinyl
            requiredDirection={requiredStateRight?.dir || null}
            triggerSliceGroup={triggerSliceGroupRight}
            onCorrect={() => { handleSuccess(); setRequiredStateRight(null); }}
            onError={() => { handleError(); setRequiredStateRight(null); }}
          />
        </View>

        <Modal animationType="fade" transparent visible={isModalVisible}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Menu</Text>
              <Text style={styles.scoreText}>Current Score: {score}</Text>
              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.menuItemButton} onPress={handleResume}><Text style={styles.buttonText}>Resume</Text></TouchableOpacity>
                <TouchableOpacity style={styles.menuItemButton} onPress={handleRestart}><Text style={styles.buttonText}>Restart</Text></TouchableOpacity>
                <TouchableOpacity style={styles.menuItemButton} onPress={handleGoMenu}><Text style={styles.buttonText}>Menu</Text></TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal animationType="fade" transparent visible={isGameOverModalVisible}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Game Over</Text>
              <Text style={styles.scoreText}>Final Score: {score}</Text>
              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.menuItemButton} onPress={handleGameOverRestart}><Text style={styles.buttonText}>Restart</Text></TouchableOpacity>
                <TouchableOpacity style={styles.menuItemButton} onPress={handleGameOverGoMenu}><Text style={styles.buttonText}>Menu</Text></TouchableOpacity>
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
  topBar: {
    position: 'absolute',
    top: 0,
    height: '10%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  scoreCenter: {
    position: 'absolute',
    alignSelf: 'center',
    fontSize: 30,
    fontWeight: '900',
    color: 'white',
  },
  heartsRight: {
    position: 'absolute',
    right: 20,
    fontSize: 25,
    color: 'white',
    fontWeight: 'bold',
  },
  menuButton: {
    position: 'absolute',
    top: '4%',
    left: '2%',
    width: 45,
    height: 35,
    backgroundColor: '#fff',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    borderWidth: 4,
    borderColor: '#000',
  },
  arrow: {
    fontSize: 20,
    color: '#000',
    fontWeight: 'bold',
  },
  overlay: {
    position: 'absolute',
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  countdownText: {
    color: '#fff',
    fontSize: 72,
    fontWeight: '900',
    textShadowColor: '#000',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 10,
  },
  vinylContainer: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'relative',
    height: '60%',
    bottom: 0,
  },
  centralError: {
    position: 'absolute',
    top: 50,
    left: '50%',
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ translateX: -40 }],
    zIndex: 10,
  },
  centralX: {
    width: 90,
    height: 90,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
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
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 20,
    justifyContent: 'center',
  },
  menuItemButton: {
    height: 55,
    width: '40%',
    backgroundColor: '#000',
    borderRadius: 10,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});
