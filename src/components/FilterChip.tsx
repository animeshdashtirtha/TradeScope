import { useEffect, useRef } from 'react';
import { AccessibilityInfo, Animated, Easing, Platform, Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../theme/colors';

export function FilterChip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  const scale = useRef(new Animated.Value(1)).current;
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

  const onPressIn = () => {
    if (reducedMotion.current) return;
    Animated.timing(scale, {
      toValue: 0.95,
      duration: 120,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  };

  const onPressOut = () => {
    if (reducedMotion.current) return;
    Animated.timing(scale, {
      toValue: 1,
      duration: 200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  };

  return (
    <Pressable
      style={styles.hitTarget}
      accessibilityRole="button"
      accessibilityLabel={`${label} filter`}
      accessibilityState={{ selected: active }}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
    >
      <Animated.View style={[styles.chip, active && styles.active, { transform: [{ scale }] }]}>
        <Text style={[styles.label, active && styles.activeLabel]}>{label}</Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hitTarget: {
    alignSelf: 'flex-start',
    minHeight: 44,
    justifyContent: 'center',
    marginRight: 8,
    marginBottom: 8,
  },
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 13,
    paddingVertical: 8,
    backgroundColor: colors.surface,
    shadowColor: colors.shadowBase,
    shadowOpacity: 0.07,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  active: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
    shadowColor: colors.accent,
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  label: { color: colors.muted, fontSize: 12, fontWeight: '700' },
  activeLabel: { color: colors.ink },
});
