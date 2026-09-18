import { useEffect, useRef } from 'react';
import { AccessibilityInfo, Animated, Easing, InteractionManager, StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '../theme/colors';

export function MockActivityChart() {
  const bars = [35, 58, 42, 76, 54, 88, 68];
  const barAnims = useRef(bars.map(() => new Animated.Value(0))).current;
  const reducedMotion = useRef(false);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      reducedMotion.current = enabled;
    });
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', (enabled) => {
      reducedMotion.current = enabled;
    });
    return () => sub.remove();
  }, []);

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      if (reducedMotion.current) {
        barAnims.forEach((anim) => anim.setValue(1));
        return;
      }

      const animations = barAnims.map((anim, index) =>
        Animated.timing(anim, {
          toValue: 1,
          duration: 400,
          delay: index * 50,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        })
      );
      const group = Animated.parallel(animations);
      group.start();
      return () => group.stop();
    });

    return () => task.cancel();
  }, [barAnims]);

  return (
    <View style={styles.wrap}>
      <View style={styles.chart}>
        {bars.map((height, index) => (
          <View key={index} style={styles.column}>
            <Animated.View
              style={[
                styles.bar,
                {
                  height: barAnims[index].interpolate({
                    inputRange: [0, 1],
                    outputRange: ['4%', `${height}%`],
                  }),
                  backgroundColor: index === 5 ? colors.accent : `${colors.accent}70`,
                },
              ]}
            />
            <Text style={styles.day}>{['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderTopWidth: 0.5,
    borderTopColor: colors.cardHighlight,
    borderColor: colors.border,
    padding: spacing(2),
    shadowColor: colors.shadowBase,
    shadowOpacity: 0.07,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  chart: { height: 124, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around' },
  column: { height: '100%', alignItems: 'center', justifyContent: 'flex-end', width: 24 },
  bar: { width: 11, borderRadius: 6, minHeight: 4 },
  day: { color: colors.subtle, fontSize: 10, marginTop: 9, fontWeight: '700' },
});
