import { useEffect, useRef } from 'react';
import { AccessibilityInfo, Animated, Easing, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '../theme/colors';
import { InsiderTrade } from '../types/trade';
import { formatCurrency, formatDateTime } from '../utils/formatters';
import { SignalBadge } from './SignalBadge';

export function TradeCard({ trade, onPress }: { trade: InsiderTrade; onPress: () => void }) {
  const isPurchase = trade.type === 'Purchase';
  const scale = useRef(new Animated.Value(1)).current;
  const chevronX = useRef(new Animated.Value(0)).current;
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
    Animated.parallel([
      Animated.timing(scale, { toValue: 0.96, duration: 150, easing: Easing.out(Easing.cubic), useNativeDriver: Platform.OS !== 'web' }),
      Animated.timing(chevronX, { toValue: 4, duration: 120, easing: Easing.out(Easing.cubic), useNativeDriver: Platform.OS !== 'web' }),
    ]).start();
  };

  const onPressOut = () => {
    if (reducedMotion.current) return;
    Animated.parallel([
      Animated.timing(scale, { toValue: 1, duration: 250, easing: Easing.out(Easing.cubic), useNativeDriver: Platform.OS !== 'web' }),
      Animated.timing(chevronX, { toValue: 0, duration: 200, easing: Easing.out(Easing.cubic), useNativeDriver: Platform.OS !== 'web' }),
    ]).start();
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${trade.company}, ${trade.type.toLowerCase()}, ${formatCurrency(trade.value, true)}. Open details`}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
    >
      <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
        <View style={[styles.edge, { backgroundColor: isPurchase ? colors.purchase : colors.sale }]} />
        <View style={styles.inner}>
          <View style={styles.top}>
            <View style={styles.identity}>
              <Text style={styles.ticker}>{trade.ticker}</Text>
              <Text style={styles.company}>{trade.company}</Text>
            </View>
            <SignalBadge signalStrength={trade.signalStrength} />
          </View>

          <View style={styles.bottom}>
            <View>
              <Text style={[styles.type, { color: isPurchase ? colors.purchase : colors.sale }]}>
                {isPurchase ? '↗ PURCHASE' : '↘ SALE'}
              </Text>
              <Text style={styles.meta}>{trade.insider} · {trade.role} · Filed {formatDateTime(trade.filedAt)}</Text>
            </View>
            <View style={styles.valueRow}>
              <Text style={styles.value}>{formatCurrency(trade.value, true)}</Text>
              <Animated.Text style={[styles.chevron, { transform: [{ translateX: chevronX }] }]}>›</Animated.Text>
            </View>
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderTopColor: colors.cardHighlight,
    borderTopWidth: 0.5,
    borderRadius: 16,
    marginBottom: 11,
    overflow: 'hidden',
    shadowColor: colors.shadowBase,
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
  },
  edge: { width: 5 },
  inner: { flex: 1, padding: spacing(2) },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 },
  identity: { flex: 1, minWidth: 0, paddingRight: 10 },
  ticker: { color: colors.text, fontSize: 16, fontWeight: '800', letterSpacing: 0.3 },
  company: { color: colors.muted, fontSize: 12, marginTop: 4 },
  bottom: { marginTop: 18, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  type: { fontSize: 11, fontWeight: '900', letterSpacing: 0.7 },
  meta: { color: colors.subtle, fontSize: 11, marginTop: 6 },
  valueRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  value: { color: colors.text, fontSize: 20, fontWeight: '900' },
  chevron: { color: colors.subtle, fontSize: 20, fontWeight: '600' },
});
