import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface CutLineOverlayProps {
  size: number;
  group: string | null;
}

const groupToAngle: { [key: string]: string } = {
  gh: '0deg',
  ef: '90deg',
  ab: '-45deg',
  cd: '45deg',
};

const gradientOptions = [
  '#fe737b',
  '#fed36b',
  '#fffe98',
  '#72e2ff',
  '#5f95fe',
  '#9264d9',
  '#ff9efe',
];

export default function CutLineOverlay({ size, group }: CutLineOverlayProps) {
  if (!group) return null;

  const length = size * 1.4;
  const angle = groupToAngle[group];

  const randomColor = React.useMemo(() => {
    return gradientOptions[Math.floor(Math.random() * gradientOptions.length)];
  }, [group]);

  return (
    <View style={[styles.overlay, { width: size, height: size }]}>
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          width: 5,
          height: length,
          transform: [{ rotate: angle }],
          top: '50%',
          left: '50%',
          marginLeft: -4,
          marginTop: -length / 2,
          shadowColor: '#000000ff',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 1,
          shadowRadius: 16,
          elevation: 10,
          borderRadius: 4,
          overflow: 'hidden',
        }}
      >
        <LinearGradient
          colors={[
            'transparent',
            randomColor,
            '#ffffffff',
            randomColor,
            'transparent',
          ]}
          style={{ flex: 1 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none',
  },
});
