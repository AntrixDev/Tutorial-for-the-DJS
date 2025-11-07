import { View, StyleSheet } from "react-native";
import { useSharedValue } from "react-native-reanimated";

import { Card } from "./Card";

const cards = [
  {
    source: require("./assets/TUTsixth.png"),
  },
  {
    source: require("./assets/TUTfifth.png"),
  },
  {
    source: require("./assets/TUTfourth.png"),
  },
  {
    source: require("./assets/TUTthird.png"),
  },
  {
    source: require("./assets/TUTsecond.png"),
  },
  {
    source: require("./assets/TUTfirst.png"),
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