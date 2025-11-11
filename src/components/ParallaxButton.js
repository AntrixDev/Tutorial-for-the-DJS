import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react';
import Animated, {
  useAnimatedSensor,
  SensorType,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';

const BUTTON_OFFSET = 20;
const SENSITIVITY = 0.75;

const ParallaxMenuButton = ({label, onPress, delay = 1}) => {
    const sensor = useAnimatedSensor(SensorType.ROTATION);

    const buttonStyle = useAnimatedStyle(() => {
        const { pitch, roll } = sensor.sensor.value;

        const pitchMove = interpolate(
        pitch,
        [-SENSITIVITY, SENSITIVITY],
        [-BUTTON_OFFSET / delay, BUTTON_OFFSET / delay],
        Extrapolation.CLAMP
        );

        const rollMove = interpolate(
        roll,
        [-SENSITIVITY, SENSITIVITY],
        [-BUTTON_OFFSET / delay, BUTTON_OFFSET / delay],
        Extrapolation.CLAMP
        );

        return {
        transform: [
            { translateX: rollMove },
            { translateY: pitchMove },
        ],
        };
    });


  return (
    <Animated.View style={[styles.buttonContainer, buttonStyle]}>
      <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.8}>
        <Text style={styles.text}>{label}</Text>
      </TouchableOpacity>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  buttonContainer: {
    alignSelf: 'center',
    marginVertical: 5,
  },
  button: {
    backgroundColor: '#ffffffff',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#aaa',
  },
  text: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f0f0fff',
  },
});

export default ParallaxMenuButton