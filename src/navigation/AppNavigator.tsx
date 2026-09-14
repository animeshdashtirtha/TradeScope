import { Ionicons } from '@expo/vector-icons';
import { BottomTabScreenProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/HomeScreen';
import { ScreenerScreen } from '../screens/ScreenerScreen';
import { TradeDetailsScreen } from '../screens/TradeDetailsScreen';
import { colors } from '../theme/colors';

export type TabParamList = { Home: undefined; FindTrades: undefined };
export type RootStackParamList = { MainTabs: undefined; Details: { tradeId: string } };
export type AppScreenProps<T extends keyof TabParamList> = CompositeScreenProps<BottomTabScreenProps<TabParamList, T>, NativeStackScreenProps<RootStackParamList>>;

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tabs = createBottomTabNavigator<TabParamList>();

function MainTabs() {
  return <Tabs.Navigator screenOptions={({ route }) => ({
    headerShown: false,
    tabBarActiveTintColor: colors.accent,
    tabBarInactiveTintColor: colors.subtle,
    tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border, height: 64, paddingTop: 8 },
    tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
    tabBarIcon: ({ color, size }) => <Ionicons name={route.name === 'Home' ? 'home-outline' : 'funnel-outline'} color={color} size={size} />,
  })}>
    <Tabs.Screen name="Home" component={HomeScreen} options={{ title: 'Overview' }} />
    <Tabs.Screen name="FindTrades" component={ScreenerScreen} options={{ title: 'Find trades' }} />
  </Tabs.Navigator>;
}

export function AppNavigator() {
  return <NavigationContainer><Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.shell } }}>
    <Stack.Screen name="MainTabs" component={MainTabs} />
    <Stack.Screen name="Details" component={TradeDetailsScreen} />
  </Stack.Navigator></NavigationContainer>;
}