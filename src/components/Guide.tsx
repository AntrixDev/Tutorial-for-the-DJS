import { View, StyleSheet } from "react-native";
import { useSharedValue } from "react-native-reanimated";

import { Card } from "./Card";

const cards = [
  {
    source: require("../assets/guide/ninth.png"),
  },
  {
    source: require("../assets/guide/eighth.png"),
  },
  {
    source: require("../assets/guide/seventh.png"),
  },
  {
    source: require("../assets/guide/sixth.png"),
  },
  {
     source: require("../assets/guide/fifth.png"),
   },
  {
     source: require("../assets/guide/fourth.png"),
   },
  {
     source: require("../assets/guide/third.png"),
   },
  {
     source: require("../assets/guide/second.png"),
   },
  {
    source: require("../assets/guide/first.png"),
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