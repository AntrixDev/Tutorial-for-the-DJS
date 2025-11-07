import { View, StyleSheet } from "react-native";
import { useSharedValue } from "react-native-reanimated";

import { Card } from "./Card";

const cards = [
  {
    source: require("./assets/death.png"),
  },
  {
    source: require("./assets/chariot.png"),
  },
  {
    source: require("./assets/high-priestess.png"),
  },
  {
    source: require("./assets/justice.png"),
  },
  {
    source: require("./assets/devil.png"),
  },
  {
    source: require("./assets/fool.png"),
  },
];

export const assets = cards.map((card) => card.source);

export const Tarot = () => {
  const shuffleBack = useSharedValue(false);
  return (
    <View style={styles.container}>
      {cards.map((card, index) => (
        <Card card={card} key={index} index={index} shuffleBack={shuffleBack} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "pink",
  },
});