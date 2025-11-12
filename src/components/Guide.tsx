import { View, StyleSheet } from "react-native";
import { useSharedValue } from "react-native-reanimated";

import { Card } from "./Card";

const cards = [
  {
    source: require("../assets/Guide/TUTsixth.png"),
  },
  {
    source: require("../assets/Guide/TUTfifth.png"),
  },
  {
    source: require("../assets/Guide/TUTfourth.png"),
  },
  {
    source: require("../assets/Guide/TUTthird.png"),
  },
  {
    source: require("../assets/Guide/TUTsecond.png"),
  },
  {
    source: require("../assets/Guide/TUTfirst.png"),
  },
];

export const assets = cards.map((card) => card.source);

export const Guide = () => {
  const shuffleBack = useSharedValue(false);
  return (
    <>
      {cards.map((card, index) => (
        <Card card={card} key={index} index={index} shuffleBack={shuffleBack} backgroundImage={require("../assets/Guide/CardBckg.png")} />
      ))}
    </>
  );
};