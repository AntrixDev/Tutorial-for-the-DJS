import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, View, useWindowDimensions, Animated, Image, Easing } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useSharedValue, useAnimatedReaction } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import CutLineOverlay from './CutLineOverlay';

interface Props {
  requiredDirection: string | null;
  triggerSliceGroup: string | null;
  onCorrect?: () => void;
  onError?: () => void;
}

export default function Vinyl({ requiredDirection, triggerSliceGroup, onCorrect, onError }: Props) {
  const dimensions = useWindowDimensions();
  const vinylSize = Math.min(240, (dimensions.width / 2) - 40);
  const previousInsideRef = useRef(false);
  const lastInsidePos = useRef({ x: 0, y: 0 });
  const [slicedGroupState, setSlicedGroupState] = useState<string | null>(null);

  const half1X = useRef(new Animated.Value(0)).current;
  const half1Y = useRef(new Animated.Value(0)).current;
  const half1Rot = useRef(new Animated.Value(0)).current;
  const half2Rot = useRef(new Animated.Value(0)).current;
  const half2X = useRef(new Animated.Value(0)).current;
  const half2Y = useRef(new Animated.Value(0)).current;

  const vinylRef = useRef<View | null>(null);
  const vinylPositionSV = useSharedValue({ x: 0, y: 0 });
  const vinylSizeSV = useSharedValue(vinylSize);
  const hasCrossedSV = useSharedValue(false);
  const slicedGroupSV = useSharedValue<string | null>(null);

  const slices = {
    ab: [require('../assets/gameplay/sliceA.png'), require('../assets/gameplay/sliceB.png')], // diagRight /
    cd: [require('../assets/gameplay/sliceD.png'), require('../assets/gameplay/sliceC.png')], // diagLeft \
    ef: [require('../assets/gameplay/sliceF.png'), require('../assets/gameplay/sliceE.png')], // horizontal
    gh: [require('../assets/gameplay/sliceG.png'), require('../assets/gameplay/sliceH.png')], // vertical
  };

  const directionToGroup: { [key: string]: string } = {
    vertical: 'gh',
    horizontal: 'ef',
    diagLeft: 'cd',
    diagRight: 'ab',
  };

  const requiredGroup = requiredDirection ? directionToGroup[requiredDirection] : null;
  const requiredGroupSV = useSharedValue(requiredGroup);

  useEffect(() => {
    requiredGroupSV.value = requiredGroup;
  }, [requiredGroup]);

  useEffect(() => {
    vinylSizeSV.value = vinylSize;
  }, [vinylSize]);

  useAnimatedReaction(
    () => slicedGroupSV.value,
    (value) => {
      scheduleOnRN(setSlicedGroupState, value);
    },
    []
  );

  useEffect(() => {
    if (triggerSliceGroup && !hasCrossedSV.value) {
      hasCrossedSV.value = true;
      slicedGroupSV.value = triggerSliceGroup;
    }
  }, [triggerSliceGroup]);

  useEffect(() => {
    const measure = () => {
      vinylRef.current?.measureInWindow((x, y) => {
        vinylPositionSV.value = { x, y };
      });
    };
    measure();
  }, [dimensions.width, dimensions.height, vinylSize]);

  useEffect(() => {
    if (slicedGroupState) {
      let half1Anims: any[] = [];
      let half2Anims: any[] = [];

      if (slicedGroupState === 'gh') {
        half1Anims = [
          Animated.timing(half1X, { toValue: -100, duration: 300, easing: Easing.out(Easing.quad), useNativeDriver: true }),
          Animated.timing(half1Y, { toValue: dimensions.height, duration: 500, easing: Easing.in(Easing.quad), useNativeDriver: true }),
          Animated.timing(half1Rot, { toValue: -20, duration: 300, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        ];
        half2Anims = [
          Animated.timing(half2X, { toValue: 100, duration: 300, easing: Easing.out(Easing.quad), useNativeDriver: true }),
          Animated.timing(half2Y, { toValue: dimensions.height, duration: 500, easing: Easing.in(Easing.quad), useNativeDriver: true }),
          Animated.timing(half2Rot, { toValue: 20, duration: 300, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        ];
      } else {
        const half2YSeq = Animated.sequence([
          Animated.timing(half2Y, { toValue: -30, duration: 200, easing: Easing.out(Easing.ease), useNativeDriver: true }),
          Animated.timing(half2Y, { toValue: dimensions.height, duration: 500, easing: Easing.in(Easing.quad), useNativeDriver: true }),
        ]);
        half2Anims = [half2YSeq, Animated.timing(half2X, { toValue: -30, duration: 600, easing: Easing.out(Easing.quad), useNativeDriver: true }), Animated.timing(half2Rot, { toValue: 10, duration: 600, easing: Easing.out(Easing.quad), useNativeDriver: true })];

        half1Anims = [
          Animated.timing(half1Y, { toValue: dimensions.height, duration: 300, easing: Easing.in(Easing.quad), useNativeDriver: true }),
          Animated.timing(half1X, { toValue: 30, duration: 300, easing: Easing.out(Easing.quad), useNativeDriver: true }),
          Animated.timing(half1Rot, { toValue: -10, duration: 300, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        ];
      }

      Animated.parallel([...half1Anims, ...half2Anims]).start(({ finished }) => {
        if (finished) {
          half1X.setValue(0);
          half1Y.setValue(0);
          half1Rot.setValue(0);
          half2X.setValue(0);
          half2Y.setValue(0);
          half2Rot.setValue(0);
          slicedGroupSV.value = null;
          hasCrossedSV.value = false;
        }
      });
    }
  }, [slicedGroupState, dimensions.height]);

  const tap = Gesture.Tap().onEnd((e) => {
    'worklet';
    const vinylX = vinylPositionSV.value.x;
    const vinylY = vinylPositionSV.value.y;
    const centerX = vinylX + vinylSizeSV.value / 2;
    const centerY = vinylY + vinylSizeSV.value / 2;
    const r = vinylSizeSV.value / 2;
    const posX = e.absoluteX;
    const posY = e.absoluteY;
    const isInside = Math.sqrt(Math.pow(posX - centerX, 2) + Math.pow(posY - centerY, 2)) <= r;
    if (isInside && !hasCrossedSV.value) {
      hasCrossedSV.value = true;
      slicedGroupSV.value = 'gh';
      const isCorrect = requiredGroupSV.value === 'gh';
      if (isCorrect) {
        scheduleOnRN(onCorrect);
      } else {
        scheduleOnRN(onError);
      }
    }
  });

  const pan = Gesture.Pan()
    .onStart((e) => {
      'worklet';
      const vinylX = vinylPositionSV.value.x;
      const vinylY = vinylPositionSV.value.y;
      const centerX = vinylX + vinylSizeSV.value / 2;
      const centerY = vinylY + vinylSizeSV.value / 2;
      const r = vinylSizeSV.value / 2;
      const posX = e.absoluteX;
      const posY = e.absoluteY;
      const isInside = Math.sqrt(Math.pow(posX - centerX, 2) + Math.pow(posY - centerY, 2)) <= r;
      previousInsideRef.current = isInside;
      if (isInside) {
        lastInsidePos.current = { x: posX, y: posY };
      }
    })
    .onUpdate((e) => {
      'worklet';
      const vinylX = vinylPositionSV.value.x;
      const vinylY = vinylPositionSV.value.y;
      const centerX = vinylX + vinylSizeSV.value / 2;
      const centerY = vinylY + vinylSizeSV.value / 2;
      const r = vinylSizeSV.value / 2;
      const posX = e.absoluteX;
      const posY = e.absoluteY;
      const isInside = Math.sqrt(Math.pow(posX - centerX, 2) + Math.pow(posY - centerY, 2)) <= r;
      let triggerPos = null;
      if (!previousInsideRef.current && isInside) {
        triggerPos = { x: posX, y: posY };
      } else if (previousInsideRef.current && !isInside) {
        triggerPos = lastInsidePos.current;
      }
      if (triggerPos && !hasCrossedSV.value) {
        const points = [
          { name: 'A', x: centerX + r * Math.cos(5 * Math.PI / 4), y: centerY + r * Math.sin(5 * Math.PI / 4), group: 'ab' },
          { name: 'C', x: centerX + r * Math.cos(7 * Math.PI / 4), y: centerY + r * Math.sin(7 * Math.PI / 4), group: 'cd' },
          { name: 'B', x: centerX + r * Math.cos(Math.PI / 4), y: centerY + r * Math.sin(Math.PI / 4), group: 'ab' },
          { name: 'D', x: centerX + r * Math.cos(3 * Math.PI / 4), y: centerY + r * Math.sin(3 * Math.PI / 4), group: 'cd' },
          { name: 'E', x: vinylX, y: vinylY + vinylSizeSV.value / 2, group: 'ef' },
          { name: 'F', x: vinylX + vinylSizeSV.value, y: vinylY + vinylSizeSV.value / 2, group: 'ef' },
          { name: 'G', x: vinylX + vinylSizeSV.value / 2, y: vinylY, group: 'gh' },
          { name: 'H', x: vinylX + vinylSizeSV.value / 2, y: vinylY + vinylSizeSV.value, group: 'gh' },
        ];
        let minDist = Infinity;
        let closestGroup: string | null = null;
        points.forEach((point) => {
          const dist = Math.sqrt(Math.pow(triggerPos!.x - point.x, 2) + Math.pow(triggerPos!.y - point.y, 2));
          if (dist < minDist) {
            minDist = dist;
            closestGroup = point.group;
          }
        });
        if (closestGroup) {
          hasCrossedSV.value = true;
          slicedGroupSV.value = closestGroup;
          const isCorrect = requiredGroupSV.value === closestGroup;
          if (isCorrect) {
            scheduleOnRN(onCorrect);
          } else {
            scheduleOnRN(onError);
          }
        }
      }
      if (isInside) {
        lastInsidePos.current = { x: posX, y: posY };
      }
      previousInsideRef.current = isInside;
    });

  const composed = Gesture.Exclusive(pan, tap);

  
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 5000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);



  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <GestureDetector gesture={composed}>
      <View style={styles.container}>
        <View style={{ position: 'absolute', left: -1000 }}>
          <Image source={require('../assets/gameplay/sliceA.png')} style={{ width: 1, height: 1, opacity: 0 }} />
          <Image source={require('../assets/gameplay/sliceB.png')} style={{ width: 1, height: 1, opacity: 0 }} />
          <Image source={require('../assets/gameplay/sliceC.png')} style={{ width: 1, height: 1, opacity: 0 }} />
          <Image source={require('../assets/gameplay/sliceD.png')} style={{ width: 1, height: 1, opacity: 0 }} />
          <Image source={require('../assets/gameplay/sliceE.png')} style={{ width: 1, height: 1, opacity: 0 }} />
          <Image source={require('../assets/gameplay/sliceF.png')} style={{ width: 1, height: 1, opacity: 0 }} />
          <Image source={require('../assets/gameplay/sliceG.png')} style={{ width: 1, height: 1, opacity: 0 }} />
          <Image source={require('../assets/gameplay/sliceH.png')} style={{ width: 1, height: 1, opacity: 0 }} />
        </View>
        <View ref={vinylRef} style={{ width: vinylSize, height: vinylSize, overflow: 'visible' }}>
          <Animated.Image
            source={require('../assets/gameplay/vin.png')}
            style={{
              width: vinylSize,
              height: vinylSize,
              borderRadius: vinylSize / 2,
              transform: [{ rotate: spin }],
            }}
            resizeMode="cover"
          />

          {slicedGroupState && (
            <>
              <Animated.Image
                key="half1"
                source={slices[slicedGroupState][0]}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: vinylSize,
                  height: vinylSize,
                  transform: [
                    { translateX: half1X },
                    { translateY: half1Y },
                    {
                      rotate: half1Rot.interpolate({
                        inputRange: [-360, 360],
                        outputRange: ['-360deg', '360deg'],
                      }),
                    },
                  ],
                }}
              />
              <Animated.Image
                key="half2"
                source={slices[slicedGroupState][1]}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: vinylSize,
                  height: vinylSize,
                  transform: [
                    { translateX: half2X },
                    { translateY: half2Y },
                    {
                      rotate: half2Rot.interpolate({
                        inputRange: [-360, 360],
                        outputRange: ['-360deg', '360deg'],
                      }),
                    },
                  ],
                }}
              />
            </>
          )}

        <CutLineOverlay size={vinylSize} group={requiredGroup} />

        </View>
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '50%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});