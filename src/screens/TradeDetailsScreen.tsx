import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useRef } from 'react';
import { AccessibilityInfo, Animated, Easing, InteractionManager, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MockActivityChart } from '../components/MockActivityChart';
import { SignalBadge } from '../components/SignalBadge';
import { BrandLockup } from '../components/BrandLockup';
import { FadeInView } from '../components/FadeInView';
import { PressIcon } from '../components/Pressables';
import { mockTrades } from '../data/mockTrades';
import { RootStackParamList } from '../navigation/AppNavigator';
import { colors, spacing } from '../theme/colors';
import { formatCurrency, formatDate, formatDateTime, formatNumber, formatPrice } from '../utils/formatters';

const notFoundStyles = StyleSheet.create({
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28 },
  title: { color: colors.text, fontSize: 22, fontWeight: '900', marginTop: 16 },
  copy: { color: colors.muted, fontSize: 13, lineHeight: 19, marginTop: 8, textAlign: 'center' },
  button: { marginTop: 22, minHeight: 44, paddingHorizontal: 18, borderRadius: 12, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  buttonText: { color: colors.ink, fontSize: 13, fontWeight: '900' },
});

function AnimatedBar({ percent, color, delay = 0 }: { percent: number; color: string; delay?: number }) {
  const animated = useRef(new Animated.Value(0)).current;
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
        animated.setValue(percent);
        return;
      }
      const anim = Animated.timing(animated, {
        toValue: percent,
        duration: 600,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      });
      anim.start();
      return () => anim.stop();
    });
    return () => task.cancel();
  }, [percent, delay, animated]);

  return (
    <View style={styles.strengthTrack}>
      <Animated.View
        style={[
          styles.strengthFill,
          {
            backgroundColor: color,
            width: animated.interpolate({
              inputRange: [0, 100],
              outputRange: ['0%', '100%'],
            }),
          },
        ]}
      />
    </View>
  );
}

type Props = NativeStackScreenProps<RootStackParamList, 'Details'>;
export function TradeDetailsScreen({ route, navigation }: Props) {
  const trade = mockTrades.find((item) => item.id === route.params.tradeId);
  if (!trade) {
    return (
      <SafeAreaView edges={['top', 'right', 'bottom', 'left']} style={styles.safe}>
        <View style={notFoundStyles.notFound}>
          <Ionicons name="document-text-outline" size={36} color={colors.subtle} />
          <Text style={notFoundStyles.title}>Trade not found</Text>
          <Text style={notFoundStyles.copy}>This fictional demo record is no longer available.</Text>
          <PressIcon onPress={() => navigation.goBack()} label="Go back">
            <View style={notFoundStyles.button}>
              <Text style={notFoundStyles.buttonText}>Back to trades</Text>
            </View>
          </PressIcon>
        </View>
      </SafeAreaView>
    );
  }
  const isPurchase = trade.type === 'Purchase';
  const strengthPercent = trade.signalStrength === 'High' ? 88 : trade.signalStrength === 'Medium' ? 62 : 34;
  const whyThisMatters = isPurchase
    ? 'A senior executive purchase can be a data point for further research because it shows a disclosed transaction by someone close to the company. It does not reveal the person\'s full financial situation or predict future performance.'
    : 'A senior executive sale can be a data point for further research because it shows a disclosed transaction by someone close to the company. It does not reveal the person\'s full financial situation or predict future performance.';
  return <SafeAreaView edges={['top', 'right', 'bottom', 'left']} style={styles.safe}><ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
    <View style={[styles.back, { justifyContent: 'space-between', width: '100%' }]}><PressIcon onPress={() => navigation.goBack()} label="Go back"><View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}><Ionicons name="arrow-back" size={21} color={colors.text} /><Text style={styles.backText}>All trades</Text></View></PressIcon><BrandLockup compact /></View>
    <View style={styles.header}><View><Text style={styles.ticker}>{trade.ticker}</Text><Text style={styles.company}>{trade.company}</Text><Text style={styles.sector}>{trade.sector}</Text></View><SignalBadge signalStrength={trade.signalStrength} /></View>
    <View style={styles.badge}><Text style={styles.badgeText}>FICTIONAL DEMO DATA</Text></View>
    <FadeInView delay={0}>
      <View style={[styles.signalCard, { borderColor: `${isPurchase ? colors.purchase : colors.sale}65` }]}><View style={[styles.signalStripe, { backgroundColor: isPurchase ? colors.purchase : colors.sale }]} /><View style={styles.signalCardContent}><View style={styles.signalCardTop}><Text style={styles.signalEyebrow}>SIGNAL SUMMARY</Text><Text style={styles.strength}>{trade.signalStrength} strength</Text></View><Text style={styles.signalTitle}>{trade.signal}</Text><Text style={styles.signalCopy}>{formatCurrency(trade.value, true)} fictional demo insider {isPurchase ? 'buy' : 'sale'} by {trade.insider}, {trade.role}.</Text><AnimatedBar percent={strengthPercent} color={isPurchase ? colors.purchase : colors.sale} delay={300} /></View></View>
    </FadeInView>
    <Text style={styles.sectionTitle}>Trade details</Text>
    <FadeInView delay={100}>
      <View style={styles.grid}>{[['Insider', `${trade.insider} · ${trade.role}`], ['Transaction', `${trade.type} ${isPurchase ? '↑' : '↓'} · Code ${trade.transactionCode}`], ['Shares', `${formatNumber(trade.shares)} shares`], ['Price per share', `${formatPrice(trade.pricePerShare)} (demo)`], ['Total value', `${formatCurrency(trade.value)} (demo)`], ['Transaction date', formatDate(trade.transactionDate)], ['Filed date', formatDateTime(trade.filedAt)], ['Signal strength', `${trade.signalStrength} · ${trade.signal}`]].map(([label, value]) => <View key={label} style={styles.metric}><Text style={styles.metricLabel}>{label}</Text><Text style={styles.metricValue}>{value}</Text></View>)}</View>
    </FadeInView>
    <FadeInView delay={200}>
      <View style={styles.chartHeader}><Text style={styles.sectionTitle}>Mock 7-day activity</Text><Text style={styles.chartMeta}>FICTIONAL VOLUME</Text></View><MockActivityChart />
    </FadeInView>
    <FadeInView delay={300}>
      <View style={styles.context}><Ionicons name="information-circle-outline" size={19} color={colors.accent} /><View style={styles.contextText}><Text style={styles.contextTitle}>Why this matters</Text><Text style={styles.contextCopy}>{whyThisMatters}</Text></View></View>
    </FadeInView>
    <Text style={styles.disclaimer}>LEGAL DISCLAIMER{`\n`}This prototype uses mock data for demonstration only. Insider-trading filings are public disclosures and do not constitute investment advice. Past activity does not guarantee future stock performance.</Text>
  </ScrollView></SafeAreaView>;
}
const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: colors.shell }, content: { paddingHorizontal: spacing(2.5), paddingTop: spacing(2), paddingBottom: spacing(4) }, back: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 26 }, backText: { color: colors.muted, fontSize: 13, fontWeight: '600' }, header: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }, ticker: { color: colors.text, fontSize: 36, fontWeight: '900', letterSpacing: 1 }, company: { color: colors.muted, fontSize: 15, marginTop: 4 }, sector: { color: colors.subtle, fontSize: 11, marginTop: 5 }, badge: { alignSelf: 'flex-start', marginTop: 18, backgroundColor: `${colors.accent}15`, paddingHorizontal: 9, paddingVertical: 6, borderRadius: 7, borderWidth: 1, borderColor: `${colors.accent}25` }, badgeText: { color: colors.accent, fontSize: 9, letterSpacing: 1.1, fontWeight: '900' }, signalCard: { flexDirection: 'row', marginTop: 14, backgroundColor: colors.surface, borderWidth: 1, borderTopWidth: 0.5, borderTopColor: colors.cardHighlight, borderRadius: 16, overflow: 'hidden' }, signalStripe: { width: 5 }, signalCardContent: { flex: 1, padding: spacing(2) }, signalCardTop: { flexDirection: 'row', justifyContent: 'space-between' }, signalEyebrow: { color: colors.subtle, fontSize: 10, fontWeight: '800', letterSpacing: 1.1 }, strength: { color: colors.text, fontSize: 12, fontWeight: '800' }, signalTitle: { color: colors.text, fontSize: 22, fontWeight: '800', marginTop: 12 }, signalCopy: { color: colors.muted, fontSize: 13, lineHeight: 19, marginTop: 7 }, strengthTrack: { height: 6, backgroundColor: colors.surfaceRaised, borderRadius: 3, marginTop: 17 }, strengthFill: { height: '100%', borderRadius: 3 }, sectionTitle: { color: colors.text, fontSize: 18, fontWeight: '800', marginTop: 30, marginBottom: 14 }, grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 2, backgroundColor: colors.border, borderRadius: 14, overflow: 'hidden' }, metric: { flexGrow: 1, flexBasis: '46%', backgroundColor: colors.surface, padding: spacing(2) }, metricLabel: { color: colors.subtle, fontSize: 11, fontWeight: '600' }, metricValue: { color: colors.text, fontSize: 14, fontWeight: '700', marginTop: 4 }, chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }, chartMeta: { color: colors.subtle, fontSize: 9, fontWeight: '900', letterSpacing: 1.1 }, context: { flexDirection: 'row', gap: 10, marginTop: 30, padding: spacing(2), backgroundColor: colors.surface, borderRadius: 16, borderWidth: 1, borderTopWidth: 0.5, borderTopColor: colors.cardHighlight, borderColor: colors.border }, contextText: { flex: 1 }, contextTitle: { color: colors.accent, fontSize: 13, fontWeight: '800' }, contextCopy: { color: colors.muted, fontSize: 12, lineHeight: 18, marginTop: 6 }, disclaimer: { color: colors.subtle, fontSize: 10, lineHeight: 15, marginTop: 26, fontWeight: '600' } }); 
