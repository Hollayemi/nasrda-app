import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking, Image, FlatList } from 'react-native';
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
  imageUri: string;
};

type Laboratory = {
  acronym: string;
  labName: string;
  information: string;
  location: string;
};

const CENTRES: Centre[] = [
  {
    code: 'CAR',
    name: 'Centre for Atmospheric Research',
    loc: 'Ayingba, Kogi',
    accentColor: colors.sky,
    url: 'https://carnasrda.com',
    desc: 'The NASRDA Centre for Atmospheric Research (CAR) is a world class research and development center committed to research and capacity building in the atmospheric and related sciences. CAR is dedicated to understanding the atmosphere—the air around us—and the interconnected processes that make up the Earth system, from the ocean floor through the ionosphere to the Sun\'s core.',
    imageUri: NASRDA_LOGO_URI,
  },
  {
    code: 'CBSS',
    name: 'Centre for Basic Space Science',
    loc: 'Nsukka, Enugu',
    accentColor: colors.sky,
    url: 'https://www.nasrdacbss.com',
    desc: `The Centre for Basic Space Science and Astronomy (CBSS), Nsukka was established in 2001 as one of the Activity Centres of the National Space Research and Development Agency (NASRDA) with Emeritus Prof. P. N. Okeke as the pioneer Director. From inception in 2001, the Centre operated from her temporal office at the Nsukka Campus of the University of Nigeria Nsukka (UNN) till 2019 when her research and administrative operations were moved to her permanent site at Eburummiri, Agu-Umuakashi, Nsukka.`,
    imageUri: NASRDA_LOGO_URI,
  },
  {
    code: "ARCSSTEE",
    name: 'African Regional Centre for Space Science & Technology Education in English',
    loc: 'Ile-Ife, Osun',
    accentColor: colors.sky,
    url: 'https://arcsste.org',
    desc: 'UN-affiliated regional centre offering postgraduate programmes in space science, remote sensing and GIS.',
    imageUri: NASRDA_LOGO_URI,
  },
  {
    code: 'CGG',
    name: 'Centre for Geodesy & Geodynamics',
    loc: 'Toro, Bauchi',
    accentColor: colors.sky,
    url: '',
    desc: 'The Centre for Geodesy and Geodynamics is to carryout earth observation research as well as monitor and predict geo-hazards using space geodetic and geophysical technique for sustainable national development.',
    imageUri: NASRDA_LOGO_URI,
  },
  {
    code: 'CSTD',
    name: 'Centre for Satellite Technology Development',
    loc: 'Abuja, FCT',
    accentColor: colors.sky,
    url: 'http://www.cstd.nasrda.gov.ng',
    desc: `The Centre for Satellite Technology Development (CSTD) is a key research and development center of the National Space Research and Development Agency (NASRDA), dedicated to advancing satellite technology in Nigeria. As a pioneer in space science and technology, CSTD is responsible for the design, development, testing, and integration of satellite systems that support national security, environmental monitoring, disaster management, and scientific research. CSTD has played a critical role in the design, development, and launch of Nigeria's satellites, such as NigeriaSat-1, NigeriaSat-2, NigeriaSat-X, and NigComSat-1R.`,
    imageUri: NASRDA_LOGO_URI,
  },
  {
    code: 'CSTP',
    name: 'Centre for Space Transport & Propulsion',
    loc: 'Epe, Lagos',
    accentColor: colors.sky,
    url: '',
    desc: `The Centre for Space Transport and Propulsion (CSTP), Epe, Lagos, was established on the 19th February, 2003, as one of the six activity Centres of National Space Research and Development Agency (NASRDA), Abuja. Nigeria. The Centre is charged with the responsibility of conducting fundamental Research and Development (R&D) in space transport vehicles and propulsion system.`,
    imageUri: NASRDA_LOGO_URI,
  },
  {
    code: 'AIR',
    name: 'Atlantic International Research Centre',
    loc: 'Abuja, FCT',
    accentColor: colors.sky,
    url: 'https://aircentre.org',
    desc: 'International research hub for climate science, oceanography and coastal resilience in the Atlantic region.',
    imageUri: NASRDA_LOGO_URI,
  },
  {
    code: 'ISSE',
    name: 'Institute of Space Science & Engineering',
    loc: 'Abuja, FCT',
    accentColor: colors.sky,
    url: '',
    desc: 'Interdisciplinary research in space science, engineering and technology development.',
    imageUri: NASRDA_LOGO_URI,
  },
  {
    code: 'NCRS',
    name: 'National Centre for Remote Sensing',
    loc: 'Jos, Plateau',
    accentColor: colors.sky,
    url: '',
    desc: `The National Centre for Remote Sensing (NCRS) specializes in geospatial data acquisition, processing, and application in various fields. NCRS is committed to being a Centre of excellence in the provision of Geo-informatic services for sustainable Development.`,
    imageUri: NASRDA_LOGO_URI,
  },
  {
    code: 'CSID',
    name: 'Centre for Space Incubation Development',
    loc: 'Abuja, FCT',
    accentColor: colors.sky,
    url: '',
    desc: `The Centre For Space Innovation & Development (CSID), is involved in advancing space-related research and innovation. The center focuses on developing new space technologies, collaborating with international partners, and contributing to Nigeria's national development goals.`,
    imageUri: NASRDA_LOGO_URI,
  },
  {
    code: 'CSESO',
    name: 'Centre for Space Earth Station and Observatory',
    loc: 'Eruwa, Oyo State',
    accentColor: colors.sky,
    url: '',
    desc: `The Center for Space Earth Station and Observatory (CSESO), established under NASRDA in 2025, is tasked with operating and maintaining Nigeria's Earth station hubs and teleports, ensuring seamless communication links for present and future satellites and space missions.`,
    imageUri: NASRDA_LOGO_URI,
  },
  {
    code: 'CSLS',
    name: 'Centre for Space Life Science',
    loc: 'Ibadan, Oyo State',
    accentColor: colors.sky,
    url: '',
    desc: `The Centre for Space Life Sciences (CSLS) at the University of Ibadan, Oyo State, Nigeria, is a newly established research and training institution inaugurated on December 2, 2025, focusing on critical challenges related to human health, biological systems and life-support infrastructure in space.`,
    imageUri: NASRDA_LOGO_URI,
  },
  {
    code: 'CCCF',
    name: 'Centre for Space-Based Climate Change and Food Security',
    loc: 'Mubi, Adamawa',
    accentColor: colors.sky,
    url: '',
    desc: "The Centre for Space-Based Climate and Food Security (CCCF) is in Mubi, Adamawa State, focusing on climate monitoring and food security applications using space technology.",
    imageUri: NASRDA_LOGO_URI,
  },
  {
    code: 'CTR',
    name: 'Centre for Tropical Research',
    loc: 'Ikot Ekpene, Akwa Ibom',
    accentColor: colors.sky,
    url: '',
    desc: "The Centre for Tropical Research (CTR) is in Ikot Ekpene, Akwa Ibom State, conducting research on tropical ecosystems and environmental monitoring.",
    imageUri: NASRDA_LOGO_URI,
  },
];

const nasrdaLaboratories: Laboratory[] = [
  {
    acronym: "ASTAL",
    labName: "Advanced Space Technology Application Laboratory",
    information: "Research and development laboratory focused on advanced space technology applications and solutions for national development.",
    location: "Uyo, Akwa Ibom State",
  },
  {
    acronym: "AAELab",
    labName: "Advanced AeroSpace Engines Laboratory",
    information: "Specialized laboratory for aerospace engine research, development, testing, and innovation.",
    location: "Oka-Akoko, Ondo State",
  },
  {
    acronym: "AUAVL",
    labName: "Advanced Unmanned Aerial Vehicles Laboratory",
    information: "Laboratory dedicated to unmanned aerial vehicle (UAV) research, design, development, and testing.",
    location: "Uburu, Ebonyi State",
  },
  {
    acronym: "COPINE",
    labName: "Cooperative Information Network (COPINE)",
    information: "COPINE is part of National Space Research and Development Agency (NASRDA); and we are mandated by the Federal Governmnent of Nigeria to use Satellite based Remote Sensing and Geographic Information System (RS/GIS) technology for natural resource management and optimization of our clients’ organizational and business capacities.",
    location: "Ile-ife, Osun State",
  },
  {
    acronym: "AACEL",
    labName: "Advanced Aircraft Engineering Laboratory",
    information: "The Advanced Aircraft Engineering Laboratory (AACEL), also referred to as AACELab, in Zamfara State, is a facility focused on advanced research and development in aircraft engineering. It aims to enhance Nigeria’s capabilities in civil aviation, including aircraft maintenance and manufacturing.",
    location: "Zamfara State",
  },
  {
    acronym: "SCRD",
    labName: "Space Composite Material Resaerch & Development",
    information: "The Space Composite Material Research & Development (SCRD) in Kwara State focuses on composite material development for aerospace applications.",
    location: "Kwara State",
  },
  {
    acronym: "ANEOL",
    labName: "Advanced Near Earth Object Laboratory",
    information: "The Advanced Near Earth Object Laboratory (ANEOL) is in Owerri,Imo State.",
    location: "Owerri, Imo State",
  },
  {
    acronym: "AAQL",
    labName: "Advanced Air Quality Laboratory",
    information: " ",
    location: "Akungba-Akoko, Ondo State",
  },
  {
    acronym: "ASERL",
    labName: "Advanced Space Environmental Research Laboratory",
    information: "Advanced Space Environmental Research Laboratory (ASERL) Edo State",
    location: "Edo State",
  },
  {
    acronym: "ASCOLAB",
    labName: "Space Composite Material Research and Development Laboratory",
    information: "Space Composite Material Research and Development Laboratory (ASCOLAB) Kwara State",
    location: "Kwara State",
  },
  {
    acronym: "ZASTAL-G",
    labName: "Zonal Advanced Space Technology Application Laboratory",
    information: "Regional laboratory established to advance space technology applications, research, innovation, and capacity building for the North-East region.",
    location: "Kashere, Gombe State",
  },
  {
    acronym: "ZASTAL-K",
    labName: "Zonal Advanced Space Technology Application Laboratory",
    information: "Regional laboratory established to advance space technology applications, research, innovation, and capacity building for the North-West region.",
    location: "Kano, Kano State",
  },
  {
    acronym: "ZATL",
    labName: "Zonal Advanced Technology Application Laboratory",
    information: "Regional laboratory established to advance space technology applications, research, innovation, and capacity building for the South-East region.",
    location: "Ebonyi State",
  },
  {
    acronym: "ZASTAL",
    labName: "Zonal Advanced Space Technology Application Laboratory",
    information: "Regional laboratory established to advance space technology applications, research, innovation, and capacity building for the North-Central region.",
    location: "Langtang, Plateau State",
  },
];

const CentreCard: React.FC<{ c: Centre }> = ({ c }) => (
  <View style={st.card}>
    <View style={[st.accentBar, { backgroundColor: c.accentColor }]} />
    <View style={st.cardMain}>
      <View style={st.cardHeader}>
        <View style={[st.imageBox, { borderColor: `${c.accentColor}40` }]}>
          <Image source={{ uri: c.imageUri }} style={st.centreImage} resizeMode="cover" />
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
      <Text style={st.cardDesc}>{c.desc.substring(0, 200)}{c.desc.length > 200 ? "..." : ''}</Text>
      <View style={st.cardFooter}>
        {c.url ? (
          <TouchableOpacity style={st.visitBtn} onPress={() => Linking.openURL(c.url)}>
            <Text style={st.visitLink}>Visit website</Text>
            <Ionicons name="open-outline" size={11} color={colors.green2} />
          </TouchableOpacity>
        ) : <View />}
      </View>
    </View>
  </View>
);

const LaboratoryCard: React.FC<{ lab: Laboratory; index: number }> = ({ lab, index }) => {
  // Generate a consistent color based on acrony
  
  const labColor = colors.green2;
  
  return (
    <View style={st.card}>
      <View style={[st.accentBar, { backgroundColor: labColor }]} />
      <View style={st.cardMain}>
        <View style={st.cardHeader}>
          <View style={[st.imageBox, { borderColor: `${labColor}40`, backgroundColor: `${labColor}10`, alignItems: 'center', justifyContent: 'center' }]}>
            <FontAwesome5 name="flask" size={28} color={labColor} />
          </View>
          <View style={st.cardTitleBlock}>
            <View style={[st.codeBadge, { backgroundColor: `${labColor}18` }]}>
              <Text style={[st.codeText, { color: labColor }]}>{lab.acronym}</Text>
            </View>
            <Text style={st.cardName} numberOfLines={2}>{lab.labName}</Text>
            <View style={st.locRow}>
              <Ionicons name="location-outline" size={11} color={colors.textThird} />
              <Text style={st.cardLoc}>{lab.location}</Text>
            </View>
          </View>
        </View>
        <Text style={st.cardDesc}>{lab.information}</Text>
      </View>
    </View>
  );
};

type TabType = 'centres' | 'laboratories';

export const CentresScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<TabType>('centres');

  const getCount = () => {
    if (activeTab === 'centres') return CENTRES.length;
    return nasrdaLaboratories.length;
  };

  const getTitle = () => {
    if (activeTab === 'centres') return 'ACTIVITY CENTRES';
    return 'RESEARCH LABORATORIES';
  };

  return (
    <View style={[st.root, { paddingTop: insets.top }]}>
      <View style={st.nav}>
        <NavLogo />
        <Text style={st.navTitle}>Activity Centres And Labs</Text>
        <FontAwesome5 name="flask" size={17} color={colors.textThird} />
      </View>

      {/* Tab Bar */}
      <View style={st.tabBar}>
        <TouchableOpacity 
          style={[st.tab, activeTab === 'centres' && st.tabActive]} 
          onPress={() => setActiveTab('centres')}
        >
          <Text style={[st.tabText, activeTab === 'centres' && st.tabTextActive]}>
            Centres ({CENTRES.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[st.tab, activeTab === 'laboratories' && st.tabActive]} 
          onPress={() => setActiveTab('laboratories')}
        >
          <Text style={[st.tabText, activeTab === 'laboratories' && st.tabTextActive]}>
            Laboratories ({nasrdaLaboratories.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={st.scroll}>


        {/* Section header */}
        <View style={st.sectionHdr}>
          <Text style={st.sectionLabel}>{getTitle()}</Text>
          <View style={st.sectionLine} />
        </View>

        {/* List based on active tab */}
        {activeTab === 'centres' ? (
          CENTRES.map((c, i) => <CentreCard key={i} c={c} />)
        ) : (
          nasrdaLaboratories.map((lab, i) => <LaboratoryCard key={i} lab={lab} index={i} />)
        )}
        
        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
};

export default CentresScreen;

const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.navy },
  scroll: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20 },
  nav: {
    height: 56, backgroundColor: 'rgba(10,22,40,0.98)',
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 20, gap: 12,
    borderBottomWidth: 1, borderBottomColor: 'rgba(0,166,81,0.18)',
  },
  navTitle: { flex: 1, fontSize: 16, fontWeight: '800', color: '#fff', letterSpacing: -0.3 },

  /* Tab Bar */
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(10,22,40,0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(79,195,247,0.1)',
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: colors.green2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textThird,
  },
  tabTextActive: {
    color: colors.green2,
  },

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
  cardLoc: { fontSize: 14, color: colors.textThird },

  cardDesc: { fontSize: 14, color: colors.textSecond, lineHeight: 25, marginBottom: 12 },

  cardFooter: {
    flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1, borderTopColor: 'rgba(79,195,247,0.08)',
  },
  visitBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  visitLink: { fontSize: 11, fontWeight: '700', color: colors.green2 },
});