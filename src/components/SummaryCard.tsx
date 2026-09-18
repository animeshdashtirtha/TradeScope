import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, Platform, StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '../theme/colors';

type Props = {
  label: string;
  value: string;
  accent: string;
  delay?: number;
};

function parseNumericValue(display: string): { numeric: number; prefix: string; suffix: string } {
  const match = display.match(/^([^0-9]*)([0-9]+)(.*)$/);
  if (!match) return { numeric: 0, prefix: display, suffix: '' };
  return { numeric: parseInt(match[2], 10), prefix: match[1], suffix: match[3] };
}

export function SummaryCard({ label, value, accent, delay = 0 }: Props) {
  const { numeric, prefix, suffix } = parseNumericValue(value);
  const animated = useRef(new Animated.Value(0)).current;
  const [displayNum, setDisplayNum] = useState(numeric > 0 ? 0 : value);
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
    if (reducedMotion.current || numeric === 0) {
      setDisplayNum(value);
      return;
    }

    const listener = animated.addListener(({ value: v }) => {
      setDisplayNum(`${prefix}${Math.round(v)}${suffix}`);
    });

    const anim = Animated.timing(animated, {
      toValue: numeric,
      duration: 700,
      delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: Platform.OS !== 'web',
    });
    anim.start();
    return () => {
      anim.stop();
      animated.removeListener(listener);
    };
  }, [numeric, delay, animated, prefix, suffix, value]);

  return (
    <View style={styles.card}>
      <View style={[styles.accent, { backgroundColor: accent }]} />
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{displayNum}</Text>
      <View style={[styles.underline, { backgroundColor: `${accent}55` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 0,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing(2),
    borderWidth: 1,
    borderTopWidth: 0.5,
    borderTopColor: colors.cardHighlight,
    borderColor: colors.border,
    overflow: 'hidden',
    shadowColor: colors.shadowBase,
    shadowOpacity: 0.07,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  accent: { width: 32, height: 4, borderRadius: 3, marginBottom: 14 },
  label: { color: colors.subtle, fontSize: 10, lineHeight: 13, fontWeight: '700' },
  value: { color: colors.text, fontSize: 19, fontWeight: '900', marginTop: 6 },
  underline: { width: '100%', height: 2, marginTop: 12, borderRadius: 2 },
});
