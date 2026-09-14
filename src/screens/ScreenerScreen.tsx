import { Ionicons } from '@expo/vector-icons';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { FilterChip } from '../components/FilterChip';
import { TradeCard } from '../components/TradeCard';
import { mockTrades } from '../data/mockTrades';
import { AppScreenProps } from '../navigation/AppNavigator';
import { colors } from '../theme/colors';
import { InsiderRole, TransactionType } from '../types/trade';

type Props = AppScreenProps<'FindTrades'>;
type Threshold = 'Under $300K' | '$300K–$500K' | 'Over $500K';

export function ScreenerScreen({ navigation }: Props) {
  const [query, setQuery] = React.useState('');
  const [type, setType] = React.useState<TransactionType | null>(null);
  const [role, setRole] = React.useState<InsiderRole | null>(null);
  const [threshold, setThreshold] = React.useState<Threshold | null>(null);
  const result = mockTrades.filter((trade) => { const matchesQuery = `${trade.ticker} ${trade.company}`.toLowerCase().includes(query.toLowerCase()); const matchesType = !type || trade.type === type; const matchesRole = !role || trade.role === role; const matchesThreshold = !threshold || (threshold === 'Under $300K' ? trade.value < 300000 : threshold === '$300K–$500K' ? trade.value >= 300000 && trade.value <= 500000 : trade.value > 500000); return matchesQuery && matchesType && matchesRole && matchesThreshold; });
  const clear = () => { setQuery(''); setType(null); setRole(null); setThreshold(null); };
  return <SafeAreaView style={styles.safe}><ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
    <View style={styles.top}><Pressable accessibilityLabel="Go back" onPress={() => navigation.goBack()} style={styles.iconButton}><Ionicons name="arrow-back" size={20} color={colors.text} /></Pressable><Text style={styles.title}>Find trades</Text><Pressable accessibilityRole="button" accessibilityLabel="Clear all filters" onPress={clear}><Text style={styles.clear}>Clear filters</Text></Pressable></View>
    <Text style={styles.subtitle}>Search sample filings by company, action, role, or value.</Text>
    <View style={styles.inputWrap}><Ionicons name="search-outline" size={18} color={colors.subtle} /><TextInput accessibilityLabel="Search by ticker or company" value={query} onChangeText={setQuery} placeholder="Search ticker or company" placeholderTextColor={colors.subtle} style={styles.input} /></View>
    <Text style={styles.groupTitle}>Trade action</Text><ScrollView horizontal showsHorizontalScrollIndicator={false}><FilterChip label="All actions" active={!type} onPress={() => setType(null)} /><FilterChip label="Purchase" active={type === 'Purchase'} onPress={() => setType(type === 'Purchase' ? null : 'Purchase')} /><FilterChip label="Sale" active={type === 'Sale'} onPress={() => setType(type === 'Sale' ? null : 'Sale')} /></ScrollView>
    <Text style={styles.groupTitle}>Insider role</Text><ScrollView horizontal showsHorizontalScrollIndicator={false}>{(['CEO', 'CFO', 'Director', 'Officer'] as InsiderRole[]).map((item) => <FilterChip key={item} label={item} active={role === item} onPress={() => setRole(role === item ? null : item)} />)}</ScrollView>
    <Text style={styles.groupTitle}>Trade value</Text><ScrollView horizontal showsHorizontalScrollIndicator={false}>{(['Under $300K', '$300K–$500K', 'Over $500K'] as Threshold[]).map((item) => <FilterChip key={item} label={item} active={threshold === item} onPress={() => setThreshold(threshold === item ? null : item)} />)}</ScrollView>
    <View style={styles.resultsRow}><Text style={styles.resultCount}>{result.length} matching {result.length === 1 ? 'trade' : 'trades'}</Text><Text style={styles.demoLabel}>DEMO DATA</Text></View>
    {result.length ? result.map((trade) => <TradeCard key={trade.id} trade={trade} onPress={() => navigation.navigate('Details', { tradeId: trade.id })} />) : <View style={styles.empty}><Ionicons name="scan-outline" size={34} color={colors.subtle} /><Text style={styles.emptyTitle}>No fictional demo trades match those filters</Text><Text style={styles.emptyCopy}>Try a broader search or clear one of the filters.</Text><Pressable accessibilityRole="button" accessibilityLabel="Reset filters" onPress={clear} style={styles.reset}><Text style={styles.resetText}>Reset filters</Text></Pressable></View>}
  </ScrollView></SafeAreaView>;
}

import * as React from 'react';
const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: colors.shell }, content: { padding: 20, paddingTop: 16, paddingBottom: 30 }, top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, iconButton: { width: 36, height: 36, borderRadius: 10, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' }, title: { color: colors.text, fontSize: 20, fontWeight: '800' }, clear: { color: colors.accent, fontSize: 12, fontWeight: '700' }, subtitle: { color: colors.muted, fontSize: 13, marginTop: 10 }, inputWrap: { marginTop: 20, flexDirection: 'row', alignItems: 'center', gap: 9, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 14 }, input: { flex: 1, color: colors.text, fontSize: 14, paddingVertical: 13 }, groupTitle: { color: colors.subtle, textTransform: 'uppercase', letterSpacing: 1.1, fontSize: 10, fontWeight: '800', marginTop: 23, marginBottom: 10 }, resultsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 28, marginBottom: 12 }, resultCount: { color: colors.text, fontSize: 14, fontWeight: '800' }, demoLabel: { color: colors.subtle, fontSize: 9, letterSpacing: 1.2, fontWeight: '800' }, empty: { alignItems: 'center', paddingHorizontal: 22, paddingVertical: 55, borderColor: colors.border, borderWidth: 1, borderRadius: 14, backgroundColor: colors.surface }, emptyTitle: { color: colors.text, textAlign: 'center', fontSize: 15, fontWeight: '700', marginTop: 13 }, emptyCopy: { color: colors.muted, textAlign: 'center', fontSize: 12, marginTop: 7 }, reset: { marginTop: 18, backgroundColor: colors.accent, borderRadius: 9, paddingHorizontal: 15, paddingVertical: 10 }, resetText: { color: colors.shell, fontWeight: '800', fontSize: 12 } });