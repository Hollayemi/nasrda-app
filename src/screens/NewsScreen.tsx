import React, { useState } from 'react';
import {
  View, Text, Image, ScrollView, TouchableOpacity,
  StyleSheet, RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NavLogo } from '../components/NavLogo';
import { colors } from '../theme';

/* ── Real NASRDA image URLs sourced from central.nasrda.gov.ng ── */
const NASRDA_IMAGES = {
  /** NASRDA + UNDRR/ECHO-ECOWAS partnership meeting, May 2026 */
  undrr:  'https://central.nasrda.gov.ng/wp-content/uploads/2026/05/NASRDA-UNDRR-ECHO-ECOWAS-1-768x546.jpeg',
  /** NASRDA SME / Access Bank commercialisation event, May 2026 */
  sme:    'https://central.nasrda.gov.ng/wp-content/uploads/2026/05/NASRDA-SME-Access-Bank-768x549.jpeg',
  /** NASRDA Headquarters gate, Lugbe Abuja */
  hq:     'https://central.nasrda.gov.ng/wp-content/uploads/2025/04/NASRDA_Gate1.jpg',
  /** DG Dr Matthew Adepoju 3-point agenda briefing */
  dg:     'https://central.nasrda.gov.ng/wp-content/uploads/2025/04/DG-3-point-Agenda-1.jpg',
  /** UNDRR event - group session */
  undrr2: 'https://central.nasrda.gov.ng/wp-content/uploads/2026/05/NASRDA-UNDRR-ECHO-ECOWAS-2-1024x731.jpeg',
  /** UNDRR event - presentation */
  undrr3: 'https://central.nasrda.gov.ng/wp-content/uploads/2026/05/NASRDA-UNDRR-ECHO-ECOWAS-3-1024x731.jpeg',
};

type NewsItem = {
  tag: string;
  title: string;
  date: string;
  mins: number;
  imageUri: string;
  tagColor: string;
};

const NEWS: NewsItem[] = [
  {
    tag: 'PARTNERSHIP',
    title: "NASRDA, UNDRR & ECHO-ECOWAS Strengthen Partnership on Disaster Response",
    date: 'May 2026', mins: 4,
    imageUri: NASRDA_IMAGES.undrr,
    tagColor: colors.green2,
  },
  {
    tag: 'COMMERCIALISATION',
    title: 'NASRDA Moves to Commercialise Research Innovations with Access Bank',
    date: 'May 2026', mins: 3,
    imageUri: NASRDA_IMAGES.sme,
    tagColor: colors.sky,
  },
  {
    tag: 'EMPOWERMENT',
    title: 'NASRDA Leads the Drive for Youth Empowerment in Space Technology',
    date: 'May 2025', mins: 4,
    imageUri: NASRDA_IMAGES.dg,
    tagColor: colors.sky,
  },
  {
    tag: 'INNOVATION',
    title: 'Nigeria Deepens Footprint in Global Space Innovation',
    date: 'Apr 2025', mins: 3,
    imageUri: NASRDA_IMAGES.hq,
    tagColor: colors.gold,
  },
  {
    tag: 'POLICY',
    title: "Minister Nnaji Calls for Decisive Move to Reshape Africa's Space Economy",
    date: 'Mar 2025', mins: 5,
    imageUri: NASRDA_IMAGES.undrr2,
    tagColor: colors.green2,
  },
  {
    tag: 'OPERATIONS',
    title: 'SERA Mission Control Confirms NigeriaSAT-2 Tasking Window',
    date: 'Jan 2025', mins: 2,
    imageUri: NASRDA_IMAGES.undrr3,
    tagColor: colors.gold,
  },
];

const TABS = ['All', 'Press Releases', 'Events', 'Gallery', 'Videos'];

export const NewsScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('All');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  };

  const featured = NEWS[0];
  const rest     = NEWS.slice(1);

  return (
    <View style={[st.root, { paddingTop: insets.top }]}>
      {/* Nav */}
      <View style={st.nav}>
        <NavLogo />
        <Text style={st.navTitle}>Featured News</Text>
        <TouchableOpacity style={st.refreshBtn} onPress={onRefresh}>
          <Ionicons name="refresh-outline" size={20} color={colors.textThird} />
        </TouchableOpacity>
      </View>

      {/* Live banner */}
      <View style={st.syncBar}>
        <View style={st.syncDot} />
        <Text style={st.syncTxt}>LIVE — CENTRAL.NASRDA.GOV.NG/NEWS-MEDIA</Text>
      </View>

      {/* Filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={st.chipRow}
        contentContainerStyle={st.chipContent}
      >
        {TABS.map(t => (
          <TouchableOpacity
            key={t}
            style={[st.chip, activeTab === t && st.chipActive]}
            onPress={() => setActiveTab(t)}
          >
            <Text style={[st.chipTxt, activeTab === t && st.chipTxtActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.green2} />
        }
      >
        {/* Featured card — full-bleed real NASRDA photo */}
        <View style={st.featWrap}>
          <TouchableOpacity style={st.featCard} activeOpacity={0.88}>
            {/* Real photo */}
            <Image
              source={{ uri: featured.imageUri }}
              style={st.featBgImage}
              resizeMode="cover"
            />
            {/* Gradient-like scrim */}
            <View style={st.featOverlay} />
            <View style={st.featContent}>
              <View style={[st.tag, { backgroundColor: colors.green }]}>
                <Text style={st.tagTxt}>{featured.tag}</Text>
              </View>
              <Text style={st.featTitle}>{featured.title}</Text>
              <View style={st.featMeta}>
                <Ionicons name="time-outline" size={11} color="rgba(232,240,248,0.7)" />
                <Text style={st.featMetaTxt}>{featured.date} · {featured.mins} min read</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View style={st.sectionHdr}>
          <Text style={st.sectionLabel}>RECENT STORIES</Text>
          <View style={st.sectionLine} />
        </View>

        {/* News list — each with a real NASRDA thumbnail */}
        {rest.map((n, i) => (
          <TouchableOpacity key={i} style={st.newsCard} activeOpacity={0.8}>
            {/* Real photo thumbnail */}
            <View style={st.newsThumb}>
              <Image
                source={{ uri: n.imageUri }}
                style={st.newsThumbImg}
                resizeMode="cover"
              />
              <View style={st.newsThumbOverlay} />
            </View>
            <View style={st.newsBody}>
              <View style={[st.inlineTag, { backgroundColor: `${n.tagColor}18` }]}>
                <Text style={[st.inlineTagTxt, { color: n.tagColor }]}>{n.tag}</Text>
              </View>
              <Text style={st.newsTitle} numberOfLines={2}>{n.title}</Text>
              <View style={st.newsMeta}>
                <Ionicons name="time-outline" size={10} color={colors.textThird} />
                <Text style={st.newsDate}>{n.date} · {n.mins} min read</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={14} color={colors.textThird} />
          </TouchableOpacity>
        ))}

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
};

export default NewsScreen;

const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.navy },

  /* Nav */
  nav: {
    height: 56,
    backgroundColor: 'rgba(10,22,40,0.98)',
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 20, gap: 12,
    borderBottomWidth: 1, borderBottomColor: 'rgba(0,166,81,0.18)',
  },
  navTitle: {
    flex: 1, fontSize: 16, fontWeight: '800', color: '#fff', letterSpacing: -0.3,
  },
  refreshBtn: {
    width: 36, height: 36, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },

  /* Live banner */
  syncBar: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingVertical: 8, paddingHorizontal: 20,
    backgroundColor: 'rgba(0,166,81,0.06)',
    borderBottomWidth: 1, borderBottomColor: 'rgba(0,166,81,0.12)',
  },
  syncDot: {
    width: 6, height: 6, borderRadius: 3, backgroundColor: colors.green2,
  },
  syncTxt: {
    fontSize: 9, fontWeight: '700', color: colors.green2, letterSpacing: 1.2,
  },

  /* Filter chips */
  chipRow: { flexGrow: 0, borderBottomWidth: 1, borderBottomColor: 'rgba(79,195,247,0.07)' },
  chipContent: { paddingHorizontal: 20, paddingVertical: 12, gap: 8 },
  chip: {
    paddingVertical: 6, paddingHorizontal: 16, borderRadius: 20,
    borderWidth: 1, borderColor: 'rgba(79,195,247,0.12)',
    backgroundColor: 'transparent',
  },
  chipActive: {
    backgroundColor: 'rgba(0,166,81,0.14)',
    borderColor: 'rgba(0,166,81,0.32)',
  },
  chipTxt:       { fontSize: 12, fontWeight: '600', height:25, color: colors.textThird },
  chipTxtActive: { color: colors.green2 },

  /* Featured card — full photo */
  featWrap: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 8 },
  featCard: {
    borderRadius: 18, overflow: 'hidden', height: 220,
    borderWidth: 1, borderColor: colors.borderGreen,
  },
  featBgImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  featOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(8,18,38,0.58)',
  },
  featContent: {
    position: 'absolute', bottom: 0, left: 0, right: 0, padding: 18,
  },
  tag: {
    borderRadius: 5, paddingHorizontal: 9, paddingVertical: 4,
    alignSelf: 'flex-start', marginBottom: 8,
  },
  tagTxt: { fontSize: 9, fontWeight: '800', color: '#fff', letterSpacing: 1.2 },
  featTitle: {
    fontSize: 15, fontWeight: '800', color: '#fff', lineHeight: 22,
  },
  featMeta: {
    flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 6,
  },
  featMetaTxt: { fontSize: 11, color: 'rgba(232,240,248,0.7)' },

  /* Section header */
  sectionHdr: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 12, gap: 10,
  },
  sectionLabel: {
    fontSize: 10, fontWeight: '700', color: colors.textThird, letterSpacing: 1.5,
  },
  sectionLine: {
    flex: 1, height: 1, backgroundColor: 'rgba(79,195,247,0.1)',
  },

  /* News cards */
  newsCard: {
    flexDirection: 'row', alignItems: 'center',
    gap: 14, paddingVertical: 14, paddingHorizontal: 20,
    borderBottomWidth: 1, borderBottomColor: 'rgba(79,195,247,0.06)',
  },
  newsThumb: {
    width: 72, height: 56, borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1, borderColor: 'rgba(79,195,247,0.12)',
    backgroundColor: colors.navy2,
  },
  newsThumbImg: {
    width: '100%', height: '100%',
  },
  newsThumbOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10,22,40,0.12)',
  },
  newsBody: { flex: 1 },
  inlineTag: {
    alignSelf: 'flex-start',
    borderRadius: 4, paddingHorizontal: 7, paddingVertical: 3,
    marginBottom: 5,
  },
  inlineTagTxt: { fontSize: 9, fontWeight: '800', letterSpacing: 1 },
  newsTitle: {
    fontSize: 13, fontWeight: '600', color: colors.textPrimary, lineHeight: 19,
  },
  newsMeta: {
    flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4,
  },
  newsDate: { fontSize: 10, color: colors.textThird },
});