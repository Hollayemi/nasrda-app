import React, { useEffect, useRef } from 'react';
import {
  View, Text, Image, ScrollView, TouchableOpacity,
  Animated, StyleSheet, Dimensions, StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../src/theme';
import { NASRDA_LOGO_URI } from '../src/components/NavLogo';

const { width } = Dimensions.get('window');
const LOGO = { uri: NASRDA_LOGO_URI };

const OrbitRing: React.FC<{
  size: number; borderColor: string; dashed?: boolean;
  dotColor: string; duration: number; reverse?: boolean;
}> = ({ size, borderColor, dashed, dotColor, duration, reverse }) => {
  const rot = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.timing(rot, { toValue: 1, duration, useNativeDriver: true })
    ).start();
  }, []);
  const rotate = rot.interpolate({
    inputRange: [0, 1],
    outputRange: reverse ? ['360deg', '0deg'] : ['0deg', '360deg'],
  });
  return (
    <View style={{ position: 'absolute', width: size, height: size,
                   borderRadius: size / 2, borderWidth: 1.5,
                   borderColor, borderStyle: dashed ? 'dashed' : 'solid',
                   alignItems: 'center', justifyContent: 'flex-start' }}>
      <Animated.View style={{ width: size, height: size,
                              position: 'absolute', alignItems: 'center',
                              transform: [{ rotate }] }}>
        <View style={{ width: 10, height: 10, borderRadius: 5, marginTop: -5,
                       backgroundColor: dotColor,
                       shadowColor: dotColor, shadowOpacity: 0.9,
                       shadowRadius: 6, shadowOffset: { width:0, height:0 } }} />
      </Animated.View>
    </View>
  );
};

/* ─── Pulsing glow ──────────────────────────────────────────── */
const PulsingGlow: React.FC = () => {
  const s = useRef(new Animated.Value(1)).current;
  const o = useRef(new Animated.Value(0.4)).current;
  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.parallel([
        Animated.timing(s, { toValue: 1.55, duration: 1800, useNativeDriver: true }),
        Animated.timing(o, { toValue: 0.9,  duration: 1800, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(s, { toValue: 1,    duration: 1800, useNativeDriver: true }),
        Animated.timing(o, { toValue: 0.4,  duration: 1800, useNativeDriver: true }),
      ]),
    ])).start();
  }, []);
  return (
    <Animated.View style={{
      position: 'absolute', width: 120, height: 120, borderRadius: 60,
      backgroundColor: 'rgba(0,166,81,0.1)',
      transform: [{ scale: s }], opacity: o,
    }} />
  );
};

/* ─── Spinning colour ring ──────────────────────────────────── */
const SpinRing: React.FC = () => {
  const rot = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.timing(rot, { toValue: 1, duration: 8000, useNativeDriver: true })
    ).start();
  }, []);
  const rotate = rot.interpolate({ inputRange:[0,1], outputRange:['0deg','360deg'] });
  return (
    <Animated.View style={{
      position: 'absolute', width: 104, height: 104, borderRadius: 52,
      borderWidth: 3,
      borderTopColor: colors.green2,
      borderRightColor: colors.sky,
      borderBottomColor: colors.gold,
      borderLeftColor: colors.green,
      transform: [{ rotate }],
    }} />
  );
};

/* ─── Live blink dot ────────────────────────────────────────── */
const BlinkDot: React.FC = () => {
  const o = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(o, { toValue: 0.1, duration: 500, useNativeDriver: true }),
      Animated.timing(o, { toValue: 1,   duration: 500, useNativeDriver: true }),
    ])).start();
  }, []);
  return <Animated.View style={{ width:5, height:5, borderRadius:2.5,
                                  backgroundColor: colors.green2, opacity: o }} />;
};

/* ─── Star field ─────────────────────────────────────────────── */
const Stars: React.FC = () => {
  const stars = useRef(
    Array.from({ length: 60 }, (_, i) => ({
      key: i,
      left:    Math.random() * 100,
      top:     Math.random() * 100,
      size:    Math.random() * 1.8 + 0.3,
      opacity: Math.random() * 0.7 + 0.2,
    }))
  ).current;
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {stars.map(s => (
        <View key={s.key} style={{
          position: 'absolute',
          left: `${s.left}%`, top: `${s.top}%`,
          width: s.size, height: s.size,
          borderRadius: s.size / 2,
          backgroundColor: '#fff', opacity: s.opacity,
        }} />
      ))}
    </View>
  );
};

/* ─── HomeScreen ────────────────────────────────────────────── */
export const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  const news = [
    { icon:'👥', tag:'EMPOWERMENT', title:'NASRDA Leads the Drive for Youth Empowerment', date:'May 2025', screen:'News' },
    { icon:'🌍', tag:'INNOVATION',  title:"Nigeria Deepens its Footprint in Space Innovation", date:'Apr 2025', screen:'News' },
    { icon:'🔬', tag:'CENTRES & LABS', title:'12 Activity Centres Across Nigeria', date:'Explore →', screen:'Centres' },
  ];

  return (
    <View style={[st.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* ── Hero ── */}
      <View style={st.hero}>
        <Stars />

        {/* Bell / Search */}
        <View style={st.topBar}>
          <Text style={st.topBarIcon}>🔔</Text>
          <Text style={st.topBarIcon}>🔍</Text>
        </View>

        {/* Orbit system */}
        <View style={st.orbitWrap}>
          <PulsingGlow />
          <OrbitRing size={240} borderColor="rgba(0,166,81,0.3)"  dotColor={colors.green2} duration={9000} />
          <OrbitRing size={186} borderColor="rgba(79,195,247,0.2)" dotColor={colors.gold}   duration={5500} reverse />
          <OrbitRing size={132} borderColor="rgba(245,168,0,0.22)" dotColor={colors.sky}    duration={13000} dashed />
          <SpinRing />
          {/* WHITE disc — logo renders with true colours */}
          <View style={st.logoDisc}>
            <Image source={LOGO} style={st.logoImg} resizeMode="contain" />
          </View>
        </View>

        {/* Agency name */}
        <View style={st.heroText}>
          <Text style={st.agencyName}>NATIONAL SPACE RESEARCH{'\n'}& DEVELOPMENT AGENCY</Text>
          <Text style={st.agencySub}>NIGERIA · EST. 1999</Text>
          <View style={st.liveBadge}>
            <BlinkDot />
            <Text style={st.liveText}>NigeriaSAT-2 IN ORBIT</Text>
          </View>
        </View>
      </View>

      {/* ── News feed below hero ── */}
      <ScrollView style={st.feed} showsVerticalScrollIndicator={false}>
        <View style={st.sectionHdr}>
          <Text style={st.sectionTitle}>Featured News</Text>
          <TouchableOpacity onPress={() => navigation.navigate('News')}>
            <Text style={st.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        {/* Top featured card */}
        <TouchableOpacity style={st.featCard} onPress={() => navigation.navigate('News')}>
          <View style={st.featBody}>
            <View style={st.featIcon}><Text style={{ fontSize: 20 }}>🤝</Text></View>
            <View style={{ flex: 1 }}>
              <View style={st.tag}><Text style={st.tagTxt}>PARTNERSHIP</Text></View>
              <Text style={st.featTitle} numberOfLines={2}>
                NASRDA & DSA Strengthen Nigeria's Space Ecosystem
              </Text>
              <Text style={st.featMeta}>June 2025 · 3 min read</Text>
            </View>
            <Text style={{ color: colors.textThird, fontSize: 18 }}>›</Text>
          </View>
        </TouchableOpacity>

        {/* Compact rows */}
        {news.map((n, i) => (
          <TouchableOpacity key={i} style={st.newsRow}
            onPress={() => navigation.navigate(n.screen)}>
            <View style={st.newsIcon}><Text style={{ fontSize: 15 }}>{n.icon}</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={st.newsTag}>{n.tag}</Text>
              <Text style={st.newsTitle} numberOfLines={2}>{n.title}</Text>
              <Text style={st.newsDate}>{n.date}</Text>
            </View>
          </TouchableOpacity>
        ))}

        <View style={{ height: 110 }} />
      </ScrollView>
    </View>
  );
};

const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.navy },

  /* Hero */
  hero: {
    height: 420, backgroundColor: colors.navy2,
    alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
  },
  topBar: {
    position: 'absolute', top: 6, right: 18,
    flexDirection: 'row', gap: 18, zIndex: 10,
  },
  topBarIcon: { fontSize: 20, color: 'rgba(232,240,248,0.75)' },

  /* Orbit */
  orbitWrap: {
    width: 260, height: 260,
    alignItems: 'center', justifyContent: 'center',
    marginTop: -20,
  },
  logoDisc: {
    position: 'absolute',
    width: 96, height: 96, borderRadius: 48,
    backgroundColor: '#FFFFFF',          // pure white — logo colours show true
    alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#fff', shadowOpacity: 0.5,
    shadowRadius: 16, shadowOffset: { width: 0, height: 0 },
    elevation: 12,
  },
  logoImg: { width: 82, height: 82 },    // large enough to read clearly

  /* Hero text */
  heroText: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingBottom: 16, alignItems: 'center', gap: 5,
  },
  agencyName: {
    fontSize: 11, fontWeight: '800', color: colors.offwhite,
    letterSpacing: 2, textAlign: 'center', lineHeight: 17,
  },
  agencySub: { fontSize: 9, color: colors.textSecond, letterSpacing: 1 },
  liveBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(0,192,96,0.12)',
    borderWidth: 0.5, borderColor: 'rgba(0,192,96,0.35)',
    borderRadius: 4, paddingHorizontal: 10, paddingVertical: 3,
  },
  liveText: { fontSize: 9, fontWeight: '700', color: colors.green2, letterSpacing: 0.5 },

  /* Feed */
  feed: { flex: 1, backgroundColor: colors.navy },
  sectionHdr: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingTop: 14, paddingBottom: 10,
  },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#fff' },
  seeAll: { fontSize: 12, fontWeight: '600', color: colors.green2 },

  featCard: {
    marginHorizontal: 16, marginBottom: 10,
    borderRadius: 14, backgroundColor: colors.card,
    borderWidth: 1, borderColor: colors.borderGreen, overflow: 'hidden',
  },
  featBody: { padding: 12, flexDirection: 'row', gap: 12, alignItems: 'center' },
  featIcon: {
    width: 44, height: 44, borderRadius: 10,
    backgroundColor: 'rgba(0,166,81,0.15)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(0,166,81,0.18)',
  },
  tag: {
    backgroundColor: colors.green, borderRadius: 3,
    paddingHorizontal: 7, paddingVertical: 2,
    alignSelf: 'flex-start', marginBottom: 4,
  },
  tagTxt: { fontSize: 8, fontWeight: '800', color: '#fff', letterSpacing: 1 },
  featTitle: { fontSize: 12, fontWeight: '700', color: '#fff', lineHeight: 17 },
  featMeta: { fontSize: 10, color: colors.textThird, marginTop: 3 },

  newsRow: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    paddingVertical: 10, paddingHorizontal: 16,
    borderBottomWidth: 1, borderBottomColor: 'rgba(79,195,247,0.07)',
  },
  newsIcon: {
    width: 34, height: 34, borderRadius: 8,
    backgroundColor: 'rgba(0,166,81,0.09)',
    borderWidth: 1, borderColor: 'rgba(0,166,81,0.14)',
    alignItems: 'center', justifyContent: 'center', marginTop: 2,
  },
  newsTag: { fontSize: 8, fontWeight: '800', letterSpacing: 1, color: colors.gold, marginBottom: 3 },
  newsTitle: { fontSize: 12, fontWeight: '600', color: colors.textPrimary, lineHeight: 17 },
  newsDate: { fontSize: 9, color: colors.textThird, marginTop: 3 },
});
