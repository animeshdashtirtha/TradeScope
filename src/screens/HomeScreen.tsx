import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TradeCard } from '../components/TradeCard';
import { SummaryCard } from '../components/SummaryCard';
import { SignalBadge } from '../components/SignalBadge';
import { BrandLockup } from '../components/BrandLockup';
import { FadeInView } from '../components/FadeInView';
import { PressLink, PressScale } from '../components/Pressables';
import { mockTrades } from '../data/mockTrades';
import { AppScreenProps } from '../navigation/AppNavigator';
import { colors, spacing } from '../theme/colors';
import { formatCurrency } from '../utils/formatters';
import { SignalStrength } from '../types/trade';

type Props = AppScreenProps<'Home'>;

export function HomeScreen({ navigation }: Props) {
  // Split the sample trades into buys and sells so the dashboard can summarize the flow clearly.
  const purchases = mockTrades.filter((trade) => trade.type === 'Purchase');
  const sales = mockTrades.filter((trade) => trade.type === 'Sale');

  // Totals help explain how active the market snapshot is at a glance.
  const purchaseValue = purchases.reduce((sum, trade) => sum + trade.value, 0);
  const saleValue = sales.reduce((sum, trade) => sum + trade.value, 0);

  const strengthCounts = mockTrades.reduce<Record<SignalStrength, number>>(
    (counts, trade) => ({
      ...counts,
      [trade.signalStrength]: (counts[trade.signalStrength] ?? 0) + 1,
    }),
    { High: 0, Medium: 0, Low: 0 },
  );

  // A few quick metrics make the dashboard feel useful without turning it into a full analytics view.
  const purchaseShare = Math.round((purchases.length / mockTrades.length) * 100);
  const largestPurchase = [...purchases].sort((first, second) => second.value - first.value)[0] ?? mockTrades[0];
  const largestSale = [...sales].sort((first, second) => second.value - first.value)[0] ?? mockTrades[0];

  const strengthRank: Record<SignalStrength, number> = { High: 3, Medium: 2, Low: 1 };
  const strongestCeoSignal = [...mockTrades]
    .filter((trade) => trade.role === 'CEO')
    .sort((first, second) => strengthRank[second.signalStrength] - strengthRank[first.signalStrength])[0] ?? mockTrades[0];

  const topSignals = [
    { label: 'Largest purchase', trade: largestPurchase },
    { label: 'Largest sale', trade: largestSale },
    { label: 'Strongest CEO signal', trade: strongestCeoSignal },
  ];

  const signalLevels = [
    ['High', colors.accent],
    ['Medium', colors.watch],
    ['Low', colors.subtle],
  ] as const;

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <BrandLockup />

          <Text style={styles.title}>Market Pulse</Text>

          <View style={styles.live}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>DEMO MODE</Text>
          </View>
        </View>

        <View style={styles.demoBadge}>
          <Ionicons name="sparkles-outline" size={14} color={colors.accent} />
          <Text style={styles.demoText}>Fictional sample data · static for this demo</Text>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Search sample trades"
          onPress={() => navigation.navigate('FindTrades')}
          style={styles.search}
        >
          <Ionicons name="search-outline" size={19} color={colors.subtle} />
          <Text style={styles.searchPlaceholder}>Search ticker or company</Text>
          <Ionicons name="arrow-forward" size={17} color={colors.accent} />
        </Pressable>

        <View style={styles.sectionHeading}>
          <Text style={styles.sectionTitle}>Market overview</Text>
          <Text style={styles.sectionMeta}>{mockTrades.length} sample filings</Text>
        </View>

        <FadeInView delay={0}>
          <View style={styles.summaryRow}>
            <SummaryCard label="Total transactions" value={`${mockTrades.length}`} accent={colors.accent} delay={0} />
            <SummaryCard label="Purchase value" value={formatCurrency(purchaseValue, true)} accent={colors.purchase} delay={100} />
            <SummaryCard label="Sale value" value={formatCurrency(saleValue, true)} accent={colors.sale} delay={200} />
          </View>
        </FadeInView>

        <FadeInView delay={100}>
          <View style={styles.signalLine}>
            <View>
              <Text style={styles.signalLabel}>Activity mix</Text>
              <Text style={styles.signalValue}>
                Purchase activity <Text style={styles.signalAccent}>↗ {purchaseShare}%</Text>
              </Text>
            </View>

            <View style={styles.signalTrack}>
              <View style={[styles.signalFill, { width: `${purchaseShare}%` }]} />
            </View>
          </View>
        </FadeInView>

        <FadeInView delay={180}>
          <View style={styles.categoryRow}>
            {signalLevels.map(([label, accent]) => (
              <View key={label} style={styles.category}>
                <View style={[styles.categoryDot, { backgroundColor: accent }]} />
                <Text style={styles.categoryLabel}>{label} strength</Text>
                <Text style={styles.categoryValue}>{strengthCounts[label as SignalStrength] ?? 0}</Text>
              </View>
            ))}
          </View>
        </FadeInView>

        <View style={styles.sectionHeading}>
          <Text style={styles.sectionTitle}>Top signals</Text>
          <Text style={styles.sectionMeta}>By sample data</Text>
        </View>

        {topSignals.map(({ label, trade }, index) => (
          <FadeInView key={label} delay={index * 50}>
            <PressScale onPress={() => navigation.navigate('Details', { tradeId: trade.id })}>
              <View style={styles.signalCard}>
                <View style={styles.signalCardAccent} />

                <View style={styles.signalCardBody}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.signalCardSignal}>{trade.signal}</Text>
                    <Text style={styles.signalCardCompany}>{trade.ticker} · {trade.company}</Text>
                    <Text style={styles.signalCardMeta}>
                      {trade.insider} · {trade.role} · {formatCurrency(trade.value, true)}
                    </Text>
                  </View>

                  <View style={styles.signalCardSide}>
                    <SignalBadge signalStrength={trade.signalStrength} />
                    <Ionicons name="chevron-forward" size={16} color={colors.subtle} />
                  </View>
                </View>
              </View>
            </PressScale>
          </FadeInView>
        ))}

        <View style={[styles.sectionHeading, { marginTop: 30 }]}>
          <Text style={styles.sectionTitle}>Latest activity</Text>
          <PressLink onPress={() => navigation.navigate('FindTrades')}>
            <Text style={styles.viewAll}>View all</Text>
          </PressLink>
        </View>

        {mockTrades.slice(0, 4).map((trade, index) => (
          <FadeInView key={trade.id} delay={index * 50}>
            <TradeCard trade={trade} onPress={() => navigation.navigate('Details', { tradeId: trade.id })} />
          </FadeInView>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.shell },
  content: { paddingHorizontal: spacing(2.5), paddingTop: spacing(2), paddingBottom: spacing(4) },
  header: { gap: 6 },
  title: { color: colors.text, fontSize: 30, fontWeight: '900', marginTop: 2 },
  live: {
    borderWidth: 1,
    borderColor: `${colors.purchase}55`,
    borderRadius: 99,
    paddingHorizontal: 10,
    paddingVertical: 7,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: `${colors.purchase}0D`,
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.purchase },
  liveText: { color: colors.purchase, fontSize: 10, fontWeight: '900' },
  demoBadge: {
    flexDirection: 'row',
    gap: 7,
    alignItems: 'center',
    backgroundColor: `${colors.accent}12`,
    borderRadius: 10,
    padding: 10,
    marginTop: 18,
    borderWidth: 1,
    borderColor: `${colors.accent}25`,
  },
  demoText: { color: colors.accent, fontSize: 11, fontWeight: '700' },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 15,
    marginTop: 14,
    backgroundColor: colors.surfaceRaised,
    borderRadius: 14,
    borderColor: `${colors.accent}45`,
    borderWidth: 1,
    borderTopColor: colors.cardHighlight,
    borderTopWidth: 0.5,
  },
  searchPlaceholder: { flex: 1, color: colors.muted, fontSize: 14, fontWeight: '600' },
  sectionHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginTop: 30,
    marginBottom: 14,
  },
  sectionTitle: { color: colors.text, fontSize: 18, fontWeight: '800' },
  sectionMeta: { color: colors.subtle, fontSize: 11, fontWeight: '600' },
  summaryRow: { flexDirection: 'row', gap: 10 },
  signalLine: {
    marginTop: 16,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 15,
    borderColor: colors.border,
    borderTopColor: colors.cardHighlight,
    borderTopWidth: 0.5,
    borderWidth: 1,
  },
  signalLabel: { color: colors.subtle, fontSize: 10, textTransform: 'uppercase', letterSpacing: 1 },
  signalValue: { color: colors.text, fontSize: 14, fontWeight: '800', marginTop: 5 },
  signalAccent: { color: colors.purchase },
  signalTrack: { height: 9, backgroundColor: colors.surfaceRaised, borderRadius: 999, marginTop: 12, overflow: 'hidden' },
  signalFill: { height: '100%', backgroundColor: colors.purchase, borderRadius: 999 },
  categoryRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16, gap: 10, minWidth: 0 },
  category: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 9,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryDot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  categoryLabel: { flexShrink: 1, minWidth: 0, color: colors.text, fontSize: 11, fontWeight: '700' },
  categoryValue: { marginLeft: 6, color: colors.text, fontSize: 11, fontWeight: '800' },
  signalCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderTopColor: colors.cardHighlight,
    borderTopWidth: 0.5,
    borderColor: colors.border,
    overflow: 'hidden',
    marginBottom: 12,
  },
  signalCardAccent: { width: 5, backgroundColor: colors.accent },
  signalCardBody: { flex: 1, flexDirection: 'row', alignItems: 'center', padding: spacing(2), minWidth: 0 },
  signalCardSignal: { color: colors.text, fontSize: 14, fontWeight: '800' },
  signalCardCompany: { color: colors.muted, fontSize: 12, marginTop: 4 },
  signalCardMeta: { color: colors.subtle, fontSize: 11, marginTop: 6 },
  signalCardSide: { flexShrink: 0, alignItems: 'center', justifyContent: 'center', gap: 8, marginLeft: 10 },
  viewAll: { color: colors.accent, fontSize: 12, fontWeight: '800' },
});
