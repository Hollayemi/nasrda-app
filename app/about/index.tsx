import React, { useRef } from 'react';
import {
  View, Text, Image, ScrollView, TouchableOpacity,
  StyleSheet, Dimensions, Animated, Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '@/src/theme';
import { NASRDA_LOGO_URI } from '@/src/components/NavLogo';
import { router, Route } from 'expo-router';


const { width, height } = Dimensions.get('window');

// NASRDA Images
const NASRDA_IMAGES = {
  gate: 'https://central.nasrda.gov.ng/wp-content/uploads/2025/04/NASRDA_Gate1.jpg',
  dg: '/assets/dg.png',
  headquarters: 'https://central.nasrda.gov.ng/wp-content/uploads/2026/05/NASRDA-UNDRR-ECHO-ECOWAS-1-768x546.jpeg',
  satellite: 'https://central.nasrda.gov.ng/wp-content/uploads/2026/05/NASRDA-SME-Access-Bank-768x549.jpeg',
};

const AboutSection: React.FC<{ title: string; children: React.ReactNode; delay?: number }> = ({
  title, children, delay = 0
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        st.sectionCard,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }
      ]}
    >
      <Text style={st.sectionTitle}>{title}</Text>
      {children}
    </Animated.View>
  );
};

const StatCard: React.FC<{ value: string; label: string; icon: string; color: string; to: Route }> = ({
  value, label, icon, color, to
}) => (
  <TouchableOpacity onPress={() => router.push(to || "/about")} style={[st.statCard, { borderBottomColor: color }]}>
    <View style={[st.statIconContainer, { backgroundColor: `${color}15` }]}>
      <Ionicons name={icon as any} size={24} color={color} />
    </View>
    <Text style={[st.statValue, { color }]}>{value}</Text>
    <Text style={st.statLabel}>{label}</Text>
  </TouchableOpacity>
);

const MilestoneItem: React.FC<{ year: string; title: string; description: string }> = ({
  year, title, description
}) => (
  <View style={st.milestoneItem}>
    <View style={st.milestoneYear}>
      <Text style={st.milestoneYearText}>{year}</Text>
    </View>
    <View style={st.milestoneContent}>
      <Text style={st.milestoneTitle}>{title}</Text>
      <Text style={st.milestoneDesc}>{description}</Text>
    </View>
  </View>
);

export const AboutScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const scrollY = useRef(new Animated.Value(0)).current;

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const handleEmailPress = () => {
    Linking.openURL('mailto:dg@nasrda.gov.ng');
  };

  const handlePhonePress = () => {
    Linking.openURL('tel:+2347055101727');
  };

  return (
    <View style={st.root}>
      <Animated.View style={[st.headerBar, { opacity: headerOpacity, paddingTop: insets.top }]}>
        <Text style={st.headerTitle}>About NASRDA</Text>
      </Animated.View>



      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Hero Image - NASRDA Gate */}
        <TouchableOpacity onPress={() => router.back()} style={st.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={st.heroContainer}>
          <Image source={{ uri: NASRDA_IMAGES.gate }} style={st.heroImage} resizeMode="cover" />
          <View style={st.heroOverlay} />
          <View style={[st.heroContent, { paddingTop: insets.top + 20 }]}>
            <View style={st.logoContainer}>
              <Image source={{ uri: NASRDA_LOGO_URI }} style={st.heroLogo} resizeMode="contain" />
            </View>
            <Text style={st.heroTitle}>National Space Research{'\n'}& Development Agency</Text>
            <Text style={st.heroSubtitle}>Driving Nigeria's Space Economy & Innovation</Text>
            <View style={st.establishedBadge}>
              <Ionicons name="calendar" size={14} color={colors.green2} />
              <Text style={st.establishedText}>Est. 1999</Text>
            </View>
          </View>
        </View>

        {/* Mission & Vision */}
        <View style={st.contentContainer}>
          <AboutSection title="Mission" delay={100}>
            <Text style={st.missionText}>
              To vigorously pursue the attainment of space capabilities and the enhancement of the quality of life of mankind through space-related research and development (R&D), as well as capacity building in the
              fields of science, engineering, space law, and administration,
              for sustainable national development.
            </Text>
          </AboutSection>

          <AboutSection title="Vision" delay={200}>
            <Text style={st.visionText}>
              To develop Nigeria’s indigenous expertise in
              designing and building hardware and software for space
              science and technology, utilizing them as essential tools for
              socio-economic development and enhancement of the quality of life of its people.
            </Text>
          </AboutSection>

          {/* Stats Row */}
          <View style={st.statsGrid}>
            <StatCard to="/(tabs)/centres" value="28" label="Centres & Labs" icon="business-outline" color={colors.green2} />
            <StatCard to="/(tabs)/missions" value="7" label="Satellites" icon="rocket-outline" color={colors.sky} />
            <StatCard to='/' value="6" label="Geo Political Zones" icon="globe-outline" color={colors.gold} />
          </View>

          {/* About NASRDA Section */}
          <AboutSection title="About NASRDA" delay={300}>
            <Text style={st.bodyText}>
              The National Space Research and Development Agency (NASRDA) is Nigeria's premier space agency,
              established in 1999 with a mandate to pursue the attainment of space capabilities as an essential
              tool for Nigeria's socio-economic development.
            </Text>
            <Text style={[st.bodyText, { marginTop: 12 }]}>
              The Agency has successfully launched several satellites including NigeriaSat-1, NigeriaSat-2,
              NigeriaSat-X, and NigComSat-1R, positioning Nigeria as a leader in the African space ecosystem.
            </Text>
            <View style={st.statsRow}>
              <View style={st.statItem}>
                <Text style={st.statNumber}>300+</Text>
                <Text style={st.statLabel}>PhD Holders</Text>
              </View>
              <View style={st.statDivider} />
              <View style={st.statItem}>
                <Text style={st.statNumber}>1,000+</Text>
                <Text style={st.statLabel}>Master's Degrees</Text>
              </View>
            </View>
          </AboutSection>

          {/* Director General Section */}
          <View style={st.dgSection}>
            <Animated.View style={[st.dgCard, { transform: [{ translateY: 0 }] }]}>
              <View style={st.dgImageContainer}>
                <Image source={require("@/assets/dg.png")} style={st.dgImage} resizeMode="cover" />
                <View style={st.dgOverlay} />
                <View style={st.dgQuoteIcon}>
                  {/* <Ionicons name="quote" size={30} color={colors.green2} /> */}
                </View>
              </View>
              <View style={st.dgContent}>
                <Text style={st.dgName}>Dr. Matthew Adepoju</Text>
                <Text style={st.dgTitle}>DG/CE - NASRDA</Text>

                <Text style={st.milestoneTitle}>3 Points Agenda</Text>
                <View style={[st.achievementItem, { paddingTop: 10, }]}>
                  <Ionicons name="checkmark-circle" size={16} color={colors.green2} />
                  <Text style={st.achievementText}>Transformation of NASRDA towards global competitiveness</Text>
                </View>
                <View style={[st.achievementItem, { paddingTop: 10, }]}>
                  <Ionicons name="checkmark-circle" size={16} color={colors.green2} />
                  <Text style={st.achievementText}>Unleash the greatness within our staff to manifest their dreams</Text>
                </View>
                <View style={[st.achievementItem, { paddingTop: 10, }]}>
                  <Ionicons name="checkmark-circle" size={16} color={colors.green2} />
                  <Text style={st.achievementText}>Mainstreaming the private sector into Nigeria's space ecosystem</Text>
                </View>
                <Text style={[st.milestoneDesc, { paddingTop: 20, lineHeight: 20, color: colors.textSecond, }]}>
                  "Let's join hands to rebuild NASRDA. All is NOT about money but great ideas that give birth to prosperity and financial freedom."
                </Text>
                {/* <Text style={st.dgBio}>
                  Dr. Matthew Adepoju is a visionary leader and transformative force in Nigeria's space sector.
                  Appointed as Director General of NASRDA, he has championed a bold three-point agenda focused on
                  empowering personnel, fostering strategic partnerships, and driving innovation in space technology
                  applications.
                </Text>

                <Text style={[st.dgBio, { marginTop: 12 }]}>
                  Under his leadership, NASRDA has witnessed unprecedented growth in satellite technology development,
                  international collaborations, and the commercialization of space research for national development.
                  His vision has positioned NASRDA as Africa's leading space agency, driving the continent's space
                  economy agenda.
                </Text> */}
                <View style={st.dgAchievements}>
                  <View style={st.achievementItem}>
                    <Ionicons name="checkmark-circle" size={16} color={colors.green2} />
                    <Text style={st.achievementText}>3-Point Agenda Implementation</Text>
                  </View>
                  <View style={st.achievementItem}>
                    <Ionicons name="checkmark-circle" size={16} color={colors.green2} />
                    <Text style={st.achievementText}>Strategic Global Partnerships</Text>
                  </View>
                  <View style={st.achievementItem}>
                    <Ionicons name="checkmark-circle" size={16} color={colors.green2} />
                    <Text style={st.achievementText}>Research Commercialization Drive</Text>
                  </View>
                  <View style={st.achievementItem}>
                    <Ionicons name="checkmark-circle" size={16} color={colors.green2} />
                    <Text style={st.achievementText}>Youth Empowerment Initiatives</Text>
                  </View>
                </View>
              </View>
            </Animated.View>
          </View>

          {/* Key Milestones */}
          <AboutSection title="Key Milestones" delay={400}>
            <MilestoneItem
              year="1999"
              title="NASRDA Established"
              description="National Space Research and Development Agency founded to drive Nigeria's space ambitions."
            />
            <MilestoneItem
              year="2003"
              title="NigeriaSat-1 Launch"
              description="Nigeria's first earth observation satellite launched into orbit."
            />
            <MilestoneItem
              year="2011"
              title="NigeriaSat-2 & NigeriaSat-X"
              description="Two satellites launched, demonstrating indigenous satellite development capability."
            />
            {/* <MilestoneItem
              year="2024"
              title="New Strategic Direction"
              description="Dr. Matthew Adepoju appointed DG, ushering in a new era of innovation and partnerships."
            />
            <MilestoneItem
              year="2026"
              title="ASEICC Conference"
              description="Hosting Africa's premier space economy conference with UNOOSA support."
            /> */}
          </AboutSection>

          {/* Core Values */}
          {/* <AboutSection title="Core Values" delay={500}>
            <View style={st.valuesGrid}>
              {[
                { icon: "star", label: "Excellence", color: colors.gold },
                { icon: "people", label: "Innovation", color: colors.sky },
                { icon: "handshake", label: "Integrity", color: colors.green2 },
                { icon: "globe", label: "Global Standards", color: colors.green },
              ].map((value, idx) => (
                <View key={idx} style={st.valueItem}>
                  <View style={[st.valueIcon, { backgroundColor: `${value.color}15` }]}>
                    <MaterialCommunityIcons name={value.icon as any} size={22} color={value.color} />
                  </View>
                  <Text style={st.valueLabel}>{value.label}</Text>
                </View>
              ))}
            </View>
          </AboutSection> */}

          {/* Contact Section */}
          <View style={st.contactSection}>
            <Text style={st.contactTitle}>Get in Touch</Text>
            <View style={st.contactButtons}>
              <TouchableOpacity style={st.contactBtn} onPress={handleEmailPress}>
                <Ionicons name="mail-outline" size={20} color={colors.green2} />
                <Text style={st.contactBtnText}>Email Us</Text>
              </TouchableOpacity>
              <TouchableOpacity style={st.contactBtn} onPress={handlePhonePress}>
                <Ionicons name="call-outline" size={20} color={colors.green2} />
                <Text style={st.contactBtnText}>Call Us</Text>
              </TouchableOpacity>
            </View>
            <Text style={st.address}>
              NASRDA Headquarters,{'\n'}
              Umaru Musa Yar'adua Expressway,{'\n'}
              Lugbe, Abuja, Nigeria
            </Text>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </Animated.ScrollView>
    </View>
  );
};

export default AboutScreen;

const st = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.navy,
  },
  headerBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(8,18,38,0.95)',
    paddingBottom: 12,
    paddingHorizontal: 20,
    zIndex: 100,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,166,81,0.2)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
  heroContainer: {
    height: height * 0.55,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(8,18,38,0.65)',
  },
  heroContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    alignItems: 'center',
  },
  logoContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#fff',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#fff',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  heroLogo: {
    width: 70,
    height: 70,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 28,
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: 12,
    color: colors.green2,
    marginTop: 8,
    fontWeight: '600',
    letterSpacing: 1,
  },
  establishedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    backgroundColor: 'rgba(0,166,81,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  establishedText: {
    fontSize: 11,
    color: colors.green2,
    fontWeight: '500',
  },
  contentContainer: {
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  sectionCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(79,195,247,0.08)',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.green2,
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  missionText: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.textPrimary,
    // fontStyle: 'italic',
    textAlign: 'center',
  },
  visionText: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderBottomWidth: 3,
  },
  statIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 10,
    color: colors.textThird,
    marginTop: 4,
    textAlign: 'center',
  },
  bodyText: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.textSecond,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(79,195,247,0.08)',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.green2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(79,195,247,0.15)',
  },
  dgSection: {
    marginBottom: 16,
  },
  dgCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0,166,81,0.2)',
  },
  dgImageContainer: {
    position: 'relative',
    height: 300,
  },
  dgImage: {
    width: '100%',
    height: '100%',
    objectFit: "fill"
  },
  dgOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  dgQuoteIcon: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0,166,81,0.2)',
    borderRadius: 20,
    padding: 8,
  },
  dgContent: {
    padding: 20,
  },
  dgName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 4,
  },
  dgTitle: {
    fontSize: 13,
    color: colors.green2,
    fontWeight: '600',
    marginBottom: 12,
  },
  dgBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(245,168,0,0.12)',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 16,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 16,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 30,
    padding: 8,
  },
  dgBadgeText: {
    fontSize: 11,
    color: colors.gold,
    fontWeight: '600',
  },
  dgBio: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.textSecond,
  },
  dgAchievements: {
    marginTop: 16,
    gap: 8,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  achievementText: {
    fontSize: 13,
    color: colors.textPrimary,
  },
  milestoneItem: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  milestoneYear: {
    width: 60,
    backgroundColor: 'rgba(0,166,81,0.12)',
    borderRadius: 8,
    paddingVertical: 6,
    alignItems: 'center',
    height: 34,
  },
  milestoneYearText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.green2,
  },
  milestoneContent: {
    flex: 1,
  },
  milestoneTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  milestoneDesc: {
    fontSize: 12,
    color: colors.textThird,
    lineHeight: 18,
  },
  valuesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
  },
  valueItem: {
    alignItems: 'center',
    width: '22%',
  },
  valueIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  valueLabel: {
    fontSize: 11,
    color: colors.textPrimary,
    fontWeight: '600',
    textAlign: 'center',
  },
  contactSection: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,166,81,0.15)',
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
  },
  contactButtons: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  contactBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(0,166,81,0.12)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(0,166,81,0.3)',
  },
  contactBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.green2,
  },
  address: {
    fontSize: 12,
    color: colors.textThird,
    textAlign: 'center',
    lineHeight: 18,
  },
});