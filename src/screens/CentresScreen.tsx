import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { NavLogo, NASRDA_LOGO_URI } from '../components/NavLogo';
import { colors } from '../theme';

type Centre = {
  code: string;
  name: string;
  loc: string;
  accentColor: string;
  url: string;
  desc: string;
  labs: string[];
  imageUri: string;
};

const CENTRES: Centre[] = [
  {
    code: 'CAR',
    name: 'Centre for Atmospheric Research',
    loc: 'Ayingba, Kogi',
    accentColor: colors.sky,
    url: 'https://carnasrda.com',
    desc: 'World-class R&D in atmospheric sciences — from ocean floor through the ionosphere to the Sun.',
    labs: ['Satellite Technology Lab', 'Ionospheric Research Lab', 'Weather Monitoring Lab'],
    // Ionosphere / atmospheric science image
    imageUri: NASRDA_LOGO_URI,
  },
  {
    code: 'CBSS',
    name: 'Centre for Basic Space Science',
    loc: 'Nsukka, Enugu',
    accentColor: colors.green2,
    url: 'https://www.nasrdacbss.com',
    desc: 'Promotes astronomy, astrophysics and space science education across Nigeria. Est. 2001.',
    labs: ['Astronomy Lab', 'Astrophysics Lab'],
    // Telescope / astronomy image
    imageUri: NASRDA_LOGO_URI,
  },
  {
    code: 'CGG',
    name: 'Centre for Geodesy & Geodynamics',
    loc: 'Toro, Bauchi',
    accentColor: colors.gold,
    url: '',
    desc: 'Earth observation and geo-hazard monitoring using space geodetic and geophysical techniques.',
    labs: ['Geodynamics Lab', 'Earth Deformation Lab'],
    // Earth from space — geodesy
    imageUri: NASRDA_LOGO_URI,
  },
  {
    code: 'CSTD',
    name: 'Centre for Satellite Technology Development',
    loc: 'Abuja, FCT',
    accentColor: colors.green2,
    url: 'http://www.cstd.nasrda.gov.ng',
    desc: 'Design, development, testing and integration of satellite systems. Home of all NigeriaSAT programmes.',
    labs: ['Satellite Integration Lab', 'Electronics Lab', 'Clean Room Facility'],
    // Satellite in clean room
    imageUri: 'https://central.nasrda.gov.ng/wp-content/uploads/2025/03/NigeriaSAT_2.webp',
  },
  {
    code: 'CSTP',
    name: 'Centre for Space Transport & Propulsion',
    loc: 'Epe, Lagos',
    accentColor: colors.gold,
    url: '',
    desc: "Research in rocket propulsion and space transport to advance Nigeria's indigenous launch capabilities.",
    labs: ['Propulsion Testing Lab', 'Rocket Systems Lab'],
    // Rocket launch
    imageUri: NASRDA_LOGO_URI,
  },
  {
    code: 'CSSTE',
    name: 'Centre for Space Science & Technology Education',
    loc: 'Ile-Ife, Osun',
    accentColor: colors.sky,
    url: '',
    desc: 'UN-affiliated regional centre offering postgraduate programmes in space science, remote sensing and GIS.',
    labs: ['Remote Sensing Lab', 'GIS & Mapping Lab'],
    // University / education in space science
    imageUri: NASRDA_LOGO_URI,
  },
  {
    code: 'NCRS',
    name: 'National Centre for Remote Sensing',
    loc: 'Jos, Plateau',
    accentColor: colors.green2,
    url: '',
    desc: 'Acquisition, processing and archiving of satellite data for agriculture, disaster management and environment.',
    labs: ['Data Acquisition Lab', 'Image Processing Lab', 'Ground Receiving Station'],
    // Satellite imagery / remote sensing
    imageUri: NASRDA_LOGO_URI,
  },
  {
    code: 'CSID',
    name: 'Centre for Space Information Development',
    loc: 'Abuja, FCT',
    accentColor: colors.gold,
    url: '',
    desc: "GIS development, spatial databases and IT infrastructure for Nigeria's space data economy.",
    labs: ['GIS Development Lab', 'Spatial Database Lab'],
    // GIS / mapping
    imageUri: NASRDA_LOGO_URI,
  },
  {
    code: 'CSESO',
    name: 'Centre for Space & Earth System Observation',
    loc: 'Kano, Kano',
    accentColor: colors.sky,
    url: '',
    desc: 'Earth system science, climate observation and environmental monitoring using satellite data.',
    labs: ['Climate Monitoring Lab', 'Earth Observation Lab'],
    // Climate / earth system
    imageUri: NASRDA_LOGO_URI,
  },
  {
    code: 'CSLS',
    name: 'Centre for Space Law & Science',
    loc: 'Abuja, FCT',
    accentColor: colors.gold,
    url: '',
    desc: 'Research and capacity building in space law, policy, and international regulatory frameworks.',
    labs: ['Policy Research Unit'],
    // Space law / treaty — UN image
    imageUri: NASRDA_LOGO_URI,
  },
  {
    code: 'CCCF',
    name: 'Command & Control Centre Facility',
    loc: 'Abuja, FCT',
    accentColor: colors.green2,
    url: '',
    desc: 'SERA Mission Control — satellite command, telemetry, tracking and control for all Nigerian satellites.',
    labs: ['SERA Mission Control Room', 'Telemetry Lab', 'Ground Station'],
    // Mission control room
    imageUri: NASRDA_LOGO_URI,
  },
  {
    code: 'CTR',
    name: 'Centre for Technology Research',
    loc: 'Abuja, FCT',
    accentColor: colors.sky,
    url: '',
    desc: 'Applied R&D in emerging space technologies, materials science and advanced manufacturing.',
    labs: ['Materials Lab', 'Advanced Manufacturing Lab'],
    // Lab / technology research
    imageUri: NASRDA_LOGO_URI,
  },
];

const CentreCard: React.FC<{ c: Centre }> = ({ c }) => (
  <View style={st.card}>
    {/* Left accent bar */}
    <View style={[st.accentBar, { backgroundColor: c.accentColor }]} />

    <View style={st.cardMain}>
      {/* Header row */}
      <View style={st.cardHeader}>
        {/* Centre image replacing icon */}
        <View style={[st.imageBox, { borderColor: `${c.accentColor}40` }]}>
          <Image
            source={{ uri: c.imageUri }}
            style={st.centreImage}
            resizeMode="cover"
          />
          {/* Subtle tint overlay so image blends with dark theme */}
          <View style={[st.imageTint, { backgroundColor: `${c.accentColor}18` }]} />
        </View>
        <View style={st.cardTitleBlock}>
          <View style={[st.codeBadge, { backgroundColor: `${c.accentColor}18` }]}>
            <Text style={[st.codeText, { color: c.accentColor }]}>{c.code}</Text>
          </View>
          <Text style={st.cardName} numberOfLines={2}>{c.name}</Text>
          <View style={st.locRow}>
            <Ionicons name="location-outline" size={11} color={colors.textThird} />
            <Text style={st.cardLoc}>{c.loc}</Text>
          </View>
        </View>
      </View>

      {/* Description */}
      <Text style={st.cardDesc}>{c.desc}</Text>

      {/* Lab pills */}
      <View style={st.labsRow}>
        {c.labs.map((l, i) => (
          <View key={i} style={st.labPill}>
            <Text style={st.labPillTxt}>{l}</Text>
          </View>
        ))}
      </View>

      {/* Footer */}
      <View style={st.cardFooter}>
        <View style={st.labCountRow}>
          <Ionicons name="flask-outline" size={11} color={colors.textThird} />
          <Text style={st.labCount}>{c.labs.length} LAB{c.labs.length !== 1 ? 'S' : ''}</Text>
        </View>
        {c.url ? (
          <TouchableOpacity
            style={st.visitBtn}
            onPress={() => Linking.openURL(c.url)}
          >
            <Text style={st.visitLink}>Visit website</Text>
            <Ionicons name="open-outline" size={11} color={colors.green2} />
          </TouchableOpacity>
        ) : <View />}
      </View>
    </View>
  </View>
);

export const CentresScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  return (
    <View style={[st.root, { paddingTop: insets.top }]}>
      <View style={st.nav}>
        <NavLogo />
        <Text style={st.navTitle}>Centres & Labs</Text>
        <FontAwesome5 name="flask" size={17} color={colors.textThird} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={st.scroll}>
        {/* Stats */}
        <View style={st.statsRow}>
          {([
            { n: '12', l: 'Centres', color: colors.green2 },
            { n: '30+', l: 'Laboratories', color: colors.gold },
            { n: '6', l: 'Geo. Zones', color: colors.sky },
          ] as const).map(({ n, l, color }, i) => (
            <View key={i} style={st.statBox}>
              <Text style={[st.statNum, { color }]}>{n}</Text>
              <Text style={st.statLabel}>{l}</Text>
            </View>
          ))}
        </View>

        {/* Section label */}
        <View style={st.sectionHdr}>
          <Text style={st.sectionLabel}>ALL ACTIVITY CENTRES</Text>
          <View style={st.sectionLine} />
        </View>

        {CENTRES.map((c, i) => <CentreCard key={i} c={c} />)}
        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
};

export default CentresScreen;

const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.navy },
  scroll: { paddingHorizontal: 20, paddingTop: 16 },
  nav: {
    height: 56, backgroundColor: 'rgba(10,22,40,0.98)',
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 20, gap: 12,
    borderBottomWidth: 1, borderBottomColor: 'rgba(0,166,81,0.18)',
  },
  navTitle: { flex: 1, fontSize: 16, fontWeight: '800', color: '#fff', letterSpacing: -0.3 },

  /* Stats */
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  statBox: {
    flex: 1, backgroundColor: colors.card,
    borderRadius: 12, paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(79,195,247,0.1)',
  },
  statNum: { fontSize: 20, fontWeight: '800' },
  statLabel: { fontSize: 10, color: colors.textThird, marginTop: 2 },

  /* Section header */
  sectionHdr: {
    flexDirection: 'row', alignItems: 'center',
    gap: 10, marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 10, fontWeight: '700', color: colors.textThird, letterSpacing: 1.5,
  },
  sectionLine: {
    flex: 1, height: 1, backgroundColor: 'rgba(79,195,247,0.08)',
  },

  /* Card */
  card: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 16, overflow: 'hidden',
    borderWidth: 1, borderColor: colors.border,
    marginBottom: 12,
  },
  accentBar: { width: 4 },
  cardMain: { flex: 1, padding: 16 },

  cardHeader: { flexDirection: 'row', gap: 12, marginBottom: 12 },

  /* Image box — replaces the old iconBox */
  imageBox: {
    width: 56, height: 56, borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    flexShrink: 0,
  },
  centreImage: {
    width: '100%',
    height: '100%',
  },
  imageTint: {
    ...StyleSheet.absoluteFillObject,
  },

  cardTitleBlock: { flex: 1 },
  codeBadge: {
    alignSelf: 'flex-start',
    borderRadius: 5, paddingHorizontal: 8, paddingVertical: 3,
    marginBottom: 5,
  },
  codeText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  cardName: { fontSize: 13, fontWeight: '700', color: '#fff', lineHeight: 18, marginBottom: 4 },
  locRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  cardLoc: { fontSize: 10, color: colors.textThird },

  cardDesc: { fontSize: 12, color: colors.textSecond, lineHeight: 18, marginBottom: 12 },

  labsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
  labPill: {
    backgroundColor: 'rgba(0,166,81,0.1)',
    borderWidth: 1, borderColor: 'rgba(0,166,81,0.2)',
    borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4,
  },
  labPillTxt: { fontSize: 10, fontWeight: '600', color: colors.green2 },

  cardFooter: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1, borderTopColor: 'rgba(79,195,247,0.08)',
  },
  labCountRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  labCount: { fontSize: 10, fontWeight: '700', color: colors.textThird, letterSpacing: 0.8 },
  visitBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  visitLink: { fontSize: 11, fontWeight: '700', color: colors.green2 },
});