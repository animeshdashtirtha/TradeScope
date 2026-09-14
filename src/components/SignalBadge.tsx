import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { Signal } from '../types/trade';

export function SignalBadge({ signal }: { signal: Signal }) {
  const tone = signal === 'Bullish' ? colors.purchase : signal === 'Bearish' ? colors.sale : colors.watch;
  return <View style={[styles.badge, { backgroundColor: `${tone}18`, borderColor: `${tone}50` }]}><View style={[styles.dot, { backgroundColor: tone }]} /><Text style={[styles.text, { color: tone }]}>{signal}</Text></View>;
}
const styles = StyleSheet.create({ badge: { flexDirection: 'row', alignItems: 'center', gap: 5, borderWidth: 1, paddingHorizontal: 8, paddingVertical: 5, borderRadius: 99 }, dot: { width: 6, height: 6, borderRadius: 3 }, text: { fontSize: 11, fontWeight: '700' } });