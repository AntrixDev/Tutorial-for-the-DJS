import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View, StyleSheet, ImageBackground, Text, TouchableOpacity, Modal, AppState, Animated, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SCREEN_WIDTH } from '../screenWH';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import Vinyl from '../components/Vinyl';

const SWidth = SCREEN_WIDTH;

interface RequiredState {
  dir: string;
  beatIndex: number;
}

export default function TrainingScreen() {
  const mp3 = require('../songs/tracks/BodyFreak.mp3');

  const [isModalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation<any>();
  const timerRefs = useRef<NodeJS.Timeout[]>([]);
  const lastPauseTime = useRef<number | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [paused, setPaused] = useState(true);
  const [showCentralError, setShowCentralError] = useState(false);
  const [requiredState, setRequiredState] = useState<RequiredState | null>(null);
  const [triggerSliceGroup, setTriggerSliceGroup] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [nextSpawnTotalTime, setNextSpawnTotalTime] = useState<number>(Infinity);
  const [loopCount, setLoopCount] = useState(0);
  const prevTimeRef = useRef(0);

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

  useEffect(() => {
    if (status.isLoaded) {
      player.loop = true;
      player.play();
      setPaused(false);
      setGameStarted(true);
      setNextSpawnTotalTime(1 + Math.random() * 2);
    }
  }, [status.isLoaded, player]);

  useEffect(() => {
    if (status.isLoaded && status.duration) {
      if (status.currentTime < prevTimeRef.current && prevTimeRef.current > status.duration * 0.5) {
        setLoopCount(c => c + 1);
      }
      prevTimeRef.current = status.currentTime;
    }
  }, [status.currentTime, status.isLoaded, status.duration]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active' && lastPauseTime.current) {
        if (gameStarted) {
          player.play();
          setPaused(false);
        } else if (status.isLoaded) {
          player.play();
          setPaused(false);
          setGameStarted(true);
          setNextSpawnTotalTime(1 + Math.random() * 2);
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
  }, [clearTimers, player, gameStarted, status.isLoaded]);

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
    flashError();
  };

  useEffect(() => {
    if (paused || !status.isLoaded || !status.duration) return;

    const totalTime = status.currentTime + loopCount * status.duration;

    if (totalTime >= nextSpawnTotalTime && !requiredState) {
      const beatIndex = Date.now();
      const dir = directions[Math.floor(Math.random() * directions.length)];
      setRequiredState({ dir, beatIndex });

      const missTimeout = setTimeout(() => {
        if (requiredState?.beatIndex === beatIndex) {
          const group = directionToGroup[dir];
          setTriggerSliceGroup(group);
          setTimeout(() => setTriggerSliceGroup(null), 100);
          handleError();
          setRequiredState(null);
        }
      }, 1000);
      timerRefs.current.push(missTimeout);

      setNextSpawnTotalTime(totalTime + 2 + Math.random() * 2);
    }
  }, [status.currentTime, paused, status.isLoaded, status.duration, nextSpawnTotalTime, requiredState, loopCount]);

  const handleResume = () => {
    setModalVisible(false);
    clearTimers();
    player.play();
    setPaused(false);
  };

  const handleRestart = () => {
    setModalVisible(false);
    clearTimers();
    player.pause();
    player.seekTo(0);
    setScore(0);
    setRequiredState(null);
    setTriggerSliceGroup(null);
    setGameStarted(false);
    setNextSpawnTotalTime(Infinity);
    setLoopCount(0);
    prevTimeRef.current = 0;

    // Start game immediately
    if (status.isLoaded) {
      player.play();
      setPaused(false);
      setGameStarted(true);
      setNextSpawnTotalTime(1 + Math.random() * 2);
    }
  };

  const handleGoMenu = () => {
    setModalVisible(false);
    player.remove();
    navigation.navigate('Menu');
  };

  return (
    <ImageBackground source={require('../assets/gameplay/trainingBckg.png')} style={styles.container}>
      <TouchableOpacity style={styles.menuButton} onPress={() => { setModalVisible(true); player.pause(); setPaused(true); clearTimers(); }}>
        <Text style={styles.arrow}>☰</Text>
      </TouchableOpacity>

      <View style={styles.topBar}>
        <Text style={styles.scoreCenter}>{score} ☆</Text>
      </View>

      <View style={styles.vinylContainer}>
        {showCentralError && (
          <Animated.View style={[styles.centralError, { opacity: fadeAnim }]}>
            <Image source={require('../assets/gameplay/error.png')} style={styles.centralX} />
          </Animated.View>
        )}

        <Vinyl
          requiredDirection={requiredState?.dir || null}
          triggerSliceGroup={triggerSliceGroup}
          onCorrect={() => { handleSuccess(); setRequiredState(null); }}
          onError={() => { handleError(); setRequiredState(null); }}
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
    fontSize: 20,
    color: '#000',
    fontWeight: 'bold',
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
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    borderRadius: 15,
    paddingVertical: 25,
    paddingHorizontal: 20,
    alignItems: 'center',
    width: SWidth * 0.6,
    shadowColor: '#000',
    shadowOffset: { 
      width: 0, 
      height: 4 
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
    modalTitle: {
    fontSize: 28,
    fontWeight: '900',
    marginBottom: 15,
    color: '#000',
    textAlign: 'center',
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
    backgroundColor: 'rgba(0,0,0,0.85)',
    borderRadius: 12,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { 
      width: 0, 
      height: 2 
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});
