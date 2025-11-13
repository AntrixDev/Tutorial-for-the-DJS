import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View, StyleSheet, ImageBackground, Text, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SCREEN_WIDTH } from '../screenWH';

const SWidth = SCREEN_WIDTH;

export default function GameScreen({ route }) {
  const { mp3 } = route.params;
  const [countdown, setCountdown] = useState<string>('');
  const [isModalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation<any>();
  const timerRefs = useRef<NodeJS.Timeout[]>([]);

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
      //start audio start gm
    }
  }, 1000);
  timerRefs.current.push(interval);
}, [clearTimers]);

  useEffect(() => {
    startCountdown();
    return clearTimers;
  }, [startCountdown, clearTimers]);

  const handleResume = () => {
    setModalVisible(false);
    startCountdown();
  };

  const handleRestart = () => {
    setModalVisible(false);
    startCountdown();
  };

  const handleGoHome = () => {
    setModalVisible(false);
    navigation.navigate('SongSelect');
  };

  return (
    <ImageBackground
      source={require('../assets/gameplay/gameBckg.png')}
      style={styles.container}
    >
      <TouchableOpacity style={styles.menuButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.arrow}>☰</Text>
      </TouchableOpacity>
      {countdown ? (
        <View style={styles.overlay}>
          <Text style={styles.countdownText}>{countdown}</Text>
        </View>
      ) : null}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent]}>
            <Text style={styles.modalTitle}>Menu</Text>
            <Text style={styles.scoreText}>Current Score: 0</Text>
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
});
