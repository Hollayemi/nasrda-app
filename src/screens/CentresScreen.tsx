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
  // labs: string[];
  imageUri: string;
};

const CENTRES: Centre[] = [
  {
    code: 'CAR',
    name: 'Centre for Atmospheric Research',
    loc: 'Ayingba, Kogi',
    accentColor: colors.sky,
    url: 'https://carnasrda.com',
    desc: 'The NASRDA Centre for Atmospheric Research (CAR) is a world class research and development center committed to research and capacity building in the atmospheric and related sciences. CAR is dedicated to understanding the atmosphere—the air around us—and the interconnected processes that make up the Earth system, from the ocean floor through the ionosphere to the Sun’s core.',
    // labs: ['Satellite Technology Lab', 'Ionospheric Research Lab', 'Weather Monitoring Lab'],
    // Ionosphere / atmospheric science image
    imageUri: NASRDA_LOGO_URI,
  },
  {
    code: 'CBSS',
    name: 'Centre for Basic Space Science',
    loc: 'Nsukka, Enugu',
    accentColor: colors.green2,
    url: 'https://www.nasrdacbss.com',
    desc: `The Centre for Basic Space Science and Astronomy (CBSS), Nsukka was established in 2001 as one of the Activity Centres of the National Space Research and Development Agency (NASRDA) with Emeritus Prof. P. N. Okeke as the pioneer Director. He was later succeeded by Late Prof. F. E. Opara. Currently, Dr. B. I. Okere is the Director.

From inception in 2001, the Centre operated from her temporal office at the Nsukka Campus of the University of Nigeria Nsukka (UNN) till 2019 when her research and administrative operations were moved to her permanent site at Eburummiri, Agu-Umuakashi, Nsukka.`,
    // labs: ['Astronomy Lab', 'Astrophysics Lab'],
    // Telescope / astronomy image
    imageUri: NASRDA_LOGO_URI,
  },
  {
    code: "ARCSSTEE",
    name: 'African Regional Centre for Space Science & Technology Education in English',
    loc: 'Ile-Ife, Osun',
    accentColor: colors.gold,
    url: 'https://arcsste.org',
    desc: 'UN-affiliated regional centre offering postgraduate programmes in space science, remote sensing and GIS.',
    // labs: ['Remote Sensing Lab', 'GIS & Mapping Lab'],
    // University / education in space science
    imageUri: NASRDA_LOGO_URI,
  },
  {
    code: 'CGG',
    name: 'Centre for Geodesy & Geodynamics',
    loc: 'Toro, Bauchi',
    accentColor: colors.gold,
    url: '',
    desc: 'The Centre for Geodesy and Geodynamics is to carryout earth observation research as well as monitor and predict geo-hazards using space geodetic and geophysical technique for sustainable national development.',
    // labs: ['Geodynamics Lab', 'Earth Deformation Lab'],
    // Earth from space — geodesy
    imageUri: NASRDA_LOGO_URI,
  },
  {
    code: 'CSTD',
    name: 'Centre for Satellite Technology Development',
    loc: 'Abuja, FCT',
    accentColor: colors.green2,
    url: 'http://www.cstd.nasrda.gov.ng',
    desc: `The Centre for Satellite Technology Development (CSTD) is a key research and development center of the National Space Research and Development Agency (NASRDA), dedicated to advancing satellite technology in Nigeria.  As a pioneer in space science and technology, CSTD is responsible for the design, development, testing, and integration of satellite systems that support national security, environmental monitoring, disaster management, and scientific research.   

Established in 2001 (initially as the “Satellite Technology Project”), CSTD is a key activity center, better known as the “heartbeat” of NASRDA, established in line with Nigeria’s National Space Policy and Programs.   

CSTD has played a critical role in the design, development, and launch of Nigeria’s satellites, such as NigeriaSat-1, NigeriaSat-2, NigeriaSat-X, and NigComSat-1R.  It is currently engaged in the planning of Nano Satellite Mission Constellation Project, an initiative to develop small satellites for IoT applications and other uses.  CSTD provides technical expertise for satellite operation, maintenance, and mission planning.  The center also engages in ground station activities, including satellite tracking, data acquisition, and analysis.  CSTD conducts research in satellite sub-systems such as power systems, control systems, aerodynamic systems, and payload sensors.  The center also works on next-generation satellite technology applications in nano-satellites, and AI-driven satellite data analytics.  `,
    // labs: ['Satellite Integration Lab', 'Electronics Lab', 'Clean Room Facility'],
    // Satellite in clean room
    imageUri: NASRDA_LOGO_URI,
  },
  {
    code: 'CSTP',
    name: 'Centre for Space Transport & Propulsion',
    loc: 'Epe, Lagos',
    accentColor: colors.gold,
    url: '',
    desc: `The Centre for Space Transport and Propulsion (CSTP), Epe, Lagos, was established on the 19th February, 2003, as one of the six activity Centres of National Space Research and Development Agency (NASRDA), Abuja. Nigeria. It is strategically situated along the Lagos lagoon in Epe, and in close proximity with the Lagos State University (LASU), Epe Engineering campus. The Centre is charged with the responsibility of conducting fundamental Research and Development (R&D) in space transport vehicles and propulsion system. This is to enable NASRDA acquire the launch capabilities of various satellites to Low Earth Orbit (LEO). Geosynchronous Equatorial Orbit (GEO), and interplanetary space, by Nigerian scientists and engineers.
CSTP policy, is aimed at complementing NASRDA policy statement at ensuring that Nigeria vigorously pursues the attainment of Space Capabilities as an essential tool for its socioeconomic development and the enhancement of the quality of life of its people.`,
    // labs: ['Propulsion Testing Lab', 'Rocket Systems Lab'],
    // Rocket launch
    imageUri: NASRDA_LOGO_URI,
  },
  {
    code: 'AIR',
    name: 'Atlantic International Research Centre',
    loc: 'Abuja, FCT',
    accentColor: colors.green2,
    url: 'https://aircentre.org',
    desc: 'International research hub for climate science, oceanography and coastal resilience in the Atlantic region.',
    // labs: ['Climate Modeling Lab', 'Ocean Observation Lab'],
    // Ocean / climate research
    imageUri: NASRDA_LOGO_URI,
  },
  {
    code: 'ISSE',
    name: 'Institute of Space Science & Engineering',
    loc: 'Abuja, FCT',
    accentColor: colors.sky,
    url: '',
    desc: 'Interdisciplinary research in space science, engineering and technology development.',
    // labs: ['Space Science Lab', 'Engineering Prototyping Lab'],
    // Space science + engineering
    imageUri: NASRDA_LOGO_URI,
  },

  {
    code: 'NCRS',
    name: 'National Centre for Remote Sensing',
    loc: 'Jos, Plateau',
    accentColor: colors.green2,
    url: '',
    desc: `The desire by Nigeria to establish its own comprehensive Remote Sensing Centre dates back to 1976, when the Government first made its intentions known during an Inter-Governmental meeting held in Addis Ababa.

The National Centre for Remote Sensing (NCRS) specializes in geospatial data acquisition, processing, and application in various fields.
NCRS is committed to being a Centre of excellence in the provision of Geo-informatic services for sustainable Development.` ,   // labs: ['Data Acquisition Lab', 'Image Processing Lab', 'Ground Receiving Station'],    // Satellite imagery / remote sensing
    imageUri: NASRDA_LOGO_URI,
  },
  {
    code: 'CSID',
    name: 'Centre for Space Incubation Development',
    loc: 'Abuja, FCT',
    accentColor: colors.gold,
    url: '',
    desc: `The Centre For Space Innovation & Development (CSID), is involved in advancing space-related research and innovation. The center focuses on developing new space technologies, collaborating with international partners, and contributing to Nigeria’s national development goals.`,
    // labs: ['GIS Development Lab', 'Spatial Database Lab'],
    // GIS / mapping
    imageUri: NASRDA_LOGO_URI,
  },
  {
    code: 'CSESO',
    name: 'Centre for Space Earth Station and Observatory',
    loc: 'Eruwa, Oyo State',
    accentColor: colors.sky,
    url: '',
    desc: `The Center for Space Earth Station and Observatory (CSESO), established under NASRDA in 2025, is tasked with operating and maintaining Nigeria’s Earth station hubs and teleports, ensuring seamless communication links for present and future satellites and space missions. Its duties include managing ground receiving stations for data acquisition, supporting satellite control and monitoring, and facilitating astronomical observations for research and exploration. CSESO also coordinates deep space exploration activities, collaborates with international and national partners in the Nigeria space programme, and provides technical infrastructure for satellite communication, navigation, and scientific missions, thereby serving as a critical backbone for Nigeria’s expanding space operations.`,
    // labs: ['Climate Monitoring Lab', 'Earth Observation Lab'],
    // Climate / earth system
    imageUri: NASRDA_LOGO_URI,
  },
  {
    code: 'CSLS',
    name: 'Centre for Space Life Science',
    loc: 'Ibadan, Oyo State',
    accentColor: colors.gold,
    url: '',
    desc: `The Centre for Space Life Sciences (CSLS) at the University of Ibadan, Oyo State, Nigeria, is a newly established research and training institution inaugurated on December 2, 2025, in response to the rapid expansion of human space exploration driven by governmental agencies, commercial enterprises and international collaborations, which has created an urgent need for specialized research on the interactions between biological systems and the space environment. As preparations intensify for long-duration missions to the Moon, Mars, and beyond, the Centre focuses on addressing critical challenges related to human health, biological systems and life-support infrastructure in space. The Centre is located within Nigeria’s premier university, CSLS serves as a national hub for interdisciplinary research spanning space biology, biomedical sciences, environmental studies and related technologies, with a strong commitment to advancing scientific knowledge, building capacity and fostering innovation. The Centre aims to position Nigeria as a strategic contributor to global space biology and human spaceflight research while translating space-based discoveries into practical solutions that enhance healthcare, agriculture and environmental resilience on Earth.`,    // labs: ['Policy Research Unit'],
    // Space law / treaty — UN image
    imageUri: NASRDA_LOGO_URI,
  },
  {
    code: 'CCCF',
    name: 'Centre for Space-Based Climate Change and Food Security',
    loc: 'Mubi, Adamawa',
    accentColor: colors.green2,
    url: '',
    desc: "The Centre for Space-Based Climate and Food Security (CCCF) is in Mubi, Adamawa State",
    // labs: ['SERA Mission Control Room', 'Telemetry Lab', 'Ground Station'],
    // Mission control room
    imageUri: NASRDA_LOGO_URI,
  },
  {
    code: 'CTR',
    name: 'Centre for Tropical Research',
    loc: 'Ikot Ekpene, Akwa Ibom',
    accentColor: colors.sky,
    url: '',
    desc: "The Centre for Tropical Research (CTR) is in Ikot Ekpene, Akwa Ibom State",
    // labs: ['Materials Lab', 'Advanced Manufacturing Lab'],
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
      <Text style={st.cardDesc}>{c.desc.substring(0, 200)}{c.desc.length > 200 ? "..." : ''}</Text>

      {/* Lab pills */}
      {/* <View style={st.labsRow}>
        {c.labs.map((l, i) => (
          <View key={i} style={st.labPill}>
            <Text style={st.labPillTxt}>{l}</Text>
          </View>
        ))}
      </View> */}

      {/* Footer */}
      <View style={st.cardFooter}>
        {/* <View style={st.labCountRow}>
          <Ionicons name="flask-outline" size={11} color={colors.textThird} />
          <Text style={st.labCount}>{c.labs.length} LAB{c.labs.length !== 1 ? 'S' : ''}</Text>
        </View> */}
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
            { n: CENTRES.length, l: 'Centres', color: colors.green2 },
            { n: '14', l: 'Laboratories', color: colors.gold },
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