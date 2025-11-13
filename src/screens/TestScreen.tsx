import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { GestureHandlerRootView, GestureDetector, Gesture } from "react-native-gesture-handler";

export default function TestScreen() {
  const [count, setCount] = useState(0);

  // Create a tap gesture
  const tapGesture = Gesture.Tap().onEnd(() => {
    setCount((prev) => prev + 1);
  });

  return (
    <GestureHandlerRootView style={styles.container}>
      <GestureDetector gesture={tapGesture}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>Tap Me!</Text>
        </View>
      </GestureDetector>

      <Text style={styles.counter}>Tapped {count} times</Text>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: 150,
    height: 60,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  counter: {
    marginTop: 20,
    fontSize: 16,
  },
});
