import React, { useRef } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';

export default function InteractiveSquare() {
  const dimensions = useWindowDimensions();
  const previousInsideRef = useRef(false);
  const lastInsidePos = useRef({ x: 0, y: 0 });
  const squareSize = 100;

  const [color, setColor] = React.useState('red');

  const pan = Gesture.Pan()
    .onStart((e) => {
      const squareX = (dimensions.width - squareSize) / 2;
      const squareY = (dimensions.height - squareSize) / 2;

      const posX = e.absoluteX;
      const posY = e.absoluteY;

      const isInside =
        posX >= squareX &&
        posX <= squareX + squareSize &&
        posY >= squareY &&
        posY <= squareY + squareSize;

      previousInsideRef.current = isInside;

      if (isInside) {
        lastInsidePos.current = { x: posX, y: posY };
      }
    })
    .onUpdate((e) => {
      const squareX = (dimensions.width - squareSize) / 2;
      const squareY = (dimensions.height - squareSize) / 2;

      const posX = e.absoluteX;
      const posY = e.absoluteY;

      const isInside =
        posX >= squareX &&
        posX <= squareX + squareSize &&
        posY >= squareY &&
        posY <= squareY + squareSize;

      let triggerPos = null;

      if (!previousInsideRef.current && isInside) {
        triggerPos = { x: posX, y: posY };
      } else if (previousInsideRef.current && !isInside) {
        triggerPos = lastInsidePos.current;
      }

      if (triggerPos) {
        const points = [
          { name: 'A', x: squareX, y: squareY, group: 'blue' },
          { name: 'B', x: squareX + squareSize, y: squareY, group: 'green' },
          { name: 'C', x: squareX + squareSize, y: squareY + squareSize, group: 'blue' },
          { name: 'D', x: squareX, y: squareY + squareSize, group: 'green' },
          { name: 'E', x: squareX, y: squareY + squareSize / 2, group: 'orange' },
          { name: 'F', x: squareX + squareSize, y: squareY + squareSize / 2, group: 'orange' },
          { name: 'G', x: squareX + squareSize / 2, y: squareY, group: 'yellow' },
          { name: 'H', x: squareX + squareSize / 2, y: squareY + squareSize, group: 'yellow' },
        ];

        let minDist = Infinity;
        let closestGroup = null;

        points.forEach((point) => {
          const dist = Math.sqrt(Math.pow(triggerPos.x - point.x, 2) + Math.pow(triggerPos.y - point.y, 2));
          if (dist < minDist) {
            minDist = dist;
            closestGroup = point.group;
          }
        });

        if (closestGroup) {
          setColor(
            closestGroup === 'blue' ? 'blue' :
            closestGroup === 'green' ? 'green' :
            closestGroup === 'orange' ? 'orange' :
            'yellow'
          );
        }
      }

      if (isInside) {
        lastInsidePos.current = { x: posX, y: posY };
      }

      previousInsideRef.current = isInside;
    });

  const tap = Gesture.Tap().onEnd((e) => {
    const squareX = (dimensions.width - squareSize) / 2;
    const squareY = (dimensions.height - squareSize) / 2;

    const posX = e.absoluteX;
    const posY = e.absoluteY;

    const isInside =
      posX >= squareX &&
      posX <= squareX + squareSize &&
      posY >= squareY &&
      posY <= squareY + squareSize;

    if (isInside) {
      setColor('orange');
    }
  });

  const composed = Gesture.Exclusive(pan, tap);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GestureDetector gesture={composed}>
        <View style={styles.container}>
          <View style={[styles.square, { backgroundColor: color }]} />
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  square: {
    width: 100,
    height: 100,
  },
});