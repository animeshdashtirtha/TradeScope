import { useEffect, useRef } from 'react';
import { AccessibilityInfo, Animated, Easing, Platform, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export function BrandLockup({ compact = false }: { compact?: boolean }) {
  const markOpacity = useRef(new Animated.Value(0)).current;
  const markScale = useRef(new Animated.Value(compact ? 1 : 0.8)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textSlide = useRef(new Animated.Value(8)).current;
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
    if (compact || reducedMotion.current) {
      markOpacity.setValue(1);
      markScale.setValue(1);
      textOpacity.setValue(1);
      textSlide.setValue(0);
      return;
    }

    const animations = Animated.parallel([
      Animated.timing(markOpacity, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.timing(markScale, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 500,
        delay: 100,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.timing(textSlide, {
        toValue: 0,
        duration: 500,
        delay: 100,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: Platform.OS !== 'web',
      }),
    ]);
    animations.start();

    return () => animations.stop();
  }, [compact, markOpacity, markScale, textOpacity, textSlide]);

  return (
    <View style={[styles.lockup, compact && styles.compactLockup]} accessibilityLabel="TradeScope brand">
      <Animated.View style={[styles.mark, compact && styles.compactMark, { opacity: markOpacity, transform: [{ scale: markScale }] }]}>
        <View style={styles.markHalo} />
        <Ionicons name="scan-outline" size={compact ? 17 : 20} color={colors.accent} />
        <View style={styles.markDot} />
      </Animated.View>
      <Animated.View style={{ opacity: textOpacity, transform: [{ translateX: textSlide }] }}>
        <Text style={[styles.wordmark, compact && styles.compactWordmark]}>
          Trade<Text style={styles.wordmarkAccent}>Scope</Text>
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  lockup: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  compactLockup: { gap: 8 },
  mark: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: `${colors.accent}70`,
    overflow: 'hidden',
    shadowColor: colors.accent,
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  compactMark: { width: 30, height: 30, borderRadius: 9 },
  markHalo: { position: 'absolute', width: 24, height: 24, borderRadius: 12, borderWidth: 1, borderColor: `${colors.purchase}55` },
  markDot: { position: 'absolute', right: 6, top: 6, width: 4, height: 4, borderRadius: 2, backgroundColor: colors.purchase },
  wordmark: { color: colors.text, fontSize: 20, fontWeight: '900', letterSpacing: 0.4 },
  compactWordmark: { fontSize: 16 },
  wordmarkAccent: { color: colors.accent },
});
