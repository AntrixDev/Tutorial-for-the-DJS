import React from 'react';
import Animated, {
  useAnimatedSensor,
  SensorType,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../screenWH';

const SWidth = SCREEN_WIDTH;
const SHeight = SCREEN_HEIGHT;

const IMAGE_OFFSET = 30;
const SENSITIVITY = 0.3;

const ParallaxImg = ({ img, zIndex }) => {

  const sensor = useAnimatedSensor(SensorType.ROTATION);

  const imgStyle = useAnimatedStyle(() => {
    const { pitch, roll } = sensor.sensor.value;

    const pitchMove = interpolate(
      pitch,
      [-SENSITIVITY, SENSITIVITY],
      [0, IMAGE_OFFSET* (zIndex/8)],
      Extrapolation.CLAMP
    );

    const rollMove = interpolate(
      roll,
      [-SENSITIVITY, SENSITIVITY],
      [0, IMAGE_OFFSET * (zIndex/8)],
      Extrapolation.CLAMP
    );

    return {
      top: -IMAGE_OFFSET + pitchMove,
      left: -IMAGE_OFFSET + rollMove,
    };
  });

  return (
    <Animated.Image
      source={img}
      style={[
        {
          width: SWidth + IMAGE_OFFSET,
          height: SHeight + IMAGE_OFFSET,
          position: 'absolute',
        },
        imgStyle,
      ]}
    />
  );
};

export default ParallaxImg;