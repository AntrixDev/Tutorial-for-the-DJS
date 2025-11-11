import React, { useEffect } from "react";
import { View, StyleSheet, Dimensions, Image, ImageBackground } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Easing,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  SharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { snapPoint } from "react-native-redash";
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../screenWH';

const SWidth = SCREEN_WIDTH;
const SHeight = SCREEN_HEIGHT;

const SNAP_POINTS = [-SWidth, 0, SWidth];
const CARD_SIZE = SWidth * 0.6;
const IMAGE_SIZE = CARD_SIZE * 0.8;
const DURATION = 250;

interface CardProps {
  card: {
    source: ReturnType<typeof require>;
  };
  shuffleBack: SharedValue<boolean>;
  index: number;
  key?: number;
  backgroundImage: ReturnType<typeof require> | { uri: string }; // 👈 add prop for background
}

export const Card = ({ card: { source }, shuffleBack, index, backgroundImage }: CardProps) => {
  const offset = useSharedValue({ x: 0, y: 0 });
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(-SHeight);
  const scale = useSharedValue(1);
  const rotateZ = useSharedValue(0);
  const delay = index * DURATION;
  const theta = -10 + Math.random() * 20;

  useEffect(() => {
    translateY.value = withDelay(
      delay,
      withTiming(0, { duration: DURATION, easing: Easing.inOut(Easing.ease) })
    );
    rotateZ.value = withDelay(delay, withSpring(theta));
  }, [delay, index, rotateZ, theta, translateY]);

  useAnimatedReaction(
    () => shuffleBack.value,
    (v) => {
      if (v) {
        const duration = 150 * index + 150;
        translateX.value = withDelay(
          duration,
          withSpring(0, {}, () => {
            shuffleBack.value = false;
          })
        );
        rotateZ.value = withDelay(duration, withSpring(theta));
      }
    }
  );

  const gesture = Gesture.Pan()
    .onBegin(() => {
      offset.value = { x: translateX.value, y: translateY.value };
      rotateZ.value = withTiming(0);
      scale.value = withTiming(1.1);
    })
    .onUpdate(({ translationX, translationY }) => {
      translateX.value = offset.value.x + translationX;
      translateY.value = offset.value.y + translationY;
    })
    .onEnd(({ velocityX, velocityY }) => {
      const dest = snapPoint(translateX.value, velocityX, SNAP_POINTS);
      translateX.value = withSpring(dest, { velocity: velocityX });
      translateY.value = withSpring(0, { velocity: velocityY });
      scale.value = withTiming(1, {}, () => {
        const isLast = index === 0;
        const isSwipedLeftOrRight = dest !== 0;
        if (isLast && isSwipedLeftOrRight) {
          shuffleBack.value = true;
        }
      });
    });

const style = useAnimatedStyle(() => ({
  transform: [
    { perspective: 4000 },
    { rotateX: "40deg" },
    { translateX: translateX.value },
    { translateY: translateY.value },
    { rotateY: `${rotateZ.value / 10}deg` },
    { rotateZ: `${rotateZ.value}deg` },
    { scale: scale.value },
  ] as any,
}));


  return (
    <View style={styles.container} pointerEvents="box-none">
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.card, style]}>
          <ImageBackground
            source={backgroundImage}
            style={styles.backgroundImage}
            resizeMode="cover"
          >
            <View style={styles.imageWrapper}>
              <Image source={source} style={styles.image} resizeMode="contain" />
            </View>
          </ImageBackground>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "black",
    borderRadius: 15,
    width: CARD_SIZE,
    height: CARD_SIZE * 0.8,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    overflow: "hidden",
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  imageWrapper: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    justifyContent: "center",
    alignItems: "center",
    padding: 4,
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
