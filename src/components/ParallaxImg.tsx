import React from 'react';
import { useWindowDimensions } from 'react-native';
import Animated, {
  useAnimatedSensor,
  SensorType,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';

const IMAGE_OFFSET = 30;
const SENSITIVITY = 0.75;

const ParallaxImg = ({ img, zIndex }) => {
  const { width, height } = useWindowDimensions();

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
          width: width + IMAGE_OFFSET,
          height: height + IMAGE_OFFSET,
          position: 'absolute',
        },
        imgStyle,
      ]}
    />
  );
};

export default ParallaxImg;