import React from 'react';
import {
  View, TouchableOpacity, Text, StyleSheet, Platform,
} from 'react-native';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { colors } from '../../src/theme';

/* ── Tab definitions ─────────────────────────────────────────── */
type TabDef = {
  name: string;
  label: string;
  icon: (focused: boolean) => React.ReactNode;
};

const TABS: TabDef[] = [
  {
    name: 'index',
    label: 'Home',
    icon: (f) => <Ionicons name={f ? 'home' : 'home-outline'} size={22} color={f ? colors.green2 : colors.textThird} />,
  },
  {
    name: 'missions',
    label: 'Missions',
    icon: (f) => <MaterialCommunityIcons name="satellite-variant" size={22} color={f ? colors.green2 : colors.textThird} />,
  },
  {
    name: 'centres',
    label: 'Centres',
    icon: (f) => <FontAwesome5 name="flask" size={19} color={f ? colors.green2 : colors.textThird} />,
  },
   {
    name: 'news',
    label: 'News',
    icon: (f) => <Ionicons name={f ? 'newspaper' : 'newspaper-outline'} size={22} color={f ? colors.green2 : colors.textThird} />,
  },
  {
    name: 'staff',
    label: 'Staff',
    icon: (f) => <Ionicons name={f ? 'lock-closed' : 'lock-closed-outline'} size={21} color={f ? colors.green2 : colors.textThird} />,
  },
  {
    name: 'nai',
    label: 'NASRDA AI',
    icon: (f) => <Ionicons name={f ? 'hardware-chip' : 'hardware-chip-outline'} size={21} color={f ? colors.green2 : colors.textThird} />,
  },
];

/* ── Custom tab bar ──────────────────────────────────────────── */
function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[st.tabBar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      {/* top border accent */}
      <View style={st.topAccent} />

      {state.routes.map((route: any, i: number) => {
        const focused = state.index === i;
        const tab = TABS[i];

        return (
          <TouchableOpacity
            key={route.key}
            style={st.tabItem}
            onPress={() => navigation.navigate(route.name)}
            activeOpacity={0.7}
          >
            <View style={[st.iconWrap, focused && st.iconWrapActive]}>
              {tab.icon(focused)}
            </View>
            <Text style={[st.tabLabel, focused && st.tabLabelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

/* ── Navigator ───────────────────────────────────────────────── */
export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index"    options={{ title: 'Home' }} />
      <Tabs.Screen name="missions" options={{ title: 'Missions' }} />
      <Tabs.Screen name="centres"  options={{ title: 'Centres' }} />
      <Tabs.Screen name="news"     options={{ title: 'News' }} />
      <Tabs.Screen name="staff"    options={{ title: 'Staff' }} />
      <Tabs.Screen name="nai"      options={{ title: 'AI' }} />
    </Tabs>
  );
}

const st = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#0A1A35',
    borderTopWidth: 0,
    ...Platform.select({
      ios:     { shadowColor: '#000', shadowOpacity: 0.4, shadowRadius: 12, shadowOffset: { width: 0, height: -4 } },
      android: { elevation: 16 },
    }),
  },
  topAccent: {
    // position: 'absolute',
    // top: 0, left: 0, right: 0,
    // height: 1,
    // backgroundColor: 'rgba(0,192,96,0.3)',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    paddingBottom: 4,
    gap: 4,
  },
  iconWrap: {
    width: 36, height: 36,
    alignItems: 'center', justifyContent: 'center',
    borderRadius: 10,
  },
  iconWrapActive: {
    backgroundColor: 'rgba(0,192,96,0.12)',
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textThird,
    letterSpacing: 0.2,
  },
  tabLabelActive: {
    color: colors.green2,
  },
});