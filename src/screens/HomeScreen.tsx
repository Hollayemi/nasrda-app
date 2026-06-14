import React, { useEffect, useRef } from 'react';
import {
  View, Text, Image, ScrollView, TouchableOpacity,
  Animated, StyleSheet, StatusBar, Dimensions, ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme';
import { NASRDA_LOGO_URI } from '../components/NavLogo';
import { useGetPostsQuery } from '@/redux/services/wpApi';

const { width } = Dimensions.get('window');
const LOGO = { uri: NASRDA_LOGO_URI };

// Type definitions for WordPress post data
type WPMedia = {
  source_url: string;
  media_details?: {
    sizes?: {
      medium?: { source_url: string };
      large?: { source_url: string };
      thumbnail?: { source_url: string };
    };
  };
};

type WPPost = {
  id: number;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  date: string;
  slug: string;
  link: string;
  featured_media: number;
  _embedded?: {
    'wp:featuredmedia'?: WPMedia[];
    author?: Array<{ name: string }>;
    'wp:term'?: Array<Array<{ name: string; taxonomy: string }>>;
  };
  categories?: number[];
  tags?: number[];
};

// Helper: Get best image URL from WordPress media
const getImageUrl = (post: WPPost): string => {
  const media = post._embedded?.['wp:featuredmedia']?.[0];
  if (!media) {
    // Fallback to default NASRDA image
    return 'https://central.nasrda.gov.ng/wp-content/uploads/2025/04/NASRDA_Gate1.jpg';
  }
  
  // Try to get a medium/large size first
  const sizes = media.media_details?.sizes;
  if (sizes?.large?.source_url) return sizes.large.source_url;
  if (sizes?.medium?.source_url) return sizes.medium.source_url;
  if (sizes?.thumbnail?.source_url) return sizes.thumbnail.source_url;
  
  return media.source_url;
};

// Helper: Strip HTML tags
const stripHtml = (html: string): string => {
  return html.replace(/<[^>]*>/g, '').trim();
};

// Helper: Format date to "Month Year" format
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) !== 1 ? 's' : ''} ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

// Helper: Get primary category
const getPrimaryCategory = (post: WPPost): string => {
  const terms = post._embedded?.['wp:term']?.[0];
  if (terms && terms.length > 0) {
    return terms[0].name.toUpperCase();
  }
  return 'NASRDA NEWS';
};

// Helper: Get tag color based on category
const getTagColor = (category: string): string => {
  const cat = category.toLowerCase();
  if (cat.includes('partnership') || cat.includes('collaboration')) return colors.green2;
  if (cat.includes('innovation') || cat.includes('technology')) return colors.sky;
  if (cat.includes('event') || cat.includes('launch')) return colors.gold;
  if (cat.includes('policy') || cat.includes('council')) return colors.green;
  return colors.sky;
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
        Animated.timing(o, { toValue: 0.9, duration: 1800, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(s, { toValue: 1, duration: 1800, useNativeDriver: true }),
        Animated.timing(o, { toValue: 0.4, duration: 1800, useNativeDriver: true }),
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
      borderTopColor: colors.green2,
      borderRightColor: colors.sky,
      borderBottomColor: colors.gold,
      borderLeftColor: colors.green,
      transform: [{ rotate }],
    }} />
  );
};

const BlinkDot: React.FC = () => {
  const o = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(o, { toValue: 0.15, duration: 600, useNativeDriver: true }),
      Animated.timing(o, { toValue: 1, duration: 600, useNativeDriver: true }),
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
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 1.8 + 0.4,
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

/* ─── HomeScreen ────────────────────────────────────────────── */
export const HomeScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const { data: posts, isLoading, isError, refetch } = useGetPostsQuery();
  
  // Get only the 6 most recent posts
  const recentPosts = posts && Array.isArray(posts) ? posts.slice(0, 6) : [];
  const featuredPost = recentPosts[0];
  const latestPosts = recentPosts.slice(1);

  const handleNewsPress = (postId: number) => {
    router.push(`/news/${postId}`);
  };

  return (
    <View style={[st.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ScrollView
        style={st.feed}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor={colors.green2} />
        }
      >
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
            <OrbitRing size={240} borderColor="rgba(0,166,81,0.28)" dotColor={colors.green2} duration={9000} />
            <OrbitRing size={186} borderColor="rgba(79,195,247,0.18)" dotColor={colors.gold} duration={5500} reverse />
            <OrbitRing size={132} borderColor="rgba(245,168,0,0.2)" dotColor={colors.sky} duration={13000} dashed />
            <SpinRing />
            <View style={st.logoDisc}>
              <Image source={LOGO} style={st.logoImg} resizeMode="contain" />
            </View>
          </View>

          {/* Agency name */}
          <View style={st.heroText}>
            <Text style={st.agencyName}>NATIONAL SPACE RESEARCH{'\n'}& DEVELOPMENT AGENCY</Text>
          </View>
        </View>

        {/* ── News feed ── */}
        <View style={st.feedContent}>
          {/* Section header */}
          <View style={st.sectionHdr}>
            <Text style={st.sectionTitle}>Latest News</Text>
            <TouchableOpacity
              style={st.seeAllBtn}
              onPress={() => router.push('/(tabs)/news')}
            >
              <Text style={st.seeAll}>See all</Text>
              <Ionicons name="chevron-forward" size={13} color={colors.green2} />
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <View style={st.loadingContainer}>
              <ActivityIndicator size="large" color={colors.green2} />
              <Text style={st.loadingText}>Loading latest news...</Text>
            </View>
          ) : isError ? (
            <View style={st.errorContainer}>
              <Ionicons name="cloud-offline-outline" size={48} color={colors.textThird} />
              <Text style={st.errorText}>Unable to load news</Text>
              <TouchableOpacity style={st.retryBtn} onPress={() => refetch()}>
                <Text style={st.retryBtnText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : recentPosts.length === 0 ? (
            <View style={st.emptyContainer}>
              <Text style={st.emptyText}>No news articles available</Text>
            </View>
          ) : (
            <>
              {/* Featured card - most recent post */}
              {featuredPost && (
                <TouchableOpacity
                  style={st.featCard}
                  onPress={() => handleNewsPress(featuredPost.id)}
                  activeOpacity={0.85}
                >
                  <Image
                    source={{ uri: getImageUrl(featuredPost) }}
                    style={st.featBgImage}
                    resizeMode="cover"
                  />
                  <View style={st.featScrim} />
                  <View style={st.featContent}>
                    <View style={[st.tag, { backgroundColor: colors.green }]}>
                      <Text style={st.tagTxt}>{getPrimaryCategory(featuredPost)}</Text>
                    </View>
                    <Text style={st.featTitle} numberOfLines={2}>
                      {stripHtml(featuredPost.title.rendered)}
                    </Text>
                    <View style={st.featMetaRow}>
                      <Ionicons name="time-outline" size={11} color="rgba(232,240,248,0.7)" />
                      <Text style={st.featMeta}>{formatDate(featuredPost.date)}</Text>
                      <Ionicons name="chevron-forward" size={14} color={colors.green2} style={{ marginLeft: 'auto' }} />
                    </View>
                  </View>
                </TouchableOpacity>
              )}

              {/* Divider label */}
              <Text style={st.dividerLabel}>RECENT UPDATES</Text>

              {/* News rows - 5 most recent posts (excluding featured) */}
              {latestPosts.map((post: WPPost) => {
                const category = getPrimaryCategory(post);
                const tagColor = getTagColor(category);
                
                return (
                  <TouchableOpacity
                    key={post.id}
                    style={st.newsRow}
                    onPress={() => handleNewsPress(post.id)}
                    activeOpacity={0.8}
                  >
                    <View style={st.newsThumb}>
                      <Image
                        source={{ uri: getImageUrl(post) }}
                        style={st.newsThumbImg}
                        resizeMode="cover"
                      />
                      <View style={st.newsThumbOverlay} />
                    </View>
                    <View style={st.newsBody}>
                      <Text style={[st.newsTag, { color: tagColor }]}>{category}</Text>
                      <Text style={st.newsTitle} numberOfLines={2}>
                        {stripHtml(post.title.rendered)}
                      </Text>
                      <Text style={st.newsDate}>{formatDate(post.date)}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={14} color={colors.textThird} style={{ marginTop: 2 }} />
                  </TouchableOpacity>
                );
              })}
            </>
          )}
        </View>
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

  /* Loading/Error/Empty states */
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  loadingText: {
    color: colors.textThird,
    fontSize: 14,
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  errorText: {
    color: colors.textThird,
    fontSize: 14,
  },
  retryBtn: {
    backgroundColor: colors.green2,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
    marginTop: 8,
  },
  retryBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: colors.textThird,
    fontSize: 14,
  },

  /* Featured card */
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