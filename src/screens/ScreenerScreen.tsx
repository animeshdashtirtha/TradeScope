import { Ionicons } from '@expo/vector-icons';
import * as React from 'react';
import { Animated, Easing, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRef } from 'react';
import { FilterChip } from '../components/FilterChip';
import { TradeCard } from '../components/TradeCard';
import { BrandLockup } from '../components/BrandLockup';
import { FadeInView } from '../components/FadeInView';
import { PressIcon, PressLink } from '../components/Pressables';
import { mockTrades } from '../data/mockTrades';
import { AppScreenProps } from '../navigation/AppNavigator';
import { colors, spacing } from '../theme/colors';
import { InsiderRole, TransactionType } from '../types/trade';

type Props = AppScreenProps<'FindTrades'>;
type Threshold = 'Any' | '$100K+' | '$500K+' | '$1M+';

const thresholdValues: Record<Threshold, number> = {
  Any: 0,
  '$100K+': 100000,
  '$500K+': 500000,
  '$1M+': 1000000,
};

export function ScreenerScreen({ navigation }: Props) {
  const [query, setQuery] = React.useState('');
  const [type, setType] = React.useState<TransactionType | null>(null);
  const [role, setRole] = React.useState<InsiderRole | null>(null);
  const [threshold, setThreshold] = React.useState<Threshold | null>(null);
  const borderAnim = useRef(new Animated.Value(0.27)).current;

  // Keep the search logic in one place so the filters behave as a single screen-level search.
  const filteredTrades = mockTrades.filter((trade) => {
    const matchesQuery = `${trade.ticker} ${trade.company}`.toLowerCase().includes(query.trim().toLowerCase());
    const matchesType = !type || trade.type === type;
    const matchesRole = !role || trade.role === role;
    const selectedThreshold = threshold ?? 'Any';
    const matchesThreshold = trade.value >= thresholdValues[selectedThreshold];

    return matchesQuery && matchesType && matchesRole && matchesThreshold;
  });

  const clearFilters = () => {
    setQuery('');
    setType(null);
    setRole(null);
    setThreshold(null);
  };

  const onFocus = () => {
    Animated.timing(borderAnim, {
      toValue: 0.56,
      duration: 200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  };

  const onBlur = () => {
    Animated.timing(borderAnim, {
      toValue: 0.27,
      duration: 200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={styles.top}>
          <View style={styles.headerActions}>
            <PressIcon onPress={() => navigation.goBack()} label="Go back">
              <View style={styles.iconButton}>
                <Ionicons name="arrow-back" size={20} color={colors.text} />
              </View>
            </PressIcon>
            <BrandLockup compact />
          </View>

          <PressLink onPress={clearFilters}>
            <Text style={styles.clear}>Clear filters</Text>
          </PressLink>
        </View>

        <View style={styles.titleRow}>
          <Text style={styles.title}>Find trades</Text>
          <Text style={styles.titleMeta}>LOCAL SCREENER</Text>
        </View>

        <Text style={styles.subtitle}>Search sample filings by company, action, role, or value.</Text>

        <Animated.View
          style={[
            styles.inputWrap,
            {
              borderColor: borderAnim.interpolate({
                inputRange: [0.27, 0.56],
                outputRange: ['rgba(115,217,255,0.27)', 'rgba(115,217,255,0.56)'],
              }),
            },
          ]}
        >
          <Ionicons name="search-outline" size={18} color={colors.accent} />
          <TextInput
            accessibilityLabel="Search by ticker or company"
            value={query}
            onChangeText={setQuery}
            placeholder="Search ticker or company"
            placeholderTextColor={colors.subtle}
            style={styles.input}
            onFocus={onFocus}
            onBlur={onBlur}
          />
        </Animated.View>

        <FadeInView delay={0}>
          <Text style={styles.groupTitle}>Transaction type</Text>
          <View style={styles.chipRow}>
            <FilterChip label="All" active={!type} onPress={() => setType(null)} />
            <FilterChip label="Purchases" active={type === 'Purchase'} onPress={() => setType(type === 'Purchase' ? null : 'Purchase')} />
            <FilterChip label="Sales" active={type === 'Sale'} onPress={() => setType(type === 'Sale' ? null : 'Sale')} />
          </View>
        </FadeInView>

        <FadeInView delay={50}>
          <Text style={styles.groupTitle}>Insider role</Text>
          <View style={styles.chipRow}>
            <FilterChip label="All roles" active={!role} onPress={() => setRole(null)} />
            {(['CEO', 'CFO', 'Director'] as InsiderRole[]).map((item) => (
              <FilterChip
                key={item}
                label={item}
                active={role === item}
                onPress={() => setRole(role === item ? null : item)}
              />
            ))}
          </View>
        </FadeInView>

        <FadeInView delay={100}>
          <Text style={styles.groupTitle}>Value threshold</Text>
          <View style={styles.chipRow}>
            {(['Any', '$100K+', '$500K+', '$1M+'] as Threshold[]).map((item) => (
              <FilterChip
                key={item}
                label={item}
                active={(item === 'Any' && !threshold) || threshold === item}
                onPress={() => setThreshold(item === 'Any' || threshold === item ? null : item)}
              />
            ))}
          </View>
        </FadeInView>

        <View style={styles.resultsRow}>
          <Text style={styles.resultCount}>
            {filteredTrades.length} {filteredTrades.length === 1 ? 'result' : 'results'}
          </Text>
          <Text style={styles.demoLabel}>FICTIONAL DEMO DATA</Text>
        </View>

        {filteredTrades.length ? (
          filteredTrades.map((trade, index) => (
            <FadeInView key={trade.id} delay={index * 50}>
              <TradeCard trade={trade} onPress={() => navigation.navigate('Details', { tradeId: trade.id })} />
            </FadeInView>
          ))
        ) : (
          // If the current filter set has no matches, give the user an easy reset path.
          <View style={styles.empty}>
            <Ionicons name="scan-outline" size={34} color={colors.subtle} />
            <Text style={styles.emptyTitle}>No fictional demo trades match those filters.</Text>
            <Text style={styles.emptyCopy}>Try a broader search or clear one of the filters.</Text>
            <PressLink onPress={clearFilters}>
              <View style={styles.reset}>
                <Text style={styles.resetText}>Clear filters</Text>
              </View>
            </PressLink>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.shell },
  content: { paddingHorizontal: spacing(2.5), paddingTop: spacing(2), paddingBottom: spacing(4) },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  title: { color: colors.text, fontSize: 24, fontWeight: '900' },
  titleMeta: { color: colors.subtle, fontSize: 9, fontWeight: '900', letterSpacing: 1.2 },
  clear: { color: colors.accent, fontSize: 12, fontWeight: '800' },
  subtitle: { color: colors.muted, fontSize: 13, marginTop: 8, lineHeight: 19 },
  inputWrap: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderTopWidth: 0.5,
    borderTopColor: colors.cardHighlight,
    borderRadius: 14,
    paddingHorizontal: 14,
  },
  input: { flex: 1, color: colors.text, fontSize: 14, paddingVertical: 14, fontWeight: '600' },
  groupTitle: {
    color: colors.subtle,
    textTransform: 'uppercase',
    letterSpacing: 1.1,
    fontSize: 11,
    fontWeight: '800',
    marginTop: 23,
    marginBottom: 10,
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap' },
  resultsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 23,
    marginBottom: 12,
  },
  resultCount: { color: colors.text, fontSize: 14, fontWeight: '900' },
  demoLabel: { color: colors.subtle, fontSize: 9, letterSpacing: 1.2, fontWeight: '900' },
  empty: {
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingVertical: 55,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 16,
    backgroundColor: colors.surface,
  },
  emptyTitle: { color: colors.text, textAlign: 'center', fontSize: 15, fontWeight: '800', marginTop: 13 },
  emptyCopy: { color: colors.muted, textAlign: 'center', fontSize: 12, marginTop: 7, lineHeight: 18 },
  reset: {
    marginTop: 18,
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  resetText: { color: colors.ink, fontWeight: '900', fontSize: 12 },
});
