import React, { useState } from 'react';
import {
  View, Text, Image, ScrollView, TouchableOpacity,
  StyleSheet, Modal, Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NavLogo } from '../components/NavLogo';
import { colors } from '../theme';

/* ── Real satellite images from central.nasrda.gov.ng ─────────── */
const SAT_IMAGES = {
  nigeriasat2:  'https://central.nasrda.gov.ng/wp-content/uploads/2025/03/NigeriaSAT_2.webp',
  nigeriasat1:  'https://central.nasrda.gov.ng/wp-content/uploads/2025/03/NigeriaSAT_1.png',
  nigeriasatX:  'https://central.nasrda.gov.ng/wp-content/uploads/2025/03/NigeriaSAT-X.png',
  nigcomsat1r:  'https://central.nasrda.gov.ng/wp-content/uploads/2025/03/NigComSat-1R.jpg',
  nigcomsat1:   'https://central.nasrda.gov.ng/wp-content/uploads/2025/03/NigComSat-1.jpeg',
  // EduSAT has no official image yet — use a generic space placeholder
  edusat:       'https://central.nasrda.gov.ng/wp-content/uploads/2025/02/NASRDA-Logo_N2.png',
};

type Mission = {
  name: string;
  desc: string;
  status: 'LIVE' | 'PLANNED' | 'RETIRED';
  group: 'active' | 'dev' | 'retired';
  accentColor: string;
  imageUri: string;
  sourceUrl: string;
  launched: string;
  orbit: string;
  details: string;
};

const MISSIONS: Mission[] = [
  {
    name: 'NigeriaSAT-2',
    desc: 'High-res Earth observation · 2.5m GSD · Sun-synchronous orbit',
    status: 'LIVE',
    group: 'active',
    accentColor: colors.green,
    imageUri: SAT_IMAGES.nigeriasat2,
    sourceUrl: 'https://central.nasrda.gov.ng/space-missions/nigeriasat-2/',
    launched: '2011',
    orbit: 'Sun-synchronous LEO',
    details:
      'NigeriaSAT-2 is a 300kg high-resolution Earth observation satellite built by Surrey Satellite Technology Ltd (SSTL). It provides 2.5m GSD panchromatic and 5m GSD multispectral imagery across a 20×20km swath, supporting mapping, water resources, agriculture, and disaster management.',
  },
  {
    name: 'NigComSat-1R',
    desc: 'Communications · Ka/Ku/C/L band · Geostationary 42.5°E',
    status: 'LIVE',
    group: 'active',
    accentColor: colors.green,
    imageUri: SAT_IMAGES.nigcomsat1r,
    sourceUrl: 'https://central.nasrda.gov.ng/space-missions/nigcomsat-1r/',
    launched: 'Dec 20, 2011',
    orbit: 'GEO 42.5°E',
    details:
      'NigComSat-1R is based on the DFH-4 platform by CAST, fitted with 28 transponders across Ka/Ku/C/L bands. It replaced the failed NigComSat-1 and serves sub-Saharan Africa, Europe and Central Asia with a 15-year design life.',
  },
  {
    name: 'Nigeria EduSAT',
    desc: 'Educational satellite · Supporting STEM across Nigeria',
    status: 'PLANNED',
    group: 'dev',
    accentColor: colors.gold,
    imageUri: SAT_IMAGES.edusat,
    sourceUrl: 'https://central.nasrda.gov.ng/space-missions/nigeria-edusat/',
    launched: 'TBD',
    orbit: 'LEO (planned)',
    details:
      'Nigeria EduSAT is a planned educational satellite designed to support STEM education and research capacity development across Nigerian universities and secondary schools.',
  },
  {
    name: 'NigeriaSAT-1',
    desc: "Nigeria's first satellite · 2003–2014 · 32m GSD · DMC",
    status: 'RETIRED',
    group: 'retired',
    accentColor: colors.textThird,
    imageUri: SAT_IMAGES.nigeriasat1,
    sourceUrl: 'https://central.nasrda.gov.ng/space-missions/nigeriasat-1/',
    launched: 'Sep 27, 2003',
    orbit: 'Sun-synchronous 700km',
    details:
      'NigeriaSAT-1 was launched from Plesetsk, Russia as part of the 5-nation Disaster Monitoring Constellation (DMC). Built by SSTL, it carried a 32m GSD multispectral camera and served for over a decade before decommissioning in 2014.',
  },
  {
    name: 'NigeriaSAT-X',
    desc: 'Student-built microsatellite · Launched 2011 · 22m GSD',
    status: 'RETIRED',
    group: 'retired',
    accentColor: colors.textThird,
    imageUri: SAT_IMAGES.nigeriasatX,
    sourceUrl: 'https://central.nasrda.gov.ng/space-missions/nigeriasat-x/',
    launched: 'Aug 17, 2011',
    orbit: 'Sun-synchronous LEO',
    details:
      'NigeriaSAT-X was built by 25 Nigerian engineers and scientists under SSTL\'s Know How Technology Transfer program. The 100kg microsatellite features a 22m multispectral imager with 600km swath and was launched via DNEPR from Yasny, Russia.',
  },
  {
    name: 'NigComSat-1',
    desc: "Nigeria's first comsat · Launched 2007 · Failed 2008",
    status: 'RETIRED',
    group: 'retired',
    accentColor: colors.textThird,
    imageUri: SAT_IMAGES.nigcomsat1,
    sourceUrl: 'https://central.nasrda.gov.ng/space-missions/nigcomsat-1/',
    launched: 'May 13, 2007',
    orbit: 'GEO 42.5°E',
    details:
      'NigComSat-1, built by CAST, was Nigeria\'s first geostationary communications satellite. Positioned at 42.5°E, it carried C-band and Ku-band transponders. A solar array anomaly caused it to fail in November 2008 and was replaced by NigComSat-1R.',
  },
];

const BADGE: Record<string, { bg: string; color: string }> = {
  LIVE:    { bg: 'rgba(0,192,96,0.14)',   color: colors.green2 },
  PLANNED: { bg: 'rgba(245,168,0,0.13)',  color: colors.gold },
  RETIRED: { bg: 'rgba(74,106,138,0.15)', color: colors.textThird },
};

/* ── Detail Modal ─────────────────────────────────────────────── */
const MissionDetailModal: React.FC<{
  mission: Mission | null;
  onClose: () => void;
}> = ({ mission, onClose }) => {
  const insets = useSafeAreaInsets();
  if (!mission) return null;
  const badge = BADGE[mission.status];

  return (
    <Modal visible animationType="slide" transparent onRequestClose={onClose}>
      <View style={md.overlay}>
        <View style={[md.sheet, { paddingBottom: Math.max(insets.bottom, 20) }]}>
          {/* Hero image */}
          <View style={md.heroWrap}>
            <Image
              source={{ uri: mission.imageUri }}
              style={md.heroImg}
              resizeMode="contain"
            />
            <View style={md.heroScrim} />
            <TouchableOpacity style={md.closeBtn} onPress={onClose}>
              <Ionicons name="close" size={20} color="#fff" />
            </TouchableOpacity>
            {/* Status badge on image */}
            <View style={[md.heroBadge, { backgroundColor: badge.bg }]}>
              {mission.status === 'LIVE' && (
                <View style={[md.liveDot, { backgroundColor: colors.green2 }]} />
              )}
              <Text style={[md.heroBadgeTxt, { color: badge.color }]}>
                {mission.status}
              </Text>
            </View>
          </View>

          <ScrollView style={md.body} showsVerticalScrollIndicator={false}>
            {/* Title */}
            <Text style={md.title}>{mission.name}</Text>
            <Text style={md.subtitle}>{mission.desc}</Text>

            {/* Specs row */}
            <View style={md.specsRow}>
              <View style={md.spec}>
                <Ionicons name="rocket-outline" size={14} color={colors.sky} />
                <Text style={md.specLabel}>LAUNCHED</Text>
                <Text style={md.specValue}>{mission.launched}</Text>
              </View>
              <View style={md.specDivider} />
              <View style={md.spec}>
                <MaterialCommunityIcons name="orbit" size={14} color={colors.gold} />
                <Text style={md.specLabel}>ORBIT</Text>
                <Text style={md.specValue}>{mission.orbit}</Text>
              </View>
            </View>

            {/* Details */}
            <Text style={md.sectionLabel}>ABOUT THIS MISSION</Text>
            <Text style={md.detailsTxt}>{mission.details}</Text>

            {/* Source link */}
            {mission.sourceUrl ? (
              <TouchableOpacity
                style={md.linkBtn}
                onPress={() => Linking.openURL(mission.sourceUrl)}
              >
                <Ionicons name="globe-outline" size={15} color={colors.green2} />
                <Text style={md.linkTxt}>View on NASRDA Website</Text>
                <Ionicons name="open-outline" size={13} color={colors.green2} />
              </TouchableOpacity>
            ) : null}

            <View style={{ height: 16 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

/* ── Mission Card ─────────────────────────────────────────────── */
const MissionCard: React.FC<{ m: Mission; onPress: () => void }> = ({ m, onPress }) => {
  const badge = BADGE[m.status];
  const dim   = m.group === 'retired';

  return (
    <TouchableOpacity
      style={[st.card, dim && { opacity: 0.7 }]}
      onPress={onPress}
      activeOpacity={0.82}
    >
      {/* Left accent bar */}
      <View style={[st.accentBar, { backgroundColor: m.accentColor }]} />

      {/* Satellite image */}
      <View style={st.imgWrap}>
        <Image
          source={{ uri: m.imageUri }}
          style={st.satImg}
          resizeMode="contain"
        />
      </View>

      {/* Card body */}
      <View style={st.cardBody}>
        <Text style={st.cardName}>{m.name}</Text>
        <Text style={st.cardDesc} numberOfLines={2}>{m.desc}</Text>
        <View style={st.cardFooter}>
          <View style={[st.badge, { backgroundColor: badge.bg }]}>
            {m.status === 'LIVE' && (
              <View style={[st.liveDot, { backgroundColor: colors.green2 }]} />
            )}
            <Text style={[st.badgeTxt, { color: badge.color }]}>{m.status}</Text>
          </View>
          <Text style={st.tapHint}>Tap for details ›</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

/* ── Groups ───────────────────────────────────────────────────── */
type GroupDef = { key: 'active' | 'dev' | 'retired'; label: string; labelColor: string };
const GROUPS: GroupDef[] = [
  { key: 'active',  label: 'ACTIVE SATELLITES', labelColor: colors.green2 },
  { key: 'dev',     label: 'IN DEVELOPMENT',    labelColor: colors.gold },
  { key: 'retired', label: 'RETIRED MISSIONS',  labelColor: colors.textThird },
];

/* ── MissionsScreen ───────────────────────────────────────────── */
export const MissionsScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState<Mission | null>(null);

  return (
    <View style={[st.root, { paddingTop: insets.top }]}>
      {/* Nav */}
      <View style={st.nav}>
        <NavLogo />
        <Text style={st.navTitle}>Space Missions</Text>
        <MaterialCommunityIcons name="satellite-variant" size={20} color={colors.textThird} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={st.scroll}>
        {/* Stats strip */}
        <View style={st.statsRow}>
          {([
            { n: '2', l: 'Active',  color: colors.green2 },
            { n: '1', l: 'Planned', color: colors.gold },
            { n: '3', l: 'Retired', color: colors.textThird },
          ] as const).map(({ n, l, color }, i) => (
            <View key={i} style={st.statBox}>
              <Text style={[st.statNum, { color }]}>{n}</Text>
              <Text style={st.statLabel}>{l}</Text>
            </View>
          ))}
        </View>

        {/* Groups */}
        {GROUPS.map(g => (
          <View key={g.key}>
            <View style={st.groupHdr}>
              <View style={[st.groupDot, { backgroundColor: g.labelColor }]} />
              <Text style={[st.groupLabel, { color: g.labelColor }]}>{g.label}</Text>
              <View style={st.groupLine} />
            </View>
            {MISSIONS.filter(m => m.group === g.key).map((m, i) => (
              <MissionCard key={i} m={m} onPress={() => setSelected(m)} />
            ))}
          </View>
        ))}

        <View style={{ height: 24 }} />
      </ScrollView>

      {/* Detail modal */}
      <MissionDetailModal
        mission={selected}
        onClose={() => setSelected(null)}
      />
    </View>
  );
};

export default MissionsScreen;

/* ── Styles ───────────────────────────────────────────────────── */
const st = StyleSheet.create({
  root:   { flex: 1, backgroundColor: colors.navy },
  scroll: { paddingHorizontal: 20, paddingTop: 16 },
  nav: {
    height: 56,
    backgroundColor: 'rgba(10,22,40,0.98)',
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 20, gap: 12,
    borderBottomWidth: 1, borderBottomColor: 'rgba(0,166,81,0.18)',
  },
  navTitle: { flex: 1, fontSize: 16, fontWeight: '800', color: '#fff', letterSpacing: -0.3 },

  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  statBox: {
    flex: 1, backgroundColor: colors.card,
    borderRadius: 12, paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(79,195,247,0.1)',
  },
  statNum:   { fontSize: 22, fontWeight: '800' },
  statLabel: { fontSize: 10, color: colors.textThird, marginTop: 2 },

  groupHdr: {
    flexDirection: 'row', alignItems: 'center',
    gap: 8, marginBottom: 10, marginTop: 4,
  },
  groupDot:   { width: 6, height: 6, borderRadius: 3 },
  groupLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 1.5 },
  groupLine:  { flex: 1, height: 1, backgroundColor: 'rgba(79,195,247,0.08)' },

  /* Card */
  card: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 16, overflow: 'hidden',
    borderWidth: 1, borderColor: colors.border,
    marginBottom: 12,
  },
  accentBar: { width: 4 },

  imgWrap: {
    width: 86,
    backgroundColor: 'rgba(255,255,255,0.03)',
    alignItems: 'center', justifyContent: 'center',
    padding: 6,
  },
  satImg: { width: 74, height: 74 },

  cardBody: {
    flex: 1, paddingHorizontal: 14, paddingVertical: 14, justifyContent: 'space-between',
  },
  cardName: { fontSize: 14, fontWeight: '700', color: colors.textPrimary, marginBottom: 4 },
  cardDesc: { fontSize: 11, color: colors.textSecond, lineHeight: 15, flex: 1 },

  cardFooter: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginTop: 10,
  },
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4,
  },
  liveDot:  { width: 5, height: 5, borderRadius: 2.5 },
  badgeTxt: { fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
  tapHint:  { fontSize: 10, color: colors.textThird },
});

/* ── Modal styles ─────────────────────────────────────────────── */
const md = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.navy2,
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    maxHeight: '90%',
    overflow: 'hidden',
  },
  heroWrap: {
    height: 220,
    backgroundColor: '#fff',
  },
  heroImg: {
    width: '100%', height: '100%',
  },
  heroScrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(8,18,38,0.18)',
  },
  closeBtn: {
    position: 'absolute', top: 14, right: 14,
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: 'rgba(10,22,40,0.65)',
    alignItems: 'center', justifyContent: 'center',
  },
  heroBadge: {
    position: 'absolute', bottom: 14, left: 16,
    flexDirection: 'row', alignItems: 'center', gap: 5,
    borderRadius: 6, paddingHorizontal: 10, paddingVertical: 5,
  },
  liveDot:     { width: 6, height: 6, borderRadius: 3 },
  heroBadgeTxt: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },

  body: { paddingHorizontal: 20, paddingTop: 20 },
  title:    { fontSize: 22, fontWeight: '800', color: '#fff', marginBottom: 4 },
  subtitle: { fontSize: 13, color: colors.textSecond, lineHeight: 19, marginBottom: 20 },

  specsRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 14, padding: 16,
    borderWidth: 1, borderColor: colors.border,
    marginBottom: 22,
  },
  spec:      { flex: 1, alignItems: 'center', gap: 4 },
  specDivider: { width: 1, height: 36, backgroundColor: 'rgba(79,195,247,0.1)' },
  specLabel: { fontSize: 9, fontWeight: '700', color: colors.textThird, letterSpacing: 1 },
  specValue: { fontSize: 12, fontWeight: '600', color: colors.textPrimary, textAlign: 'center' },

  sectionLabel: {
    fontSize: 10, fontWeight: '700', color: colors.textThird,
    letterSpacing: 1.5, marginBottom: 8,
  },
  detailsTxt: {
    fontSize: 13, color: colors.textSecond, lineHeight: 21, marginBottom: 20,
  },

  linkBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: 'rgba(0,192,96,0.1)',
    borderWidth: 1, borderColor: 'rgba(0,192,96,0.25)',
    borderRadius: 12, paddingVertical: 12, paddingHorizontal: 16,
    marginBottom: 4,
  },
  linkTxt: { flex: 1, fontSize: 13, fontWeight: '600', color: colors.green2 },
});