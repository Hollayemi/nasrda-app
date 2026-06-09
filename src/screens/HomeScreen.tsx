import React, { useEffect, useRef } from 'react';
import {
  View, Text, Image, ScrollView, TouchableOpacity,
  Animated, StyleSheet, StatusBar, Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme';
import { NASRDA_LOGO_URI } from '../components/NavLogo';

const { width } = Dimensions.get('window');
const LOGO = { uri: NASRDA_LOGO_URI };

/* ── Real NASRDA image URLs sourced from central.nasrda.gov.ng ── */
const NASRDA_IMAGES = {
  /** NASRDA + UNDRR/ECHO-ECOWAS partnership meeting, May 2026 */
  undrr:        'https://central.nasrda.gov.ng/wp-content/uploads/2026/05/NASRDA-UNDRR-ECHO-ECOWAS-1-768x546.jpeg',
  /** NASRDA SME / Access Bank commercialisation event, May 2026 */
  sme:          'https://central.nasrda.gov.ng/wp-content/uploads/2026/05/NASRDA-SME-Access-Bank-768x549.jpeg',
  /** NASRDA Headquarters gate, Lugbe Abuja */
  hq:           'https://central.nasrda.gov.ng/wp-content/uploads/2025/04/NASRDA_Gate1.jpg',
  /** DG Dr Matthew Adepoju 3-point agenda briefing */
  dg:           'https://central.nasrda.gov.ng/wp-content/uploads/2025/04/DG-3-point-Agenda-1.jpg',
  /** UNDRR event - group session */
  undrr2:       'https://central.nasrda.gov.ng/wp-content/uploads/2026/05/NASRDA-UNDRR-ECHO-ECOWAS-2-1024x731.jpeg',
  /** UNDRR event - presentation */
  undrr3:       'https://central.nasrda.gov.ng/wp-content/uploads/2026/05/NASRDA-UNDRR-ECHO-ECOWAS-3-1024x731.jpeg',
};

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
    <View style={{
      position: 'absolute', width: size, height: size,
      borderRadius: size / 2, borderWidth: 1.5,
      borderColor, borderStyle: dashed ? 'dashed' : 'solid',
      alignItems: 'center', justifyContent: 'flex-start',
    }}>
      <Animated.View style={{
        width: size, height: size, position: 'absolute',
        alignItems: 'center', transform: [{ rotate }],
      }}>
        <View style={{
          width: 10, height: 10, borderRadius: 5, marginTop: -5,
          backgroundColor: dotColor,
          shadowColor: dotColor, shadowOpacity: 0.9,
          shadowRadius: 6, shadowOffset: { width: 0, height: 0 },
        }} />
      </Animated.View>
    </View>
  );
};

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
      backgroundColor: 'rgba(0,166,81,0.12)',
      transform: [{ scale: s }], opacity: o,
    }} />
  );
};

const SpinRing: React.FC = () => {
  const rot = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.timing(rot, { toValue: 1, duration: 8000, useNativeDriver: true })
    ).start();
  }, []);
  const rotate = rot.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  return (
    <Animated.View style={{
      position: 'absolute', width: 104, height: 104, borderRadius: 52,
      borderWidth: 3,
      borderTopColor:    colors.green2,
      borderRightColor:  colors.sky,
      borderBottomColor: colors.gold,
      borderLeftColor:   colors.green,
      transform: [{ rotate }],
    }} />
  );
};

const BlinkDot: React.FC = () => {
  const o = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(o, { toValue: 0.15, duration: 600, useNativeDriver: true }),
      Animated.timing(o, { toValue: 1,    duration: 600, useNativeDriver: true }),
    ])).start();
  }, []);
  return (
    <Animated.View style={{
      width: 6, height: 6, borderRadius: 3,
      backgroundColor: colors.green2, opacity: o,
    }} />
  );
};

const Stars: React.FC = () => {
  const stars = useRef(
    Array.from({ length: 55 }, (_, i) => ({
      key: i,
      left:    Math.random() * 100,
      top:     Math.random() * 100,
      size:    Math.random() * 1.8 + 0.4,
      opacity: Math.random() * 0.6 + 0.15,
    }))
  ).current;
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {stars.map(s => (
        <View key={s.key} style={{
          position: 'absolute',
          left: `${s.left}%` as any, top: `${s.top}%` as any,
          width: s.size, height: s.size, borderRadius: s.size / 2,
          backgroundColor: '#fff', opacity: s.opacity,
        }} />
      ))}
    </View>
  );
};

/* ── News row type ───────────────────────────────────────────── */
type NewsItem = {
  tag: string;
  title: string;
  date: string;
  route: '/(tabs)/news' | '/(tabs)/centres';
  imageUri: string;
  tagColor: string;
};

/* ─── HomeScreen ────────────────────────────────────────────── */
export const HomeScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const news: NewsItem[] = [
    {
      tag: 'EMPOWERMENT',
      title: 'NASRDA Leads the Drive for Youth Empowerment in Space Technology',
      date: 'May 2025',
      route: '/(tabs)/news',
      imageUri: NASRDA_IMAGES.dg,
      tagColor: colors.sky,
    },
    {
      tag: 'INNOVATION',
      title: 'Nigeria Deepens Footprint in Global Space Innovation',
      date: 'Apr 2025',
      route: '/(tabs)/news',
      imageUri: NASRDA_IMAGES.hq,
      tagColor: colors.gold,
    },
    {
      tag: 'CENTRES & LABS',
      title: '12 Activity Centres Across Nigeria',
      date: 'Explore →',
      route: '/(tabs)/centres',
      imageUri: NASRDA_IMAGES.undrr3,
      tagColor: colors.green2,
    },
  ];

  return (
    <View style={[st.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* ── Hero ── */}
      <View style={st.hero}>
        <Stars />

        {/* Top actions */}
        <View style={st.topBar}>
          <TouchableOpacity style={st.topBtn}>
            <Ionicons name="notifications-outline" size={20} color="rgba(232,240,248,0.8)" />
          </TouchableOpacity>
          <TouchableOpacity style={st.topBtn}>
            <Ionicons name="search-outline" size={20} color="rgba(232,240,248,0.8)" />
          </TouchableOpacity>
        </View>

        {/* Orbit system */}
        <View style={st.orbitWrap}>
          <PulsingGlow />
          <OrbitRing size={240} borderColor="rgba(0,166,81,0.28)"   dotColor={colors.green2} duration={9000} />
          <OrbitRing size={186} borderColor="rgba(79,195,247,0.18)" dotColor={colors.gold}   duration={5500} reverse />
          <OrbitRing size={132} borderColor="rgba(245,168,0,0.2)"   dotColor={colors.sky}    duration={13000} dashed />
          <SpinRing />
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

      {/* ── News feed ── */}
      <ScrollView
        style={st.feed}
        contentContainerStyle={st.feedContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Section header */}
        <View style={st.sectionHdr}>
          <Text style={st.sectionTitle}>Featured News</Text>
          <TouchableOpacity
            style={st.seeAllBtn}
            onPress={() => router.push('/(tabs)/news')}
          >
            <Text style={st.seeAll}>See all</Text>
            <Ionicons name="chevron-forward" size={13} color={colors.green2} />
          </TouchableOpacity>
        </View>

        {/* Featured card — real NASRDA image */}
        <TouchableOpacity
          style={st.featCard}
          onPress={() => router.push('/(tabs)/news')}
          activeOpacity={0.85}
        >
          {/* Real photo from NASRDA website */}
          <Image
            source={{ uri: NASRDA_IMAGES.undrr }}
            style={st.featBgImage}
            resizeMode="cover"
          />
          {/* Dark scrim so text remains legible */}
          <View style={st.featScrim} />
          {/* Content */}
          <View style={st.featContent}>
            <View style={st.tag}>
              <Text style={st.tagTxt}>PARTNERSHIP</Text>
            </View>
            <Text style={st.featTitle} numberOfLines={2}>
              NASRDA & DSA Strengthen Nigeria's Space Ecosystem
            </Text>
            <View style={st.featMetaRow}>
              <Ionicons name="time-outline" size={11} color="rgba(232,240,248,0.7)" />
              <Text style={st.featMeta}>June 2025 · 3 min read</Text>
              <Ionicons name="chevron-forward" size={14} color={colors.green2} style={{ marginLeft: 'auto' }} />
            </View>
          </View>
        </TouchableOpacity>

        {/* Divider label */}
        <Text style={st.dividerLabel}>LATEST UPDATES</Text>

        {/* News rows — each with a real NASRDA thumbnail */}
        {news.map((n, i) => (
          <TouchableOpacity
            key={i}
            style={[st.newsRow, i === news.length - 1 && { borderBottomWidth: 0 }]}
            onPress={() => router.push(n.route)}
            activeOpacity={0.8}
          >
            {/* Real image thumbnail */}
            <View style={st.newsThumb}>
              <Image
                source={{ uri: n.imageUri }}
                style={st.newsThumbImg}
                resizeMode="cover"
              />
              {/* Tinted overlay */}
              <View style={st.newsThumbOverlay} />
            </View>
            <View style={st.newsBody}>
              <Text style={[st.newsTag, { color: n.tagColor }]}>{n.tag}</Text>
              <Text style={st.newsTitle} numberOfLines={2}>{n.title}</Text>
              <Text style={st.newsDate}>{n.date}</Text>
            </View>
            <Ionicons name="chevron-forward" size={14} color={colors.textThird} style={{ marginTop: 2 }} />
          </TouchableOpacity>
        ))}

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

/* ── Styles ──────────────────────────────────────────────────── */
const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.navy },

  /* Hero */
  hero: {
    height: 430,
    backgroundColor: colors.navy2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  topBar: {
    position: 'absolute', top: 12, right: 20,
    flexDirection: 'row', gap: 10, zIndex: 10,
  },
  topBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center', justifyContent: 'center',
  },
  orbitWrap: {
    width: 260, height: 260,
    alignItems: 'center', justifyContent: 'center',
    marginTop: -10,
  },
  logoDisc: {
    position: 'absolute',
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: '#FFFFFF',
    alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#fff', shadowOpacity: 0.45,
    shadowRadius: 18, shadowOffset: { width: 0, height: 0 },
    elevation: 12,
  },
  logoImg: { width: 100, height: 100 },
  heroText: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingBottom: 20, alignItems: 'center', gap: 6,
  },
  agencyName: {
    fontSize: 12, fontWeight: '800', color: colors.offwhite,
    letterSpacing: 2.5, textAlign: 'center', lineHeight: 19,
  },
  agencySub: {
    fontSize: 10, color: colors.textSecond, letterSpacing: 1.5,
  },
  liveBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 7,
    backgroundColor: 'rgba(0,192,96,0.1)',
    borderWidth: 1, borderColor: 'rgba(0,192,96,0.3)',
    borderRadius: 6, paddingHorizontal: 12, paddingVertical: 5,
    marginTop: 2,
  },
  liveText: {
    fontSize: 10, fontWeight: '700', color: colors.green2, letterSpacing: 1,
  },

  /* Feed */
  feed: { flex: 1, backgroundColor: colors.navy },
  feedContent: { paddingHorizontal: 20, paddingTop: 20 },

  sectionHdr: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 17, fontWeight: '800', color: '#fff', letterSpacing: -0.3,
  },
  seeAllBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 2,
  },
  seeAll: {
    fontSize: 13, fontWeight: '600', color: colors.green2,
  },

  /* Featured card — full-bleed photo */
  featCard: {
    borderRadius: 16,
    height: 200,
    overflow: 'hidden',
    borderWidth: 1, borderColor: colors.borderGreen,
    marginBottom: 20,
  },
  featBgImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  featScrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(8,18,38,0.62)',
  },
  featContent: {
    position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16,
  },
  tag: {
    backgroundColor: colors.green,
    borderRadius: 4, paddingHorizontal: 8, paddingVertical: 3,
    alignSelf: 'flex-start', marginBottom: 8,
  },
  tagTxt: {
    fontSize: 9, fontWeight: '800', color: '#fff', letterSpacing: 1.2,
  },
  featTitle: {
    fontSize: 14, fontWeight: '800', color: '#fff', lineHeight: 20,
  },
  featMetaRow: {
    flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 8,
  },
  featMeta: {
    fontSize: 11, color: 'rgba(232,240,248,0.7)',
  },

  dividerLabel: {
    fontSize: 10, fontWeight: '700', color: colors.textThird,
    letterSpacing: 1.5, marginBottom: 4,
  },

  /* News rows */
  newsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(79,195,247,0.07)',
  },
  newsThumb: {
    width: 64, height: 52, borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1, borderColor: 'rgba(79,195,247,0.12)',
    backgroundColor: colors.navy2,
  },
  newsThumbImg: {
    width: '100%', height: '100%',
  },
  newsThumbOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10,22,40,0.18)',
  },
  newsBody: { flex: 1 },
  newsTag: {
    fontSize: 9, fontWeight: '800', letterSpacing: 1.2,
    marginBottom: 4,
  },
  newsTitle: {
    fontSize: 13, fontWeight: '600',
    color: colors.textPrimary, lineHeight: 18,
  },
  newsDate: {
    fontSize: 10, color: colors.textThird, marginTop: 3,
  },
});