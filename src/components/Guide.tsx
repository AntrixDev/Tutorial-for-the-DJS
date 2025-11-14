import { View, StyleSheet } from "react-native";
import { useSharedValue } from "react-native-reanimated";

import { Card } from "./Card";

const cards = [
  // {
  //   source: require("../assets/guide/TUTsecond.png"),
  // },
  {
    source: require("../assets/guide/TUTfirst.png"),
  },
];

export const assets = cards.map((card) => card.source);

export const Guide = () => {
  const shuffleBack = useSharedValue(false);
  return (
    <>
      {cards.map((card, index) => (
        <Card card={card} key={index} index={index} shuffleBack={shuffleBack} backgroundImage={require("../assets/guide/CardBckg.png")} />
      ))}
    </>
  );
};