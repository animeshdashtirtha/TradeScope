import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { SignalStrength } from '../types/trade';

export function SignalBadge({ signalStrength }: { signalStrength: SignalStrength }) {
  const tone = signalStrength === 'High' ? colors.accent : signalStrength === 'Medium' ? colors.watch : colors.subtle;
  return (
    <View style={[styles.badge, { backgroundColor: `${tone}18`, borderColor: `${tone}55` }]}>
      <View style={[styles.dot, signalStrength === 'High' && styles.dotGlow, { backgroundColor: tone }]} />
      <Text style={[styles.text, { color: tone }]} numberOfLines={1} ellipsizeMode="clip">
        {signalStrength} strength
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    flexShrink: 1,
    minWidth: 0,
    maxWidth: '100%',
    gap: 5,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 9,
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
  dotGlow: {
    shadowColor: colors.accent,
    shadowOpacity: 0.35,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 0 },
  },
  text: { flexShrink: 1, fontSize: 10, fontWeight: '800' },
});
